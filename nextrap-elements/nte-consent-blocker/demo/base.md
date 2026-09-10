# nte-consent-blocker

Die Beispiele verwenden Markdown und die automatisch ergänzte Style-Klasse. Das Demo-Theme bindet
`default-style()` in `demo/main.scss` ein; gemeinsame Templates stehen einmalig in `index.html`.

## Eingebauter Hinweis und Vorschau

Nur das Embed-Template wird ausgewählt. Vorschau und Consent-Hinweis ergänzt die Komponente selbst.
Der externe Karteninhalt wird erst nach dem Klick auf den Freigabebutton eingesetzt.

---
{: layout="nte-consent-blocker" section-style="--default-template-selector: #google-maps-template;"}

## Gemeinsame Vorlagen

Die Klasse `maps-global` wählt die drei zentralen Templates aus. Dadurch brauchen weitere Instanzen
kein dupliziertes Embed-, Vorschau- oder Button-Markup.

---
{: layout="nte-consent-blocker.maps-global"}

## Eigenes Seitenverhältnis

Das Seitenverhältnis wird pro Instanz gesetzt. Der Wert gilt auch im Mobile-Modus und überschreibt
hier bewusst die Standardverhältnisse 16:9 auf Desktop und 1:1 auf Mobile.

---
{: layout="nte-consent-blocker.maps-global" section-style="--aspect-ratio: 4 / 3;"}
