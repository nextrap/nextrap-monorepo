# Placements
{: layout="1;.container.nte-offcanvas-demo"}

Placement und Mode werden über CSS Custom Properties bestimmt. Die Buttons öffnen dieselbe API für unterschiedliche Präsentationen.

<div class="demo-buttons">
  <button class="btn btn-primary" data-demo-open="#offcanvas-left">Left</button>
  <button class="btn btn-primary" data-demo-open="#offcanvas-right">Right</button>
  <button class="btn btn-primary" data-demo-open="#offcanvas-top">Top</button>
  <button class="btn btn-primary" data-demo-open="#offcanvas-bottom">Bottom</button>
  <button class="btn btn-primary" data-demo-open="#offcanvas-fullscreen">Fullscreen</button>
</div>

<nte-offcanvas id="offcanvas-left" class="demo-left" aria-label="Left Offcanvas">
  <strong slot="header">Left</strong>
  <div class="demo-offcanvas-body">Fährt von links mit dem Standard-Overshoot ein.</div>
</nte-offcanvas>

<nte-offcanvas id="offcanvas-right" class="demo-right" aria-label="Right Offcanvas">
  <strong slot="header">Right</strong>
  <div class="demo-offcanvas-body">Fährt von rechts mit dem Standard-Overshoot ein.</div>
</nte-offcanvas>

<nte-offcanvas id="offcanvas-top" class="demo-top" aria-label="Top Offcanvas">
  <strong slot="header">Top Sheet</strong>
  <div class="demo-offcanvas-body">Sliding-Sheet von oben.</div>
</nte-offcanvas>

<nte-offcanvas id="offcanvas-bottom" class="demo-bottom" aria-label="Bottom Offcanvas">
  <strong slot="header">Bottom Sheet</strong>
  <div class="demo-offcanvas-body">Geeignet für mobile Actions, Warenkorb oder Navigation.</div>
</nte-offcanvas>

<nte-offcanvas id="offcanvas-fullscreen" class="demo-fullscreen" aria-label="Fullscreen Offcanvas">
  <strong slot="header">Fullscreen</strong>
  <div class="demo-offcanvas-body">Fullscreen droppt standardmäßig von oben in den Viewport.</div>
</nte-offcanvas>
