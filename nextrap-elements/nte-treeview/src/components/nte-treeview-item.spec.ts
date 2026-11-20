import { afterEach, describe, expect, it, vi } from 'vitest';

import { TreeModel } from '../tree-model';
import { NteTreeView } from './nte-treeview';
import { NteTreeViewItem } from './nte-treeview-item';

// Die Aktionsdaten erhalten den Auslöser, damit Anwendungen Tastatur und Maus unterscheiden können.
type LabelAction = CustomEvent<{ item: NteTreeViewItem; originalEvent: MouseEvent }>;

// Wartet auch auf die erzeugten Knoten, da das TreeView-Update deren Shadow DOM nicht umfasst.
async function settle(view: NteTreeView): Promise<void> {
  await view.updateComplete;
  await Promise.all(Array.from(view.querySelectorAll('nte-treeview-item'), (item) => item.updateComplete));
}

// Native details-Toggles werden als eigener Task ausgelöst und anschließend in Lit übernommen.
async function settleDisclosure(view: NteTreeView): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await settle(view);
}

// Verwendet registrierte Komponenten mit echtem Light DOM statt vereinfachter Test-Doubles.
async function mount(markup: string): Promise<NteTreeView> {
  const view = new NteTreeView();
  view.innerHTML = markup;
  document.body.append(view);
  await settle(view);
  return view;
}

// Fehlende interne Bedienelemente werden mit ihrem Selektor als Testfehler sichtbar.
function control<T extends Element = HTMLElement>(item: NteTreeViewItem, selector: string): T {
  const element = item.shadowRoot?.querySelector<T>(selector);
  if (!element) throw new Error('TreeView-Bedienelement fehlt: ' + selector);
  return element;
}

// Mausereignisse durchlaufen native Slots und Shadow-Grenzen wie reale Benutzeraktionen.
function pointerClick(target: Element): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, detail: 1 });
  target.dispatchEvent(event);
  return event;
}

// Entfernte TreeViews lösen ihre Modell-Abos und MutationObserver über den normalen Lifecycle.
afterEach(() => {
  document.body.replaceChildren();
});

