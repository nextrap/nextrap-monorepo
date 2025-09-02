# Aufgabenliste: Erstellung der nte-multiselect Komponente

## Phase 1: Grundgerüst und Projekt-Setup

- [ ] Neuen Ordner `nextrap-elements/nte-multiselect` im Monorepo erstellen.
- [ ] Die grundlegende Dateistruktur nach dem Vorbild von `nte-split-view` anlegen:
    - `nte-multiselect/src/`
    - `nte-multiselect/src/nte-multiselect.ts` (Container-Komponente)
    - `nte-multiselect/src/nte-multiselect.styles.ts` (Container-Styles)
    - `nte-multiselect/src/nte-multiselect-item.ts` (Item-Komponente)
    - `nte-multiselect/src/nte-multiselect-item.styles.ts` (Item-Styles)
    - `nte-multiselect/src/index.ts` (Export-Datei)
    - `nte-multiselect/package.json`
    - `nte-multiselect/README.md`
- [ ] `package.json` mit den notwendigen Informationen und Abhängigkeiten (lit, tslib) erstellen.
- [ ] `tsconfig.json` für das neue Paket konfigurieren.

## Phase 2: Entwicklung der `nte-multiselect-item`-Komponente

- [ ] In `nte-multiselect-item.ts`, die Lit-Klasse `NteMultiselectItem` erstellen.
- [ ] **Properties definieren:**
    - `@property({ type: String }) type = 'radio'`: Definiert den Auswahltyp ('radio' oder 'checkbox').
    - `@property({ type: String }) name`: Für die Gruppierung von Radio-Buttons.
    - `@property({ type: String }) value`: Der eindeutige Wert dieser Option.
    - `@property({ type: Boolean, reflect: true }) checked = false`: Der Auswahlstatus.
    - `@property({ type: Boolean, reflect: true }) disabled = false`: Deaktivierungsstatus.
    - `@property({ type: String, attribute: 'control-position' }) controlPosition = 'bottom-right'`: Position des Radio/Checkbox-Inputs (`top-left`, `top-right`, `bottom-left`, `bottom-right`).
- [ ] **HTML-Struktur im `render()`-Template erstellen:**
    - Einen Wrapper-Container implementieren.
    - Die Slots `leading`, `title`, `value`, `description` und `trailing` gemäß der `nte-multiselect-structure.jpg` anordnen.
    - Das `<input>`-Element (`type="radio"` oder `type="checkbox"`) basierend auf der `type`-Property rendern.
    - Einen Klick-Handler auf dem Host-Element implementieren, der das `checked`-Property umschaltet und ein `change`-Event auslöst.
- [ ] **Styling in `nte-multiselect-item.styles.ts`:**
    - Grundlegendes Flexbox- oder Grid-Layout für die interne Struktur der Karte erstellen.
    - Styling für den ausgewählten Zustand (`:host([checked])`) definieren (z.B. grüner Rahmen, Häkchen).
    - Styling für den deaktivierten Zustand (`:host([disabled])`) definieren.
    - CSS-Klassen für die 4 möglichen Positionen des `control`-Elements implementieren.
- [ ] **CSS Parts für Light DOM Styling hinzufügen:**
    - `part="card"`: Der Hauptcontainer der Karte.
    - `part="leading"`, `part="trailing"`: Die äußeren Slot-Wrapper.
    - `part="content"`: Der mittlere Inhaltsbereich.
    - `part="title"`, `part="value"`, `part="description"`: Die inneren Slot-Wrapper.
    - `part="control"`: Das `input`-Element oder sein Label.
- [ ] Komponente im Custom Element Registry definieren: `customElements.define('nte-multiselect-item', NteMultiselectItem)`.

## Phase 3: Entwicklung der `nte-multiselect`-Container-Komponente

- [ ] In `nte-multiselect.ts`, die Lit-Klasse `NteMultiselect` erstellen.
- [ ] **Properties definieren:**
    - `@property({ type: String, reflect: true }) layout = 'rows'`: Das Layout der Items (`rows`, `columns`, `grid`).
    - `@property()` value: Hält den aktuellen Wert der Auswahl (kann ein String für Radio-Gruppen oder ein Array von Strings für Checkboxen sein).
- [ ] **HTML-Struktur im `render()`-Template erstellen:**
    - Einen Haupt-Wrapper implementieren.
    - Einen Standard-Slot `<slot></slot>` hinzufügen, um die `nte-multiselect-item`-Elemente aufzunehmen.
- [ ] **Logik implementieren:**
    - Einen Event-Listener (z.B. über `@slotchange`) einrichten, um auf hinzugefügte Items zu reagieren.
    - Einen Click- oder Change-Event-Listener auf dem Host-Element implementieren, der Events von den `nte-multiselect-item`-Kindern abfängt.
    - Logik für Radio-Gruppen: Wenn ein `nte-multiselect-item` vom Typ `radio` ausgewählt wird, müssen alle anderen Items mit demselben `name` abgewählt (`checked = false`) werden.
    - Ein öffentliches `change`-Event von der `nte-multiselect`-Komponente auslösen, das die aktuellen ausgewählten Werte (`value`) enthält.
- [ ] **Styling in `nte-multiselect.styles.ts`:**
    - Basis-Styling für den Host-Container definieren.
    - Layout-spezifisches Styling implementieren:
        - `:host([layout='rows'])`: `display: flex; flex-direction: column; gap: ...`
        - `:host([layout='columns'])`: `display: flex; flex-direction: row; gap: ...`
        - `:host([layout='grid'])`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: ...`
- [ ] Komponente im Custom Element Registry definieren: `customElements.define('nte-multiselect', NteMultiselect)`.

## Phase 4: Abschluss und Dokumentation

- [ ] In `index.ts`, beide Klassen (`NteMultiselect`, `NteMultiselectItem`) exportieren.
- [ ] Eine `README.md`-Datei mit Anwendungsbeispielen für alle drei Layouts und verschiedene Konfigurationen (Radio-Gruppe, Checkboxen, gemischt) erstellen.
- [ ] Code testen, um sicherzustellen, dass die Auswahl-Logik, die Layouts und das Event-Handling korrekt funktionieren.
