# NTL 2Col Usage-Beispiele

Bereichsklassen wie `.aside` oder `.top` müssen am direkten Light-DOM-Kind von `ntl-2col` stehen.

## Standard

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col" section-style="--cols: 8;"}

Der Hauptinhalt bleibt in `main`.

![Diagnostik](./diagnostik.jpg)
```

## Überschrift als linke Spalte

Bevorzugt wird die Überschrift `aside` zugeordnet. `.reverse` setzt sie im Desktop-Modus nach links und mobil vor `main`.

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.reverse" .aside section-style="--cols: 8;"}

Der Hauptinhalt bleibt in `main`.
```

## Ausnahme: `top` als linke Spalte

Ein leeres `aside` setzt `main` intern auf volle Breite. Die Theme-Klasse muss deshalb die betroffenen Parts im Desktop-Modus überschreiben und mobil zurücksetzen.

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
