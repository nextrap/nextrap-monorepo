# NTL 2Col Theme-Beispiele

Bereichsklassen wie `.aside` oder `.top` müssen am direkten Light-DOM-Kind von `ntl-2col` landen.

## Standard

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.style-focus" section-style="--cols: 8;"}

Der Hauptinhalt bleibt in `main`.

![Diagnostik](./diagnostik.jpg)
```

```scss
@use '@nextrap/ntl-2col' as twoCol;

ntl-2col.style-focus {
  @include twoCol.default-style();
}
```

## Überschrift als linke Spalte

Bevorzugt wird die Überschrift `aside` zugeordnet. `.reverse` setzt sie auf Desktop nach links und mobil vor `main`.

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.style-heading-column.reverse" .aside section-style="--cols: 8;"}

Der Hauptinhalt bleibt in `main`.
```

```scss
ntl-2col.style-heading-column {
  @include twoCol.default-style();
}
```

## Ausnahme: `top` als linke Spalte

Ein leeres `aside` setzt `main` intern auf volle Breite. Die Theme-Klasse muss deshalb die betroffenen Parts für Desktop überschreiben und mobil zurücksetzen.

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.style-top-heading" .top section-style="--cols: 8;"}

Der Hauptinhalt bleibt in `main`.
```

```scss
ntl-2col.style-top-heading {
  @include twoCol.default-style();

  &[mode='desktop'] {
    &::part(wrapper) { flex-direction: row; }
    &::part(top) { order: 1; width: auto; flex: 1 1 0; }
    &::part(main) {
      order: 2;
      width: calc(100% * var(--cols, 8) / 12);
      flex: 0 0 calc(100% * var(--cols, 8) / 12);
    }
  }

  &[mode='mobile'] {
    &::part(wrapper) { flex-direction: column; }
    &::part(top) { order: 1; width: 100%; flex: 0 0 auto; }
    &::part(main) { order: 2; width: 100%; flex: 0 0 auto; }
  }
}
```
