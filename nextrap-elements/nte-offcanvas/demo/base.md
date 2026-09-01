# Basis
{: layout="1;.container.nte-offcanvas-demo"}

Das Offcanvas stellt Header, Main und Footer bereit. Der Close-Button wird standardmäßig von der Komponente gerendert und kann über den `close`-Slot ersetzt werden.

<button class="btn btn-primary" data-demo-open="#demo-offcanvas">Offcanvas öffnen</button>

<nte-offcanvas id="demo-offcanvas" aria-label="Basis Offcanvas">
  <div slot="header" class="demo-offcanvas-header">
    <strong>Offcanvas Header</strong>
  </div>

  <div class="demo-offcanvas-body">
    <p>Dies ist der Default-Slot des Offcanvas.</p>
    <p>Der eingebaute Close-Button benötigt kein zusätzliches Markup.</p>
  </div>

  <div slot="footer" class="demo-offcanvas-actions">
    <span>Footer</span>
    <button class="btn btn-secondary" data-nt-dismiss="offcanvas">Schließen</button>
  </div>
</nte-offcanvas>
