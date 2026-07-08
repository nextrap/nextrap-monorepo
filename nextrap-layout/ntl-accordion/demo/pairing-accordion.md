# Accordion in ntl-2col
{: layout="1;.container"}

Diese Pairing-Demo zeigt `ntl-accordion` innerhalb von `ntl-2col`: einmal in der Main-Spalte mit Bild in der Aside-Spalte und einmal in der Aside-Spalte ohne Bild.

## Accordion in Main, Bild in Aside

<ntl-2col style="--cols: 7;">
  <ntl-accordion initial-open-index="0" exclusive="true">
    <section>
      <h3>Planung</h3>
      <p>Das Accordion liegt in der Main-Spalte. Das Bild daneben wird automatisch in die Aside-Spalte verschoben.</p>
    </section>
    <section>
      <h3>Umsetzung</h3>
      <p>Main und Aside bleiben im Desktop-Modus nebeneinander.</p>
    </section>
    <section>
      <h3>Ergebnis</h3>
      <p>So kann erklärender Accordion-Content mit einem visuellen Motiv kombiniert werden.</p>
    </section>
  </ntl-accordion>

  <p><img src="https://placehold.co/700x500?text=Aside+Bild" alt="Aside Bild" /></p>
</ntl-2col>

## Accordion in Aside, ohne Bild

<ntl-2col style="--cols: 7;">
  <div>
    <h3>Main-Inhalt</h3>
    <p>Die Main-Spalte enthält normalen Text. Das Accordion wird über die Klasse <code>aside</code> explizit in die Aside-Spalte gelegt.</p>
  </div>

  <ntl-accordion class="aside" initial-open-index="0">
    <section>
      <h3>Seitliche Info</h3>
      <p>Dieses Accordion steht in der Aside-Spalte.</p>
    </section>
    <section>
      <h3>Ohne Bild</h3>
      <p>Hier wird kein Bild verwendet; die Aside-Spalte besteht nur aus Accordion-Inhalten.</p>
    </section>
    <section>
      <h3>Zusatzdaten</h3>
      <p>Geeignet für Fakten, Downloads oder kompakte Detailinformationen.</p>
    </section>
  </ntl-accordion>
</ntl-2col>
