// Prüft die Extension mit echten CodeMirror-Transaktionen und simulierten AI-Callbacks.
import { history, undo } from '@codemirror/commands';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CodeEditorInlineEditCallback, CodeEditorInlineEditRequest, CodeEditorInlineEditResponse } from '../types';
import { inlineEditExtension, isInlineEditActive, openInlineEdit } from './index';

const views: EditorView[] = [];
const hosts: HTMLElement[] = [];
const originalExecCommand = Object.getOwnPropertyDescriptor(document, 'execCommand');

// jsdom meldet sich als WebKit, implementiert aber CodeMirrors Safari-Selection-Fallback nicht.
beforeEach(() => {
  if (typeof document.execCommand !== 'function') {
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: () => false,
    });
  }
});

// Jede View wird unabhängig erstellt, auch in einem Shadow Root wie im NTE-Editor.
function setup(
  doc: string,
  selection: { anchor: number; head?: number },
  edit: CodeEditorInlineEditCallback,
  readOnly = false,
  canEdit = true,
) {
  const host = document.body.appendChild(document.createElement('div'));
  hosts.push(host);
  const parent = host.attachShadow({ mode: 'open' }).appendChild(document.createElement('div'));
  const compartment = new Compartment();
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc, selection,
      extensions: [
        history(),
        EditorState.readOnly.of(readOnly),
        compartment.of(inlineEditExtension({
          edit, key: 'Mod-k', language: () => 'text', canEdit: () => canEdit,
        })),
      ],
    }),
  });
  views.push(view);
  return { view, compartment };
}

// Cleanup verhindert, dass Tooltip-Views oder ausstehende Requests in andere Tests gelangen.
afterEach(() => {
  for (const view of views.splice(0)) view.destroy();
  for (const host of hosts.splice(0)) host.remove();
  if (originalExecCommand) {
    Object.defineProperty(document, 'execCommand', originalExecCommand);
  } else {
    Reflect.deleteProperty(document, 'execCommand');
  }
});

// Ein echtes Eingabefeld und die Buttons werden über die sichtbare Oberfläche bedient.
function enterPrompt(view: EditorView, prompt: string): void {
  const input = view.dom.querySelector<HTMLInputElement>('.cm-ai-edit-prompt input');
  expect(input).not.toBeNull();
  input!.value = prompt;
  input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
}

function clickButton(view: EditorView, label: string): void {
  const button = Array.from(view.dom.querySelectorAll<HTMLButtonElement>('.cm-ai-edit-prompt button'))
    .find(element => element.textContent === label);
  expect(button).toBeDefined();
  button!.click();
}

function preview(view: EditorView): Element | null {
  return view.dom.querySelector('.cm-ai-edit-preview .cm-content');
}

