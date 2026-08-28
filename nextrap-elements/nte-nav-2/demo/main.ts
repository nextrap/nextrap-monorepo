import '@nextrap/style-base';
import '@nextrap/style-typography';
import '../index';
import './main.scss';

export function renderDocumentDemo(root: HTMLElement, documentHtml: string) {
  const parsed = new DOMParser().parseFromString(documentHtml, 'text/html');
  const wrapper = document.createElement('div');

  wrapper.className = 'nte-nav-2-demo';
  wrapper.innerHTML = parsed.querySelector('main')?.outerHTML ?? parsed.body.innerHTML;
  root.replaceChildren(wrapper);
}
