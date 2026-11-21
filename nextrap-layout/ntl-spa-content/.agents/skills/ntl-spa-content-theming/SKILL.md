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
`--nt-text`, `--nt-surface`, `--nt-surface-raised`, `--nt-border`, `--nt-primary`,
`--nt-font-family` sowie `--nt-space-2/3/4` aus dem Anwendungstheme. Beide Sidebars
nutzen `--nt-surface-raised`: im hellen Theme weiß, einschließlich ihrer festen
Header. Die Fläche passt sich weiterhin dem gewählten Farbschema an.

## Öffentliche Oberfläche

| Part | Verantwortung |
|---|---|
| `main` | Gesamte mittlere Spalte einschließlich Header und Footer. |
| `header`, `footer` | Sticky Header und normal mitfließender Footer in der Mitte. |
| `content` | Default-Slot im Dokumentfluss, ohne eigenen Scrollport. |
| `sidebar-left`, `sidebar-right` | Ganze Sidebar über die verfügbare sichtbare Höhe. |
| `sidebar-left-header`, `sidebar-right-header` | Mit ihrer Sidebar scrollende Leisten. |
| `sidebar-left-content`, `sidebar-right-content` | Sidebar-Inhalte ohne zusätzliche Scrollports. |

| CSS-Variable | Default | Bedeutung |
|---|---|---|
| `--sidebar-left-width` | `16rem` | Gewünschte Breite links. |
| `--sidebar-right-width` | `18rem` | Gewünschte Breite rechts. |

Beide Breiten sind funktional auf jeweils 35% des Hosts begrenzt. Diese Grenze
kann ein bewusst angepasstes Theme über die Sidebar-Parts ändern. Prüfe dabei,
dass für die Mitte Platz bleibt. Es gibt keinen Breakpoint-Zustand; die
CSS-Begrenzung funktioniert ohne Media Queries oder zusätzliches Responsive-Element.

## Layout-Vertrag

Der Host wächst mit dem Hauptinhalt im Dokumentfluss. Ausschließlich dessen
Header und beide Sidebars sind sticky am oberen Viewport-Rand. Die Sidebars
haben volle Fensterhöhe (`100dvh`, Fallback `100vh`); überlanger Inhalt scrollt
innerhalb der ganzen Sidebar. Der mittlere Inhalt hat keinen eigenen Scrollport,
der Footer folgt ihm im Dokumentfluss. View-Timelines sind nicht mehr nötig.

Erhalte die Flex-Verteilung, Mindestgrößen, Sticky-Zuordnung und Behandlung leerer
Slots. Vermeide Overflow an Vorfahren, der den Dokument-Viewport als Sticky-Bezug
ersetzt. Lass natives Scroll-Chaining in den Sidebars zu. Die Header-Fläche des
Default-Mixins muss deckend bleiben, damit vorbeiscrollender Inhalt nicht
hindurchscheint. Abstände gehören an die Parts oder deren Inhalte.

Gestalte Farben, Rahmen und Abstände ausschließlich über Parts und die äußere
Sass-Schicht. Erfinde für einzelne Breiten keine neue `style-*` Variante und
setze pro Instanz genau eine solche Klasse. Das Package definiert keine
zusätzlichen Modifier-Klassen.
