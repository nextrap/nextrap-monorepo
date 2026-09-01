---
name: nextrap-lib-programming
description: Use this skill for programming within the nextrap library project.
---

# Nextrap Library Programming

Nextrap is a css,ts webcomponents library project with no dependencies except trunkjs and lit elements.

Dieses Repo ist ein nx monorepo. unter `nextrap-base/` liegen styles und shared utilities, unter `nextrap-layout/` liegen layout webcomponents und unter `nextrap-elements/` liegen die element webcomponents.

Layouts sind webcomponents, die auf Websites zusammen mit trunkjs/content-pane und trunkjs/responsive genutzt werden. Elemente sind webcomponents, die in Layouts oder direkt in APPs genutzt werden.

Die nextrap elemente werden als einzelne packages auf npmjs veröffentlicht. Es darf daher keine direkten urls zwischen den packages geben. Diese müssen untereinander über @nextap/package-name importiert werden.

## Basic rules

- Wenn du Theme-Styles für ein konkretes `ntl-*`- oder `nte-*`-Package entwickelst oder änderst, lies zuerst dessen lokalen `.agents/skills/<component>-theming/SKILL.md` und nutze ihn als verbindlichen Komponenten-Contract.
- Wenn du Markup oder Component-API eines Packages verwendest, lies dessen lokalen `.agents/skills/<component>-usage/SKILL.md`.
- Falls mehrere Komponenten betroffen sind, lies die jeweils relevanten lokalen Skills. Gibt es noch keinen lokalen Skill, gelten dieses Dokument und die bestehende `.ai-usage-info.md` als Fallback.
- Lies so wenig wie möglich andere Packages ein.
- Bei asynchronem TypeScript bevorzugt `async`/`await` und die modernen asynchronen APIs beziehungsweise Methoden statt älterer Promise-Callback-/`.then()`-Syntax, sofern die bestehende API und Browser-/Runtime-Kompatibilität das zulassen. Das gilt besonders für neue Beispiele, Demos und Dokumentationscode.
- So wenig styling wie nötig: Die Webcomponents sollen später von außen gestyled werden. Daher soll im shadow dom nur die nötigsten styles enthalten sein. Es sollten immer parts definiert sein, damit diese von außen gestyled werden können.
- Das default styling erfolgt in den mixins jedes packages, das nachher in den theme importiert wird.
- Demo-/Theme-SCSS bindet den visuellen Default über `.style-default`, z. B. `ntl-2col.style-default { @include twoCol.default-style(); }`.
- Beispiele sollen `.style-default` normalerweise nicht explizit setzen: `SetDefaultStyleMixin` fügt automatisch `style-default` hinzu, wenn am Custom Element keine Klasse mit Prefix `style-` vorhanden ist.
- Selektoren ohne `style-*` Klasse, z. B. nur `ntl-demo { ... }`, dürfen keine visuellen Default-Styles enthalten; ein Element ohne `style-*` Klasse sollte ungestyled bleiben.
- Pro Element darf immer nur eine `style-*` Klasse gesetzt sein.
- Style-Varianten müssen mit `style-` beginnen, z. B. `style-testimonial`, und ihre vollständige visuelle Baseline selbst enthalten.
- Feature-/Modifier-Varianten sollen über semantische `with-*` Klassen am Custom Element aktiviert werden, z. B. `ntl-2col.with-background-and-divider`.
- Styling von Shadow-DOM-Inhalten in Demo-/Theme-SCSS soll bevorzugt über `::part(...)` erfolgen.
- Bei Layout-Varianten immer mobile/desktop-Modi beachten. Desktop-only Styling über `[mode='desktop']` scopen.
- SCSS-Feature-Mixins sollen keine konkreten Demo-/Modifier-Klassennamen enthalten. Das Mixin beschreibt nur das Feature; die Klasse oder der Zielselektor bindet das Mixin ein.
- Jedes Mixin wird in einer eigenen SCSS-Datei unter src/scss/ definiert und in index.scss exportiert.
- Der Name für Feature-/Modifier-Mixins startet mit `with-<feature>` und beschreibt das Feature, z. B. `with-background-and-divider`.
- Layout-Beispiele in Dokumentation und Demos immer im `trunkjs/content-pane` Markdown-Format mit `{: layout="..."}` schreiben, nicht als direktes HTML. Kramdown-Blockattribute müssen ohne Leerzeile direkt auf den zugehörigen Block folgen; das gilt für horizontale Linien (`---`), Tabellen, Absätze und alle anderen Blöcke, zum Beispiel `---` unmittelbar gefolgt von `{: layout="..."}`.
- Verwende in Markdown für Codeblöcke immer dreifache Backticks und niemals Tilden-Fences.
- Jedes Package mit einer Element-/Markup-API, das in Layout-Komponenten eingesetzt werden kann oder dafür vorgesehen ist, erhält als primäres Beispiel eine Markdown-zentrierte `.demo.ts`. Nur rein programmatische APIs sind davon ausgenommen. Die Demo muss `@trunkjs/content-pane` importieren und das gerenderte Markdown über `wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>'` durch Content Pane verarbeiten; befolge dafür den package-lokalen `content-pane-demo` Skill von `@trunkjs/content-pane`.
- `Migrations` immer kurz als Tabelle mit den Spalten `Old` und `New` dokumentieren; keine vollständigen Vorher-/Nachher-Beispiele duplizieren.