describe('Inline Edit und Insert', () => {
  // Einfügen an UTF-16-Offsets darf weder benachbarten Text noch Zeilenumbrüche ersetzen.
  it('inserts at the exact cursor only after Accept and supports undo', async () => {
    const edit = vi.fn<CodeEditorInlineEditCallback>(async () => ({ text: 'NEW' }));
    const { view } = setup('a😀b', { anchor: 3 }, edit);
    expect(openInlineEdit(view)).toBe(true);
    expect(isInlineEditActive(view)).toBe(true);
    enterPrompt(view, 'insert text');
    expect(edit).toHaveBeenCalledOnce();
    expect(edit).toHaveBeenCalledWith({
      language: 'text', prompt: 'insert text', selection: '',
      codeBefore: 'a😀', codeAfter: 'b', from: 3, to: 3,
      signal: expect.any(AbortSignal),
    });
    await Promise.resolve();
    expect(preview(view)?.textContent).toContain('NEW');
    expect(view.state.doc.toString()).toBe('a😀b');
    clickButton(view, 'Accept');
    expect(view.state.doc.toString()).toBe('a😀NEWb');
    expect(isInlineEditActive(view)).toBe(false);
    expect(undo(view)).toBe(true);
    expect(view.state.doc.toString()).toBe('a😀b');
  });

  // Markierungen behalten den bestehenden Vertrag über vollständige Zeilen.
  it.each(['Accept', 'Reject'])('previews full-line edits and handles %s', async action => {
    const edit = vi.fn<CodeEditorInlineEditCallback>(async () => ({ text: 'REPLACEMENT' }));
    const { view } = setup('before\nselected\nafter', { anchor: 9, head: 12 }, edit);
    expect(openInlineEdit(view)).toBe(true);
    enterPrompt(view, 'rewrite');
    expect(edit).toHaveBeenCalledWith({
      language: 'text', prompt: 'rewrite', selection: 'selected',
      codeBefore: 'before\n', codeAfter: '\nafter', from: 7, to: 15,
      signal: expect.any(AbortSignal),
    });
    await Promise.resolve();
    expect(preview(view)?.textContent).toContain('REPLACEMENT');
    expect(view.state.doc.toString()).toBe('before\nselected\nafter');
    clickButton(view, action);
    expect(view.state.doc.toString()).toBe(
      action === 'Accept' ? 'before\nREPLACEMENT\nafter' : 'before\nselected\nafter',
    );
    expect(isInlineEditActive(view)).toBe(false);
  });

  // Null und leere Antworten verändern nichts; der Prompt bleibt wiederholbar.
  it.each([null, { text: '' }])('preserves source and prompt for an empty response', async response => {
    const edit = vi.fn<CodeEditorInlineEditCallback>(async () => response);
    const { view } = setup('abc', { anchor: 1 }, edit);
    expect(openInlineEdit(view)).toBe(true);
    enterPrompt(view, 'insert');
    await Promise.resolve();
    expect(preview(view)).toBeNull();
    expect(view.state.doc.toString()).toBe('abc');
    expect(view.dom.querySelector<HTMLInputElement>('.cm-ai-edit-prompt input')?.value).toBe('insert');
    clickButton(view, 'Cancel');
    expect(isInlineEditActive(view)).toBe(false);
  });

  // Schließen, Dokumentwechsel und Reconfiguration müssen verspätete Antworten entwerten.
  it.each(['Escape', 'document change', 'reconfigure'])('aborts a pending request on %s', async reason => {
    let finish!: (value: CodeEditorInlineEditResponse) => void;
    let request!: CodeEditorInlineEditRequest;
    const edit: CodeEditorInlineEditCallback = value => {
      request = value;
      return new Promise(resolve => { finish = resolve; });
    };
    const { view, compartment } = setup('abc', { anchor: 1 }, edit);
    expect(openInlineEdit(view)).toBe(true);
    enterPrompt(view, 'insert');
    expect(request.signal?.aborted).toBe(false);
    if (reason === 'Escape') {
      view.dom.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape', bubbles: true, cancelable: true,
      }));
    } else if (reason === 'document change') {
      view.dispatch({ changes: { from: 0, to: 3, insert: 'changed' } });
    } else {
      view.dispatch({ effects: compartment.reconfigure([]) });
    }
    expect(request.signal?.aborted).toBe(true);
    expect(isInlineEditActive(view)).toBe(false);
    finish({ text: 'late response' });
    await Promise.resolve();
    expect(preview(view)).toBeNull();
    expect(view.state.doc.toString()).toBe(reason === 'document change' ? 'changed' : 'abc');
  });

  // Ein abgebauter Editor darf keine späteren Vorschläge mehr übernehmen.
  it('aborts when the editor is destroyed', async () => {
    let finish!: (value: CodeEditorInlineEditResponse) => void;
    let signal: AbortSignal | undefined;
    const { view } = setup('abc', { anchor: 1 }, request => {
      signal = request.signal;
      return new Promise(resolve => { finish = resolve; });
    });
    expect(openInlineEdit(view)).toBe(true);
    enterPrompt(view, 'insert');
    views.splice(views.indexOf(view), 1);
    view.destroy();
    expect(signal?.aborted).toBe(true);
    finish({ text: 'late' });
    await Promise.resolve();
    expect(view.state.doc.toString()).toBe('abc');
  });

  // Schreibschutz und fehlende Bearbeitungsberechtigung sperren auch den manuellen Trigger.
  it.each([[true, true], [false, false]])('blocks readOnly=%s or canEdit=%s', (readOnly, canEdit) => {
    const edit = vi.fn<CodeEditorInlineEditCallback>();
    const { view } = setup('abc', { anchor: 1 }, edit, readOnly, canEdit);
    expect(openInlineEdit(view)).toBe(false);
    expect(isInlineEditActive(view)).toBe(false);
    expect(edit).not.toHaveBeenCalled();
  });
});
