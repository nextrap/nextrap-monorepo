import { html } from 'lit';
import { expect } from 'vitest';
import { render } from 'vitest-browser-lit';
import { NteElementHighlighter } from './nte-element-highlighter';

describe('nte-element-highlighter', () => {
  it('should create an element', () => {
    const el = new NteElementHighlighter();
    expect(el).toBeInstanceOf(NteElementHighlighter);
  });

  it('renders', async () => {
    const screen = render(html`
      <div class="target">Target</div>
      <nxa-element-highlighter data-testid="highlight" initiallyShown selector=".target"></nxa-element-highlighter>
    `);
    const element = screen.getByTestId('highlight');
    await expect.element(element).toBeInTheDocument();
  });
});