## Proposals

Das Verzeichnis `.agents/proposals/` sammelt kurze, reviewbare Entwürfe vor der eigentlichen Umsetzung.

- Browser-Support-Blocker und absehbare Plattform-Verbesserungen werden jeweils in einer eigenen Datei dokumentiert. Halte Ziel, aktuellen Blocker, offene Punkte und Prüfkriterium knapp fest. Markiere mit `→`, welche Packages oder Komponenten dadurch später vereinfacht werden können.
- Wenn eine neue Komponente entwickelt werden soll, schlage standardmäßig zuerst ein Proposal unter `.agents/proposals/<component-name>.md` vor. Der User entscheidet, ob dieser Zwischenschritt gewünscht ist.
- Ein Component-Proposal fasst mindestens Zweck, Scope und Non-Goals, öffentliche API, Slots/Attribute/Properties/Events, Styling- und Responsive-Verhalten, Abhängigkeiten, offene Fragen und Akzeptanzkriterien zusammen.
- Wenn der User das Proposal wählt, beginne die Implementierung erst nach dessen Review beziehungsweise ausdrücklicher Freigabe. Verlangt der User ausdrücklich die direkte Umsetzung, ist kein Proposal erforderlich.

## Element pairings

Viele Elemente lassen sich ineinander schachteln. Zuständig für die korrekte Darstellung ist dabei immer das innere element. D.h. Schachtelungs-Demos für ein nte-accordion in einem ntl-2col sollten im nte-accordion package liegen.

Das Pairing wird durch ein paring-mixin mit dem namen `pairing-<outer>-in-<inner>` definiert im inneren Element definiert. (d.h. in unserem Beispiel im nte-accordion package).

Für jedes pairing wird eine eigene paring-xyz.md erstellt.

## Ai Usage Info

- Update the .ai-usage-info.md file in the package you are working on. Keep it short.

## Package-lokale Usage- und Theming-Skills

Jedes veröffentlichte Nextrap-Package erhält zwei eigene Skills unter `.agents/skills/`. `ntl-2col` und `ntl-card-row` sind die Referenzimplementierungen:

```text
<package>/.agents/skills/<package-name>-theming/SKILL.md
<package>/.agents/skills/<package-name>-usage/SKILL.md
```

- Verwende den vollständigen Package- beziehungsweise Custom-Element-Namen, z. B. `ntl-2col-theming` und `ntl-2col-usage`.
- Verlinke im Usage-Skill auf den Theming-Skill und im Theming-Skill auf den Usage-Skill.
- Halte beide Skills strikt package-spezifisch. Globale Nextrap-Regeln werden nicht dupliziert.
- Kopiere `.agents` beim Build nach `dist` und veröffentliche die Skills im npm-Package.
- Der Package-Generator legt beide Skills für neue Packages an. Fehlende Skills bestehender Packages werden in eigenen Package-Migrationen ergänzt, nicht nebenbei bei fachfremden Änderungen.
- Die Package-Skills ersetzen langfristig die jeweilige `.ai-usage-info.md`; bis zur vollständigen Migration bleiben beide Formate bestehen.

