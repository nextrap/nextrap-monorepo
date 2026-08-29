import './_virtual_tdemo-client-Pi1VR-d9.js';
import './directive-CJw_OlP2.js';
import './index-BR6EnczS.js';
import './index-l0sNRNKZ.js';
import './nextrap-element-CnNsmvMM.js';
import './nte-privacy-consent-J6aWWQEv.js';
import './property-BLTBoP6p.js'; /* empty css              */
import { d as t } from './types-4rIte7rE.js';
const i = `<nte-privacy-consent policy-version="demo-1" storage-key="nte-privacy-consent-demo" show-reject-all>
  <button slot="launcher" class="btn btn-outline-primary">Datenschutzeinstellungen öffnen</button>
  <a slot="privacy-link" href="#privacy">Datenschutzerklärung</a>

  <script
    type="text/plain"
    data-consent-service="analytics"
    data-consent-label="Analytics"
    data-consent-purpose="Statistik"
    data-consent-description="Hilft uns, die Nutzung der Demo zu verstehen."
  >
    console.info('Analytics consented');
  <\/script>

  <template
    data-consent-service="video"
    data-consent-label="Video-Anbieter"
    data-consent-purpose="Medien"
    data-consent-description="Aktiviert ein extern eingebettetes Video."
  >
    <p>Der eingebettete Video-Inhalt ist jetzt aktiviert.</p>
  </template>
</nte-privacy-consent>
`,
  u = t({
    title: 'Dialog und Einstellungen',
    description: 'Direkte Ablehnung, Einzeldienste und persistenter Launcher',
    render(n) {
      localStorage.removeItem('nte-privacy-consent-demo');
      const e = document.createElement('template');
      ((e.innerHTML = i), n.replaceChildren(e.content.cloneNode(!0)));
    },
  });
export { u as default };