// Prüft die öffentliche Interaktion mit echten Elementen; Layoutbreiten werden im Browser geprüft.
describe('NteTreeViewItem explorer interactions', () => {
  // Name und eigenes Icon sollen dieselbe Auswahl auslösen, auch wenn ein anderer Eintrag aktiv ist.
  it('selects an item from its label or slotted icon', async () => {
    const view = await mount(`
      <nte-treeview-item id="first">Erste Datei</nte-treeview-item>
      <nte-treeview-item id="second">
        Zweite Datei
        <svg slot="icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M2 2h12v12H2z"></path></svg>
      </nte-treeview-item>
    `);
    const first = view.querySelector<NteTreeViewItem>('#first')!;
    const second = view.querySelector<NteTreeViewItem>('#second')!;
    const changed = vi.fn();
    view.addEventListener('selection-change', changed);

    pointerClick(control(first, '#label'));
    expect(first.selected).toBe(true);

    pointerClick(second.querySelector('path')!);
    expect(first.selected).toBe(false);
    expect(second.selected).toBe(true);
    expect(changed).toHaveBeenCalledTimes(2);
    expect(changed.mock.calls[1][0].detail).toBe(second);
  });

  // Metadaten und freie Zeilenflächen dürfen eine bestehende Auswahl nicht verändern.
  it('ignores row whitespace, metadata and independent cell controls', async () => {
    const view = await mount(`
      <nte-treeview-item id="selected" selected>Ausgewählt</nte-treeview-item>
      <nte-treeview-item id="folder">
        Ordner
        <span slot="center">12 KB</span>
        <button slot="end" type="button">Aktion</button>
        <nte-treeview-item>Datei</nte-treeview-item>
      </nte-treeview-item>
    `);
    const selected = view.querySelector<NteTreeViewItem>('#selected')!;
    const folder = view.querySelector<NteTreeViewItem>('#folder')!;
    const action = vi.fn();
    const selection = vi.fn();
    view.addEventListener('label-click', action);
    view.addEventListener('selection-change', selection);

    for (const selector of ['#row', '#center', '#end']) pointerClick(control(folder, selector));
    pointerClick(folder.querySelector('[slot="center"]')!);
    pointerClick(folder.querySelector('[slot="end"]')!);

    expect(selected.selected).toBe(true);
    expect(folder.selected).toBe(false);
    expect(folder.expanded).toBe(false);
    expect(action).not.toHaveBeenCalled();
    expect(selection).not.toHaveBeenCalled();
  });

  // Das Theme reserviert die Pfeilspalte per CSS; Blätter benötigen dafür keinen DOM-Platzhalter.
  it('renders iconless leaves without disclosure placeholders', async () => {
    const view = await mount(`
      <nte-treeview-item id="folder" expanded>
        API
        <nte-treeview-item id="leaf">Methoden</nte-treeview-item>
      </nte-treeview-item>
    `);
    const folder = view.querySelector<NteTreeViewItem>('#folder')!;
    const leaf = view.querySelector<NteTreeViewItem>('#leaf')!;

    expect(control(folder, '#toggle').tagName).toBe('SUMMARY');
    expect(control(folder, '[part~="folder-icon"]').getAttribute('aria-hidden')).toBe('true');
    expect(leaf.shadowRoot!.querySelector('[part~="folder-icon"]')).toBeNull();
    expect(leaf.shadowRoot!.querySelector('#toggle, [part~="spacer"]')).toBeNull();
    expect(control(leaf, '#label').tagName).toBe('BUTTON');
    expect(control(leaf, '#label').hasAttribute('aria-expanded')).toBe(false);
  });

  // Expansion muss vor der Auswahl im Modell stehen und darf durch spätere Renderzyklen nicht verloren gehen.
  it('writes folder expansion synchronously before selection and emits it only once', async () => {
    const model = new TreeModel([{ id: 'folder', label: 'Ordner', children: [{ id: 'file', label: 'Datei' }] }]);
    const view = new NteTreeView();
    view.setData(model);
    document.body.append(view);
    await settle(view);
    const folder = view.querySelector<NteTreeViewItem>('[data-tree-id="folder"]')!;
    const expanded = vi.fn();
    const expansionAtSelection: Array<boolean | undefined> = [];
    folder.addEventListener('expanded-change', expanded);
    view.addEventListener('selection-change', () => expansionAtSelection.push(model.children[0].data?.expanded));

    pointerClick(control(folder, '#label'));
    expect(model.children[0].data?.expanded).toBe(true);
    expect(model.children[0].data?.selected).toBe(true);
    expect(expansionAtSelection).toEqual([true]);
    await settleDisclosure(view);
    expect(control(folder, '#label').getAttribute('aria-expanded')).toBe('true');
    expect(expanded).toHaveBeenCalledTimes(1);

    // Der nachfolgende native Toggle bestätigt nur den bereits übernommenen Zustand.
    control<HTMLDetailsElement>(folder, '#details').dispatchEvent(new Event('toggle'));
    expect(expanded).toHaveBeenCalledTimes(1);
    model.children[0].label = 'Umbenannter Ordner';
    await settle(view);
    expect(control<HTMLDetailsElement>(folder, '#details').open).toBe(true);

    pointerClick(control(folder, '#label'));
    expect(model.children[0].data?.expanded).toBe(false);
    await settleDisclosure(view);
    expect(control(folder, '#label').getAttribute('aria-expanded')).toBe('false');
    expect(expanded).toHaveBeenCalledTimes(2);
  });

  // Verlinkte Ordner werden zuerst ausgewählt; Datei-Links bleiben sofort navigierbar.
  it('selects linked folders before navigating while leaf links stay immediate', async () => {
    const view = await mount(`
      <nte-treeview-item id="page" href="#handbuch">
        Handbuch
        <nte-treeview-item>Einstieg</nte-treeview-item>
      </nte-treeview-item>
      <nte-treeview-item id="file" href="#datei">Datei.md</nte-treeview-item>
    `);
    const page = view.querySelector<NteTreeViewItem>('#page')!;
    const file = view.querySelector<NteTreeViewItem>('#file')!;
    const label = control<HTMLAnchorElement>(page, '#label');
    const expanded = vi.fn();
    page.addEventListener('expanded-change', expanded);

    expect(label.tagName).toBe('A');
    expect(label.getAttribute('href')).toBe('#handbuch');

    // Modifizierte Linkklicks behalten die Browseraktion und ändern die Auswahl nicht.
    const modified = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, ctrlKey: true });
    label.dispatchEvent(modified);
    expect(modified.defaultPrevented).toBe(false);
    expect(page.selected).toBe(false);

    const first = pointerClick(label);
    expect(first.defaultPrevented).toBe(true);
    expect(page.selected).toBe(true);
    expect(pointerClick(label).defaultPrevented).toBe(false);

    // Ein anderer Eintrag setzt die Ordnerauswahl zurück, ohne Datei-Navigation zu verzögern.
    expect(pointerClick(control(file, '#label')).defaultPrevented).toBe(false);
    expect(file.selected).toBe(true);
    expect(page.selected).toBe(false);

    // Tastaturaktivierung startet nach dem Auswahlwechsel ebenfalls wieder bei der reinen Auswahl.
    for (const prevented of [true, false]) {
      const keyboard = new MouseEvent('click', { bubbles: true, composed: true, cancelable: true, detail: 0 });
      label.dispatchEvent(keyboard);
      expect(keyboard.defaultPrevented).toBe(prevented);
      expect(page.selected).toBe(true);
      expect(file.selected).toBe(false);
    }
    expect(page.expanded).toBe(false);
    expect(expanded).not.toHaveBeenCalled();
  });

  // Native Summary-Aktivierung darf weder Label-Aktionen auslösen noch die Auswahl verschieben.
  it('toggles the disclosure arrow independently of selection and label actions', async () => {
    const view = await mount(`
      <nte-treeview-item id="selected" selected>Ausgewählt</nte-treeview-item>
      <nte-treeview-item id="folder">Ordner<nte-treeview-item>Datei</nte-treeview-item></nte-treeview-item>
    `);
    const selected = view.querySelector<NteTreeViewItem>('#selected')!;
    const folder = view.querySelector<NteTreeViewItem>('#folder')!;
    const action = vi.fn();
    const selection = vi.fn();
    view.addEventListener('label-click', action);
    view.addEventListener('selection-change', selection);

    control(folder, '#toggle').click();
    await settleDisclosure(view);
    expect(folder.expanded).toBe(true);

    control(folder, '#toggle').click();
    await settleDisclosure(view);
    expect(folder.expanded).toBe(false);
    expect(selected.selected).toBe(true);
    expect(folder.selected).toBe(false);
    expect(action).not.toHaveBeenCalled();
    expect(selection).not.toHaveBeenCalled();
  });

  // Ein bubbelndes Kind-Ereignis darf keine zusätzliche Aktion des Elternlabels erzeugen.
  it('activates a nested label without activating or toggling its ancestor', async () => {
    const view = await mount(`
      <nte-treeview-item id="parent" expanded selected>
        Ordner
        <nte-treeview-item id="child">Datei</nte-treeview-item>
      </nte-treeview-item>
    `);
    const parent = view.querySelector<NteTreeViewItem>('#parent')!;
    const child = view.querySelector<NteTreeViewItem>('#child')!;
    const action = vi.fn();
    const expanded = vi.fn();
    view.addEventListener('label-click', action);
    parent.addEventListener('expanded-change', expanded);

    pointerClick(control(child, '#label'));

    expect(child.selected).toBe(true);
    expect(parent.selected).toBe(false);
    expect(parent.expanded).toBe(true);
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][0].detail.item).toBe(child);
    expect(expanded).not.toHaveBeenCalled();
  });

  // Interaktive Slot-Inhalte behalten ihre eigene Aktion, obwohl sie innerhalb des Labels erscheinen.
  it('does not hijack interactive slotted content', async () => {
    const view = await mount(`
      <nte-treeview-item id="folder">
        Ordner
        <button slot="icon" type="button">Info</button>
        <nte-treeview-item>Datei</nte-treeview-item>
      </nte-treeview-item>
    `);
    const folder = view.querySelector<NteTreeViewItem>('#folder')!;
    const button = folder.querySelector<HTMLButtonElement>('[slot="icon"]')!;
    const ownAction = vi.fn();
    const labelAction = vi.fn();
    button.addEventListener('click', ownAction);
    view.addEventListener('label-click', labelAction);

    pointerClick(button);

    expect(ownAction).toHaveBeenCalledOnce();
    expect(labelAction).not.toHaveBeenCalled();
    expect(folder.selected).toBe(false);
    expect(folder.expanded).toBe(false);
  });

  // Aktionen wiederholen sich unabhängig von der Auswahl; Doppelklick bleibt ein separates natives Ereignis.
  it('emits actions for repeated clicks, native double-clicks and keyboard-style activation', async () => {
    const view = await mount('<nte-treeview-item id="file">Datei</nte-treeview-item>');
    const file = view.querySelector<NteTreeViewItem>('#file')!;
    const label = control<HTMLButtonElement>(file, '#label');
    const clicks: LabelAction[] = [];
    const doubles: LabelAction[] = [];
    const selection = vi.fn();
    view.addEventListener('label-click', (event) => clicks.push(event as LabelAction));
    view.addEventListener('label-dblclick', (event) => doubles.push(event as LabelAction));
    view.addEventListener('selection-change', selection);

    const first = pointerClick(label);
    const second = pointerClick(label);
    const double = new MouseEvent('dblclick', { bubbles: true, composed: true, cancelable: true, detail: 2 });
    label.dispatchEvent(double);
    // jsdom synthetisiert aus Tastendrücken keine Browser-Aktivierung; der native Button liefert den detail=0-Klick.
    label.click();

    expect(clicks).toHaveLength(3);
    expect(clicks[0].detail).toEqual({ item: file, originalEvent: first });
    expect(clicks[1].detail.originalEvent).toBe(second);
    expect(clicks[2].detail.originalEvent.detail).toBe(0);
    expect(doubles).toHaveLength(1);
    expect(doubles[0].detail).toEqual({ item: file, originalEvent: double });
    for (const action of [...clicks, ...doubles]) {
      expect(action.target).toBe(file);
      expect(action.bubbles && action.composed && action.cancelable).toBe(true);
    }
    expect(selection).toHaveBeenCalledOnce();
  });

  // Anwendungen können Navigation oder Ordner-Disclosure ersetzen und trotzdem die Zeile auswählen.
  it('allows canceled label actions to suppress defaults while preserving selection', async () => {
    const view = await mount(`
      <nte-treeview-item id="folder">Ordner<nte-treeview-item>Datei</nte-treeview-item></nte-treeview-item>
      <nte-treeview-item id="link" href="#anderes-ziel">Verlinkte Datei</nte-treeview-item>
    `);
    const folder = view.querySelector<NteTreeViewItem>('#folder')!;
    const link = view.querySelector<NteTreeViewItem>('#link')!;
    view.addEventListener('label-click', (event) => event.preventDefault());
    view.addEventListener('label-dblclick', (event) => event.preventDefault());

    const folderClick = pointerClick(control(folder, '#label'));
    expect(folderClick.defaultPrevented).toBe(true);
    expect(folder.expanded).toBe(false);
    expect(folder.selected).toBe(true);

    const linkClick = pointerClick(control(link, '#label'));
    expect(linkClick.defaultPrevented).toBe(true);
    expect(link.selected).toBe(true);
    expect(folder.selected).toBe(false);

    const double = new MouseEvent('dblclick', { bubbles: true, composed: true, cancelable: true, detail: 2 });
    control(link, '#label').dispatchEvent(double);
    expect(double.defaultPrevented).toBe(true);
  });
});
