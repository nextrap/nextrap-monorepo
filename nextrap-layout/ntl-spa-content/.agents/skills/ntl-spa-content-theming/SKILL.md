---
name: ntl-spa-content-theming
description: "Theme-SCSS für @nextrap/ntl-spa-content erstellen oder ändern: default-style(), öffentliche Parts und Sidebar-Breiten. Nicht für allgemeine Markup- oder API-Fragen."
---

# SPA Content gestalten

Nutze diese API für das Theme des Workspaces. Für Import, Slots und direkte
HTML-Einbindung lies den [Usage-Skill](../ntl-spa-content-usage/SKILL.md).

## Einbindung

```scss
@use '@nextrap/ntl-spa-content' as spa;

// Die Anwendung stellt die --nt-* Tokens einmal auf Theme-Ebene bereit.
ntl-spa-content.style-default {
  @include spa.default-style();
  --sidebar-left-width: 15rem;
  --sidebar-right-width: 18rem;

  // Ein Editor kann seinen eigenen Innenabstand übernehmen.
  &::part(content) {
    padding: 0;
  }
}
```

`index.scss` exportiert ausschließlich `default-style()` und erzeugt beim
Import kein CSS. Das Mixin materialisiert Farben, Flächen, Trennlinien,
Innenabstände und Fokusmarkierungen am aufrufenden Selektor. Es verwendet
`--nt-text`, `--nt-surface`, `--nt-surface-muted`, `--nt-border`, `--nt-primary`,
`--nt-font-family` sowie `--nt-space-2/3/4` aus dem Anwendungstheme.

## Öffentliche Oberfläche

| Part | Verantwortung |
|---|---|
| `main` | Gesamte mittlere Spalte einschließlich Header und Footer. |
| `header`, `footer` | Feste Leisten ausschließlich in der Mitte. |
| `content` | Default-Slot und dessen Scrollport. |
| `sidebar-left`, `sidebar-right` | Ganze Sidebar über die volle Layouthöhe. |
| `sidebar-left-header`, `sidebar-right-header` | Feste Sidebar-Leisten. |
| `sidebar-left-content`, `sidebar-right-content` | Unabhängige Sidebar-Scrollports. |

| CSS-Variable | Default | Bedeutung |
|---|---|---|
| `--sidebar-left-width` | `16rem` | Gewünschte Breite links. |
| `--sidebar-right-width` | `18rem` | Gewünschte Breite rechts. |

Beide Breiten sind funktional auf jeweils 35% des Hosts begrenzt. Diese Grenze
kann ein bewusst angepasstes Theme über die Sidebar-Parts ändern. Prüfe dabei,
dass für die Mitte Platz bleibt. Es gibt keinen Breakpoint-Zustand; die
CSS-Begrenzung funktioniert ohne Media Queries oder zusätzliches Responsive-Element.

## Layout-Vertrag

Erhalte die funktionalen Shadow-Regeln für Sticky, Viewport-Höhe, Flex-Verteilung,
`min-inline-size: 0`, `min-block-size: 0`, Scrollports und leere Slots. Die
Sidebars liegen außerhalb der mittleren Header-/Footer-Zeilen. Lass natives
Scroll-Chaining zu, wenn die äußere Navbar wieder erreichbar bleiben soll.

Gestalte Farben, Rahmen und Abstände ausschließlich über Parts und die äußere
Sass-Schicht. Erfinde für einzelne Breiten keine neue `style-*` Variante und
setze pro Instanz genau eine solche Klasse. Das Package definiert keine
zusätzlichen Modifier-Klassen.
