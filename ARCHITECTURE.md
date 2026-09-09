# Nextrap-Architekturvertrag

Dieser interne Vertrag gilt repo-weit für die Entwicklung von Nextrap-Komponenten und deren Generator-Templates.

## § 1 Light-DOM-Styling und Entrypoints

Komponenten (`nte-*` und `ntl-*`) dürfen niemals Light-DOM-SCSS/-CSS über ihre `index.ts` importieren, exportieren oder re-exportieren; das gilt auch für Side-Effect-Imports, dynamische Imports und indirekte Einbindung über Runtime-Module. Der Import oder die Registrierung einer Komponente darf keine Light-DOM-Styles ausgeben oder injizieren. Light-DOM-Styling wird ausschließlich über die öffentlichen Sass-Mixins bereitgestellt und vom Theme beziehungsweise der Anwendung explizit per `@include` eingebunden. Der Sass-Entrypoint `index.scss` exportiert nur die Mixin-API und erzeugt beim Laden keine CSS-Ausgabe. Internes Shadow-DOM-SCSS bleibt auf den bestehenden Shadow-DOM-Vertrag beschränkt; es ist kein Weg zur Ausgabe von Light-DOM-Styles.

## § 2 Generatoren

Komponenten-Generatoren müssen diesen Vertrag bereits in ihren Templates erfüllen: `index.ts` enthält keine Light-DOM-Style-Imports oder -Exports, und `index.scss` stellt ausschließlich die öffentliche Sass-Mixin-API ohne CSS-Ausgabe bereit. Neue Light-DOM-Regeln gehören in Mixins; ihre Materialisierung und der Zielselektor werden ausschließlich vom Theme beziehungsweise der Anwendung bestimmt.