### Usage-Skill

Der Usage-Skill ist der verbindliche Einstieg für die Verwendung des Packages in Websites und Apps. Seine Frontmatter-Description muss Markup-, API- und Auswahlfragen triggern, aber keine Theme-Generierung.

Er dokumentiert kompakt und konkret:

- wofür das Package gedacht ist, in welchen Kontexten es verwendet wird und wann eine andere Komponente geeigneter ist;
- Import und öffentliche API;
- Markup, Slots beziehungsweise Content-Zuordnung, Attribute, Properties, Events, Klassen und relevante CSS-Variablen;
- gültige Kombinationen, Pairings und wichtige Einschränkungen;
- mindestens ein typisches, direkt übernehmbares Beispiel.

Für `ntl-*`-Packages müssen alle Markup-Beispiele als Markdown/Kramdown im `trunkjs/content-pane`-Format mit `{: layout="..."}` angegeben werden. Direktes HTML ist dort kein Ersatz. Auch bei `nte-*`- und `style-*`-Packages werden Markdown-/Kramdown-Beispiele bevorzugt, sobald sich der reale Website-Anwendungsfall damit ausdrücken lässt, zum Beispiel Links mit Klassen oder Content-Sections mit Attributlisten. HTML ist nur sinnvoll, wenn Kramdown die öffentliche API oder den App-Kontext nicht korrekt abbilden kann.

Usage-Beispiele verlassen sich auf den automatischen Default-Style und setzen `.style-default` nicht ohne konkreten Grund. Theme-SCSS und neue visuelle Varianten gehören nicht in den Usage-Skill.

### Theming-Skill

Der Theming-Skill darf nur verwendet werden, wenn ein Theme erzeugt oder geändert wird, das dieses Package stylt. Seine Frontmatter-Description muss diesen Trigger eng formulieren. Für allgemeine Verwendung, Markup oder Content-Zuordnung ist ausschließlich der Usage-Skill zuständig.

Der Theming-Skill dokumentiert die öffentliche Styling-Oberfläche und die package-spezifischen Grenzen:

- vorhandene SCSS-Mixins und deren vorgesehene Komposition;
- Parts, öffentliche CSS-Variablen und `--nt-*` Tokens;
- erlaubte Theme-Selektoren, Style- und Modifier-Klassen;
- responsive Modes, Slot-Verträge und mobile Lesereihenfolge, soweit sie das Styling beeinflussen;
- Eigenschaften, die das Theme bewusst nicht überschreiben darf;
- ein kurzes SCSS-Beispiel für die normale Theme-Integration.

Bei Web Components wird die vollständige visuelle Baseline an genau eine `style-*` Klasse gebunden; kombinierbare Features verwenden vorhandene `with-*` Modifier. Nutze zuerst vorhandene Mixins, Parts, Tokens und CSS-Variablen. Erzeuge keine neue `style-*` Variante für eine einzelne Position, Farbe, Breite, einen Abstand oder eine andere Instanzkonfiguration. Greife nicht in Shadow-DOM-Interna ein, wenn ein Part oder eine öffentliche Variable existiert.

Bei `style-*`-Packages beschreibt der Theming-Skill zusätzlich die Trennung von Sass-API und CSS-Ausgabe, die Class-Mixin-Parität sowie die unabhängige Komposition von Basis- und Modifier-Mixins. Der Skill soll konkrete Theme-Entscheidungen ermöglichen, aber weder den globalen Style-Package-Contract wiederholen noch Usage-Markup duplizieren.

## Style package architecture contract (`@nextrap/style-*`)

Full reference: `docs/style-packages-architecture.md`

### Package responsibilities

