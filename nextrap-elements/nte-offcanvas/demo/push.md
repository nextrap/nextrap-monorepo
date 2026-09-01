# Push + Pane
{: layout="1;.container.nte-offcanvas-demo.demo-push-stage"}

`nte-offcanvas-pane` hört auf das öffentliche Window-Event-Protokoll. Ein Push-Offcanvas reserviert Platz an seinem effektiven Placement. Links und rechts können gleichzeitig aktiv sein.

<div class="demo-buttons">
  <button class="btn btn-primary" data-demo-toggle="#push-left-a">Left A</button>
  <button class="btn btn-primary" data-demo-toggle="#push-left-b">Left B (breiter)</button>
  <button class="btn btn-primary" data-demo-toggle="#push-right">Right</button>
</div>

<nte-offcanvas id="push-left-a" class="demo-push-left-a" open-group="left-tools" aria-label="Left Push A">
  <strong slot="header">Left A</strong>
  <div class="demo-offcanvas-body">280px Push-Fläche.</div>
</nte-offcanvas>

<nte-offcanvas id="push-left-b" class="demo-push-left-b" open-group="left-tools" aria-label="Left Push B">
  <strong slot="header">Left B</strong>
  <div class="demo-offcanvas-body">380px Push-Fläche. Beim Wechsel passt sich der Pane direkt an.</div>
</nte-offcanvas>

<nte-offcanvas id="push-right" class="demo-push-right" aria-label="Right Push">
  <strong slot="header">Right</strong>
  <div class="demo-offcanvas-body">Kann parallel zur linken Push-Fläche geöffnet sein.</div>
</nte-offcanvas>

<nte-offcanvas-pane class="demo-pane">
  <div class="demo-pane-content">
    <h3>Offcanvas-aware Content</h3>
    <p>Dieser Bereich erhält automatisch Insets entsprechend der aktiven Push-Offcanvas.</p>
    <p>Beim Wechsel zwischen Left A und Left B wird der linke Inset auf die neue Breite animiert.</p>
  </div>
</nte-offcanvas-pane>
