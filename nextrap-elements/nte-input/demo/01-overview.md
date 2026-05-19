# nte-input

Minimaler Input-Wrapper mit Plugin-Architektur für einheitliche Formulare.

## Kurzüberblick

`nte-input` liefert den gemeinsamen Rahmen für Label, Control, Validation und Input-Aid.
Der eigentliche Feldtyp kommt aus statisch registrierten Plugins.

## Was du im Paket bekommst

- **Text, E-Mail und Passwort** mit einheitlichem Frame
- **Textarea** mit Auto-Grow
- **Select** aus `<options>` oder `data-options`
- **Select-Radio** für Single- und Multi-Select-Szenarien
- **Token-Input** mit Vorschlägen, Freitext und `strict`-Modus
- **Checkbox** als spezialisierten Sonderfall
- **Start-/End-Slots** für Icons, Buttons und Affordanzen
- **Validation** und **Input-Aid** unter dem Feld
- **Form-Association** für natives `FormData`
- **FormDataAccessor** zum direkten Lesen und Setzen per Datenobjekt
- **SCSS-Mixins** für Themes, Floating Labels, Größen und Select-Radio-Layouts

## Demo-Fahrplan

1. **Styles & Typen** – zeigt die wichtigsten Feldtypen, Themes, Größen und Slots
2. **FormData Submit** – liest native Formularwerte über `new FormData(form)` aus
3. **FormDataAccessor** – synchronisiert Inputs direkt mit JSON-Daten
4. **Validation** – demonstriert Pflichtfelder, Pattern und Browser-Validierung
5. **Select-Radio Vertical** – zeigt das Layout-Mixin für nebeneinander angeordnete Optionen

## Schnellstart

```html
<nte-input class="default hoverlabel" label="E-Mail" type="email" required></nte-input>

<nte-input
  class="default hoverlabel"
  label="Status"
  type="select"
  data-options="draft|Entwurf;active|Aktiv"
></nte-input>

<nte-input
  class="default hoverlabel"
  label="Tags"
  type="token-input"
  value='["news"]'
  data-options='[{"value":"news","label":"News"},{"value":"docs","label":"Dokumentation"}]'
></nte-input>
```

Weitere Details zu API und Styling stehen in der README des Pakets.