| Package | Role |
|---|---|
| `@nextrap/style-base` | Token-only: `--nt-*` CSS custom properties, theme generation. **Visually side-effect free.** |
| `@nextrap/style-utils` | Atomic utility mixins/classes (spacing, display, flex, colors, …). |
| `@nextrap/style-elements` | Reusable visual element patterns: prose, table, list-group, container, … |
| `@nextrap/style-typography` | Typographic rules and vertical rhythm of individual text elements. **Never owns page, content or section padding/layout.** |
| Specialized packages (`style-button`, …) | Own a specific component/pattern. Follow the same entry-point and mixin contract. |
| Web component SCSS (Shadow DOM) | Only minimal functional styles in Shadow DOM; theming via `::part()`. |

### Entry-point contract: `index.scss` vs `default.scss`

Every style package separates API from output:

- **`index.scss`** = Sass API only. Importing it must **not** emit global visual CSS.
- **`default.scss`** = explicit, ready-to-use CSS output generated by the package's aggregate mixin.

```scss
@use '@nextrap/style-elements' as e;        // API — no CSS emitted
@use '@nextrap/style-elements/default';     // Materializes default CSS classes
```

Package `exports` must expose `.` (index.scss) and `./default` (default.scss).

### Package-specific aggregate mixins — never `all()`

Every style package that can materialize a complete selector/class set exposes **one package-specific aggregate mixin**. Do **not** name this mixin `all()`.

Canonical names are:

```text
@nextrap/style-utils       → utils()
@nextrap/style-elements    → elements()
@nextrap/style-typography  → typography()
@nextrap/style-button      → buttons()
```

Future style packages must choose an equally clear package-specific name. Aggregate names must be unique enough that several style package APIs can be re-exported with Sass `@forward` without member-name collisions.

The aggregate mixin registers the package's complete default selector/class API **relative to the current Sass scope**:

```scss
@use '@nextrap/style-utils' as u;
@use '@nextrap/style-elements' as e;
@use '@nextrap/style-typography' as type;
@use '@nextrap/style-button' as b;

.theme {
  @include u.utils();
  @include e.elements();
  @include type.typography();
  @include b.buttons();
}
```

This must produce selectors below `.theme`; aggregate mixins must not escape their caller's scope.

`default.scss` contains no independent registry. It simply invokes the aggregate mixin at root:

```scss
// style-utils/default.scss
@use './index' as u;
@include u.utils();
```

Therefore scoped output and default/root output always use the exact same source of truth.

**Why package-specific names are mandatory:** multiple style packages may be combined/re-exported by a theme package. If each package forwards `all()`, Sass reports a member-name collision. `utils()`, `elements()`, `typography()`, `buttons()`, etc. remain composable through `@forward`.

### CSS class ↔ Sass mixin naming convention (1:1 parity)

Where technically meaningful, every public CSS class has a public Sass mixin with **exactly the same name without the leading dot**:

```text
.table                   ↔ table()
.table-striped           ↔ table-striped()
.table-bordered          ↔ table-bordered()
.prose                   ↔ prose()
.list-group              ↔ list-group()
.list-group-flush        ↔ list-group-flush()
.d-flex                  ↔ d-flex()
.gap-3                   ↔ gap-3()
.mt-2                    ↔ mt-2()
.text-primary            ↔ text-primary()
.bg-primary              ↔ bg-primary()
.btn                     ↔ btn()
.btn-primary             ↔ btn-primary()
.btn-outline-primary     ↔ btn-outline-primary()
```

CSS classes **must be generated by including the mixin** — never maintain a separate duplicate implementation:

```scss
.table { @include table(); }
.table-striped { @include table-striped(); }
```

The package aggregate mixin is the deliberate exception to class↔mixin naming parity because it does not represent one CSS class; it materializes the complete package API.

### Base and modifier mixins are independently composable

Modifier mixins contain only their modifier behavior and **do not implicitly include the base mixin**:

```scss
@mixin table() {
  width: 100%;
  border-collapse: collapse;
}

@mixin table-striped() {
  tbody tr:nth-child(odd) {
    background: var(--nt-table-stripe-bg, rgba(0,0,0,.05));
  }
}
```

HTML usage is conceptually identical to Sass composition:

```html
<table class="table table-striped table-bordered">
```

```scss
.theme table {
  @include e.table();
  @include e.table-striped();
  @include e.table-bordered();
}
```

### Mixins style the current selector (no root-selector ownership)

