# nte-offcanvas usage examples
{: layout="1;.container.nte-offcanvas-demo"}

Das Offcanvas erhält automatisch `style-default`, solange keine andere `style-*` Klasse gesetzt ist.

<button class="btn btn-primary" data-demo-open="#demo-offcanvas">Offcanvas öffnen</button>

<nte-offcanvas id="demo-offcanvas">
  <div slot="header" class="demo-offcanvas-header">
    <strong>Offcanvas Header</strong>
    <button class="btn btn-primary" data-nt-dismiss="offcanvas">Schließen</button>
  </div>

  <div class="demo-offcanvas-body">
    <p>Dies ist der Inhalt des Offcanvas.</p>
    <p>Buttons mit <code>data-nt-dismiss="offcanvas"</code> schließen das nächstgelegene Offcanvas.</p>
  </div>

  <div slot="footer" class="demo-offcanvas-actions">
    <span>Footer</span>
    <button class="btn btn-secondary" data-nt-dismiss="offcanvas">Schließen</button>
  </div>
</nte-offcanvas>
