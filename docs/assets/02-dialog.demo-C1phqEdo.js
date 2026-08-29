const e = `import '@nextrap/style-base';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import demoHtml from './02-dialog.html?raw';
import './main.scss';

export default defineDemo({
  title: 'Dialog und Einstellungen',
  description: 'Direkte Ablehnung, Einzeldienste und persistenter Launcher',
  render(root) {
    localStorage.removeItem('nte-privacy-consent-demo');
    const template = document.createElement('template');
    template.innerHTML = demoHtml;
    root.replaceChildren(template.content.cloneNode(true));
  },
});
`;
export { e as default };