Public style mixins apply declarations and child/state selectors relative to where they are included. They **must not** own or hard-code their root selector:

```scss
.customer-theme {
  table {
    @include e.table();
    @include e.table-striped();
  }

  button {
    @include b.btn();
    @include b.btn-outline-primary();
  }

  .special-box {
    @include u.d-flex();
    @include u.gap-3();
    @include u.mt-2();
  }
}
```

Do not use `@at-root` inside public mixins without an explicitly documented exceptional reason.

### Typography owns element rhythm, not content layout

`style-typography` may style native text elements and corresponding typography helper classes. Its job is typography and the spacing of the **individual typographic elements**, following a Bootstrap-like document rhythm.

It may define, for example, heading/paragraph/list/blockquote/pre/figure margins and internal padding where that padding belongs to the element itself.

It must **not** set padding/margins on `section`, page wrappers, content containers, article layout wrappers, or other structural layout selectors. Content/section/page spacing belongs to layout/theme composition, not typography.

### `style-base` is token-only and visually side-effect free

`@nextrap/style-base` and `@nextrap/style-base/default` must be safe to load on **any page**, including pages using Bootstrap, Tailwind, Material, or legacy CSS.

Allowed: CSS custom properties (`--nt-*`). Not allowed: resets, `body` rules, native typography, component styles, or other visual host-page changes.

Important runtime rule: `@nextrap/style-base` must **not** be imported by shipped `nte-*` or `ntl-*` component runtime code (`.ts` / `.js`). The project/theme/app owns `style-base` and includes it exactly once at app/theme level. Only demos or explicit dev-only demo setups may import `@nextrap/style-base` directly.

### Shadow DOM: Tokens erben, benötigte Styles gezielt materialisieren

Normale CSS Custom Properties (einschließlich der von `style-base` am Hauptdokument definierten `--nt-*` Tokens) werden über den Shadow Host in den Shadow DOM und auch durch weitere verschachtelte Shadow-DOM-Grenzen vererbt. Eine Komponente darf diese Tokens deshalb direkt mit `var(--nt-...)` verwenden. Sie darf Theme-Werte wie Farben, Border, Border-Radius oder Abstände nicht an jeder Shadow-DOM-Grenze erneut deklarieren, kopieren oder per JavaScript weiterreichen.

Die Vererbung der Tokens bedeutet nicht, dass Selektorregeln aus dem Hauptdokument in den Shadow DOM hineinwirken. Nutzt eine Komponente im Shadow DOM ein visuelles Element wie einen Button, muss sie die dafür benötigten Styles aus dem zuständigen Style-Package innerhalb ihres Shadow-DOM-SCSS materialisieren. Verwende dazu die öffentlichen, selektorspezifischen Mixins und nur die tatsächlich benötigte Basis und Modifier:

```scss
@use '@nextrap/style-button' as button;

button {
  @include button.btn();
  @include button.btn-primary();
}
```

Diese Mixins beziehen Farbe, Border, Radius, Spacing und weitere Theme-Werte selbst aus den geerbten `--nt-*` Tokens. Solche Werte dürfen in der Web Component nicht nochmals nachgebaut oder als lokale Kopien der globalen Tokens definiert werden. Lokale Custom Properties sind nur für eine echte, dokumentierte Komponenten-API oder einen internen komponentenspezifischen Wert zulässig, nicht als Weiterleitungsmechanismus für `style-base`.

Interne Custom Properties sollen durch einen internen Namen wie `--_<component>-<property>` als nicht öffentliche API erkennbar sein. Wenn ein Wert auch nicht an Nachfahren oder einen darin verschachtelten Shadow DOM vererbt werden soll, kann die Property zusätzlich typisiert und mit `inherits: false` registriert werden:

```css
@property --_dialog-animation-offset {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}
```

`inherits: false` bedeutet „nicht vererbbar“, nicht „privat“ oder sicher verborgen: CSS kann den Namen weiterhin referenzieren oder überschreiben. Die Registrierung stoppt außerdem die Vererbung an **alle** Nachfahren innerhalb desselben Shadow Trees. Verwende sie daher nur für Werte, die direkt auf dem Element gesetzt und dort konsumiert werden. Muss ein interner Wert zwischen mehreren Shadow-DOM-internen Nachfahren vererbt werden, bleibt er vererbbar und wird lediglich über die interne Namenskonvention als nicht öffentliche Komponenten-API markiert.

