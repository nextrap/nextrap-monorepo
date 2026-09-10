# nte-consent-blocker in ntl-2col

Das Demo-Theme kombiniert `default-style()` mit `pairing-ntl-2col-in-nte-consent-blocker()`.
Alle Instanzen verwenden die gemeinsamen Templates aus `demo/setup.ts`; `.style-default` wird automatisch ergänzt.

## Consent Blocker als Aside
{: layout="ntl-2col" section-style="--cols: 6;"}

Der Text bleibt in der Hauptspalte. Der folgende Blocker ist ein direktes Kind mit `.aside`
und wird damit der zweiten Spalte zugeordnet. Mobil folgt er auf den Hauptinhalt.

---
{: layout="3;nte-consent-blocker.aside.maps-global"}

## Consent Blocker im Top-Slot
{: layout="ntl-2col"}

Der Blocker liegt oberhalb von Main und Aside innerhalb des Wrapper-Rahmens. Das Pairing setzt
für den Top-Bereich das Seitenverhältnis 21:9, auch im Mobile-Modus.

---
{: layout="3;nte-consent-blocker.top.maps-global"}

### Aside-Inhalt
{: layout=".aside"}

Die Aside-Spalte bleibt für zusätzliche Informationen frei.
