# NTE Tabs

`@nextrap/nte-tabs` bündelt mehrere Inhalte in einer Tab-Leiste. Bei zu
wenig Platz bleibt automatisch nur der aktive Tab sichtbar; rechts steht
ein Dropdown für die Auswahl der übrigen Tabs. Die Panels bleiben im DOM.

## 1. Datei-Explorer

```ts
import '@nextrap/nte-tabs';
```

```html
<nte-tabs value="files" aria-label="File Explorer">
  <nte-tab name="files" label="All Files">
    <p>Alle Dateien</p>
  </nte-tab>
  <nte-tab name="changes" label="Change List" count="3">
    <p>Geänderte Dateien</p>
  </nte-tab>
</nte-tabs>
```

Im Theme die gewünschte vollständige Baseline einbinden:

```scss
@use '@nextrap/nte-tabs' as tabs;

nte-tabs.style-default {
  @include tabs.default-style();
}

nte-tabs.style-sm {
  @include tabs.small-style();
}
```

Die Default-Klasse wird automatisch gesetzt; für kompakte Sidebars kann
`class="style-sm"` gewählt werden. Beide Styles unterstützen alle Modi.

## 2. Individueller Tab-Header

Ein direktes Kind mit `slot="tab-<name>"` ersetzt die Standardbeschriftung
des gleichnamigen Tabs. Ohne Slot-Inhalt erscheint `label` oder `name`.
Der optionale Counter bleibt separat sichtbar.

```html
<nte-tabs value="changes">
  <nte-tab name="files">Alle Dateien</nte-tab>
  <nte-tab name="changes" label="Change List" count="3">
    Geänderte Dateien
  </nte-tab>
  <span slot="tab-changes">
    <span aria-hidden="true">✎</span> Änderungen
  </span>
</nte-tabs>
```

Der eigene Header bleibt auch im Dropdown-Modus beim aktiven Tab sichtbar.
Die native Auswahlliste verwendet `label` beziehungsweise `name` plus
Counter als Textalternative. Header-Inhalte dürfen keine eigenen
interaktiven Controls enthalten, da sie in einem Tab-Button liegen.

## 3. Counter und Auswahl

Die folgenden Anweisungen ergänzen das erste Beispiel nach der Registrierung.

```ts
import type { NteTab } from '@nextrap/nte-tabs';

const tabs = document.querySelector('nte-tabs')!;
const changes = tabs.querySelector<NteTab>('nte-tab[name="changes"]')!;

changes.count = 5;
tabs.value = 'changes';

tabs.addEventListener('change', event => {
  if (event.target === tabs) {
    console.log((event as CustomEvent<string>).detail);
  }
});
```

`count = null` entfernt den Counter; `count = 0` zeigt Null.
Programmatische Auswahl löst kein `change` aus.

## 4. Layout und Slots

`nte-tab` ist eine Nextrap-Komponente mit eigenem Shadow DOM.
Der Default-Slot sowie der optionale `content`-Slot nehmen Panel-Inhalte
auf. Verschachtelte `layout`-Attribute werden über Content Pane aufgelöst.
Der individuelle Header bleibt ein Slot am übergeordneten `nte-tabs`.

In Content-Pane-Markdown können die Tabs als Layout angegeben werden:

```markdown
## Datei-Explorer

---
{: layout="nte-tabs[value='files']"}

### Dateien
{: layout="nte-tab[name='files']"}

Alle Dateien.

### Änderungen
{: layout="nte-tab[name='changes']"}

Geänderte Dateien.
```

## 5. Overflow-Verhalten

| Wert | Darstellung |
|---|---|
| `auto` (Standard) | Alle Tabs bei genügend Platz, andernfalls aktiver Tab mit Dropdown |
| `dropdown` | Immer kompakte Darstellung |
| `scroll` | Horizontal scrollbar; kein automatischer Dropdown |

Ein ResizeObserver beobachtet den verfügbaren Platz und die intrinsische
Breite der vollständigen Leiste. Sie bleibt auch im Dropdown-Modus
messbar. Geänderte Labels, Counter, Header und Containerbreiten können
den Modus ohne feste Breakpoints ändern. Es wird kein Panel entfernt.

## 6. Öffentliche API

| Element | Attribut/Property | Verhalten |
|---|---|---|
| `nte-tabs` | `value` | Name des aktiven Tabs |
| `nte-tabs` | `overflow` | `auto`, `dropdown`, `scroll` |
| `nte-tabs` | `aria-label` | Zugänglicher Name der Navigation |
| `nte-tabs` | `tab-<name>` (Slot) | Optionaler eigener Header |
| `nte-tab` | `name` | Eindeutiger nichtleerer Name |
| `nte-tab` | `label` | Beschriftung; Standard: Name |
| `nte-tab` | `count` | Optionaler nichtnegativer Integer |
| `nte-tab` | `disabled` | Deaktiviert den Tab |
| `nte-tab` | Default-Slot, `content` (Slot) | Panel-Inhalte, auch verschachtelte Layouts |

`NteTabs`, `NteTab` und `TabsOverflow` werden exportiert. Das Event
`change` enthält den neuen Namen als `detail`, bubbelt und ist composed.
Ein nicht auswählbarer Name wird auf den ersten aktivierbaren Tab
normalisiert. Sind alle deaktiviert, bleibt kein Panel aktiv. Nur direkte
`nte-tab`-Kinder mit eindeutigen Namen werden verwaltet. Die Komponente
verwaltet deren Panel-Slot-Zuordnung selbst.

Pfeiltasten, Home und End navigieren die Tab-Leiste. Das Dropdown nutzt
die native Select-Bedienung. Formulare und verschachtelte Komponenten
bleiben beim Umschalten erhalten.

## 7. Theming

Parts: `bar`, `tablist`, `tab`, `active-tab`, `label`, `count`,
`dropdown`, `panel`. Das Panel-Element `nte-tab` bietet zusätzlich den Part `content`.
Die Mixins nutzen geerbte `--nt-*`-Tokens.
Die intrinsische Breite der Leiste, die Slot-Zuordnung und das Ausblenden
inaktiver Panels sind funktional und dürfen nicht überschrieben werden.
Der Runtime-Import erzeugt keine Light-DOM-Styles.

## Demo

Die Demo enthält eine Content-Pane-Markdown-Variante, eine interaktive
HTML-Variante mit Overflow und eine TypeScript-Variante mit Layout,
programmatischer Auswahl und Counter.