Für Shadow-DOM-SCSS gilt:

- Bevorzuge einzelne öffentliche Mixins wie `btn()`, `btn-primary()`, `table()` oder gezielte Utility-Mixins.
- Binde ein kleines spezialisiertes Aggregat wie `buttons()` nur ein, wenn die Komponente dessen vollständige Selektor-API tatsächlich nutzt.
- Binde keine vollständigen Aggregate wie `utils()`, `elements()` oder `typography()` vorsorglich ein. Wenn ein Aggregat ausnahmsweise erforderlich ist, muss im SCSS am Include explizit dokumentiert werden, welche enthaltenen Komponenten beziehungsweise Selektoren im Shadow DOM benötigt werden und weshalb Einzel-Mixins nicht ausreichen.
- Importiere weder `style-base` noch dessen Default-Ausgabe in den Komponenten-Runtime-Code. Das Hauptdokument beziehungsweise Theme stellt die Tokens einmal bereit; die Komponente konsumiert sie über die normale CSS-Vererbung.
- Berücksichtige Fallbacks nur dort, wo ein Style-Package sie in seinem öffentlichen Mixin-/Token-Contract vorsieht. Erfinde in der Komponente keine abweichenden Theme-Defaults.

### Cross-package interoperability via `--nt-*` tokens

Style packages communicate through `--nt-*` CSS custom properties, not private Sass imports from sibling packages:

```scss
color: var(--nt-text, currentColor);
padding: var(--nt-space-3, .75rem);
```

Avoid private coupling such as `@use '../../../style-base/variables';`.

### Derived themes compose individual and aggregate mixins

A theme may either map individual mixins to semantic selectors or register whole package APIs:

```scss
.theme-corporate {
  table {
    @include e.table();
    @include e.table-striped();
  }

  @include u.utils();
  @include e.elements();
  @include type.typography();
  @include b.buttons();
}
```

### Naming conventions summary

| Kind | Pattern | Examples |
|---|---|---|
| Token (CSS var) | `--nt-<token>` | `--nt-primary`, `--nt-space-3`, `--nt-border-radius` |
| Local element var | `--<element>-<prop>` | `--prose-max-w`, `--table-stripe-bg` |
| Base class/mixin | lowercase, hyphenated | `.table` / `table()`, `.prose` / `prose()` |
| Modifier class/mixin | `<base>-<modifier>` | `.table-striped` / `table-striped()`, `.btn-primary` / `btn-primary()` |
| Utility class/mixin | short atomic name | `.d-flex` / `d-flex()`, `.mt-2` / `mt-2()`, `.gap-3` / `gap-3()` |
| Package aggregate mixin | package-specific noun; never `all()` | `utils()`, `elements()`, `typography()`, `buttons()` |
| Component style variant | `style-<name>` | `style-default`, `style-testimonial` |
| Feature modifier (web components) | `with-<feature>` | `with-background-and-divider` |

## Do's

- Erfordert ein Prompt änderungen an mehr als 3 Dateien, frag den User, ob das so gewünscht ist. Gib einen kurzen Abriss, was Du ändern willst.
- Versuche css styling zunächst mit purem CSS (Selektoren) zu machen. Frag nach, wenn du typescript code ändern musst.
- Frag nach, wenn Du andere Packages ändern musst.
- Benutze die `trunkjs/content-pane` notation `{: layout="..."}` in den Demo-Dateien, um die Layouts zu rendern. Frage nach, bevor du HTML in Markdown dateien anlegst.

## Dont`s

- Ändere keine Dateien außerhalb der `nextrap-base/`, `nextrap-layout/` und `nextrap-elements/` Verzeichnisse außer es wird explizit im Prompt verlangt.
- Füge keine Css Variablen in den shadow dom hinzu ohne vorher den User zu fragen.
- Führe nie Git Befehle dirket aus ohne zu fragen.