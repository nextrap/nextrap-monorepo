// Marimo stellt Darstellung, Request-Lifecycle und Tastaturbefehle bereit.
import {
  aiExtension, inlineCompletion, inlineCompletionKeymap, showAiEditInput,
  inputState, completionState,
} from '@marimo-team/codemirror-ai';
import { Prec } from '@codemirror/state';
import type { Extension } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import type {
  CodeEditorInlineCompletionCallback, CodeEditorInlineEditCallback, CodeEditorLanguage,
} from './types';

// Nur die anwendungsspezifischen Callbacks werden an die Plugin-API angepasst.
interface AiOptions {
  completion?: CodeEditorInlineCompletionCallback;
  edit?: CodeEditorInlineEditCallback;
  automatic: boolean;
  delay: number;
  editKey: string;
  language: () => CodeEditorLanguage;
  canEdit: () => boolean;
}

// Die beiden Erweiterungen sind unabhängig; ohne Callback wird nichts installiert.
export function aiExtensions(config: AiOptions): Extension {
  const { completion, edit } = config;
  return [
    completion && config.automatic ? [
      inlineCompletion({
        delay: config.delay,
        includeKeymap: false,
        events: {
          beforeSuggestionFetch: view => config.canEdit() &&
            !view.state.field(inputState, false)?.show &&
            !view.state.field(completionState, false),
        },
        fetchFn: async (state, signal) => {
          const cursor = state.selection.main.head;
          const result = await completion({
            language: config.language(),
            codeBefore: state.sliceDoc(0, cursor),
            codeAfter: state.sliceDoc(cursor),
            cursor,
            signal,
          });
          return result?.text ?? '';
        },
      }),
      // Tab übernimmt Ghost-Text vor der bestehenden Einrückungsbelegung.
      Prec.highest(inlineCompletionKeymap),
    ] : [],
    edit ? aiExtension({
      keymaps: { showInput: config.editKey },
      prompt: async ({ prompt, selection, codeBefore, codeAfter, signal }) => {
        const from = codeBefore.length;
        const result = await edit({
          language: config.language(), prompt, selection, codeBefore, codeAfter,
          from, to: from + selection.length, signal,
        });
        return result?.text || selection;
      },
    }) : [],
  ];
}

// Der öffentliche Edit-Trigger delegiert an den vorhandenen Plugin-Befehl.
export function triggerEdit(view: EditorView): boolean {
  return !view.state.readOnly && view.state.field(inputState, false) !== undefined
    && showAiEditInput(view);
}
