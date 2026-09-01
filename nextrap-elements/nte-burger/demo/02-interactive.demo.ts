import { defineDemo, type TDemoEnvironment } from '@trunkjs/demo-viewer';
import type { NteBurger } from '../src/lib/nte-burger';
import './main';

function updateState(env: TDemoEnvironment) {
  const burger = env.query<NteBurger>('#interactive-burger');
  env.query<HTMLElement>('#interactive-menu').hidden = !burger.open;
  env.controls.setValue('state', burger.open ? 'Navigation is open.' : 'Navigation is closed.');
}

export default defineDemo({
  title: 'Interactive navigation',
  description: 'Toggle a controlled menu and inspect its accessible state',
  order: 20,
  html: `
    <main class="nte-burger-demo">
      <nte-burger id="interactive-burger" text="Toggle main navigation" aria-controls="interactive-menu"></nte-burger>
      <nav id="interactive-menu" class="nte-burger-demo__menu" aria-label="Main navigation" hidden>
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#contact">Contact</a>
      </nav>
    </main>`,
  controls: {
    items: [
      {
        type: 'button',
        label: 'Toggle menu',
        onClick(_, env) {
          const burger = env.query<NteBurger>('#interactive-burger');
          burger.toggle();
          void burger.updateComplete.then(() => updateState(env));
        },
      },
      {
        type: 'checkbox',
        label: 'Disabled',
        onChange(event, env) {
          env.query<NteBurger>('#interactive-burger').disabled = Boolean(event.value);
        },
      },
      { id: 'state', type: 'output', label: 'Accessible state', value: 'Navigation is closed.' },
    ],
  },
  afterRender(env) {
    const burger = env.query<NteBurger>('#interactive-burger');
    const onClick = () => void burger.updateComplete.then(() => updateState(env));
    burger.addEventListener('click', onClick);
    updateState(env);
    return () => burger.removeEventListener('click', onClick);
  },
});
