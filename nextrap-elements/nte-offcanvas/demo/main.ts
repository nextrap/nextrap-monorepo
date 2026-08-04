import '@nextrap/nte-demo-viewer';
import '@nextrap/style-base';
import '@nextrap/style-button';
import '@nextrap/style-typography';
import '@nextrap/style-utils';
import '../index.ts';
import './main.scss';

document.addEventListener('click', (event) => {
  const trigger = event.target instanceof HTMLElement ? event.target.closest('[data-demo-open]') : null;

  if (!(trigger instanceof HTMLElement)) {
    return;
  }

  const selector = trigger.dataset.demoOpen;
  const offcanvas = selector ? document.querySelector(selector) : null;

  if (offcanvas instanceof HTMLElement && 'open' in offcanvas && typeof offcanvas.open === 'function') {
    offcanvas.open();
  }
});
