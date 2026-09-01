# Open Groups und Placement-Exklusivität
{: layout="1;.container.nte-offcanvas-demo"}

Pro Placement kann nur ein Offcanvas offen sein. Zusätzlich kann `open-group` Offcanvas an unterschiedlichen Placements gegenseitig ausschließen.

## Gleiches Placement

<div class="demo-buttons">
  <button class="btn btn-primary" data-demo-open="#same-right-a">Right A</button>
  <button class="btn btn-primary" data-demo-open="#same-right-b">Right B</button>
</div>

<nte-offcanvas id="same-right-a" class="demo-right" aria-label="Right A">
  <strong slot="header">Right A</strong>
  <div class="demo-offcanvas-body">Öffne danach Right B. Dieses Element schließt zuerst selbst.</div>
</nte-offcanvas>

<nte-offcanvas id="same-right-b" class="demo-right demo-wide" aria-label="Right B">
  <strong slot="header">Right B</strong>
  <div class="demo-offcanvas-body">Gleiches Placement, andere Größe.</div>
</nte-offcanvas>

## Gemeinsame Open Group

<div class="demo-buttons">
  <button class="btn btn-primary" data-demo-open="#group-left">Navigation links</button>
  <button class="btn btn-primary" data-demo-open="#group-fullscreen">Navigation fullscreen</button>
</div>

<nte-offcanvas id="group-left" class="demo-left" open-group="main-navigation" aria-label="Navigation links">
  <strong slot="header">Desktop Navigation</strong>
  <div class="demo-offcanvas-body">Left und Fullscreen gehören zur selben `main-navigation` Group.</div>
</nte-offcanvas>

<nte-offcanvas id="group-fullscreen" class="demo-fullscreen" open-group="main-navigation" aria-label="Navigation fullscreen">
  <strong slot="header">Mobile Navigation</strong>
  <div class="demo-offcanvas-body">Öffnen schließt die linke Navigation trotz anderem Placement.</div>
</nte-offcanvas>
