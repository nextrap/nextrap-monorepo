import './_virtual_tdemo-client-CxMeb5Rk.js';
import './directive-CJw_OlP2.js';
import './index-BR6EnczS.js';
import './nextrap-element-DeSHPIJn.js';
import './nte-privacy-consent-D9iLXL-8.js';
import './property-C2fH_zxw.js'; /* empty css              */
import { d as e } from './types-4rIte7rE.js';
const n = `# NTE Privacy Consent

Das Element zeigt beim ersten Besuch einen Dialog. **Alle akzeptieren** bleibt immer die primäre Aktion. Über **Einstellungen** lassen sich Dienste einzeln abwählen; \`show-reject-all\` ergänzt die direkte Ablehnung.

\`\`\`html
<nte-privacy-consent policy-version="2026-08" show-reject-all>
  <script
    type="text/plain"
    data-consent-service="analytics"
    data-consent-label="Analytics"
    data-src="/analytics.js">
  <\/script>

  <template data-consent-service="youtube" data-consent-label="YouTube">
    <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Video"></iframe>
  </template>
</nte-privacy-consent>
\`\`\`

Die Entscheidung liegt standardmäßig versioniert im Local Storage. \`storage="session"\` begrenzt sie auf die Browsersitzung; \`storage="memory"\` speichert sie nur bis zum Verlassen der Seite.
`,
  m = e({
    title: 'NTE Privacy Consent',
    description: 'HTML-first API für ein einmaliges Datenschutz-Modal und optionale externe Dienste',
    markdown: n,
  });
export { m as default };
