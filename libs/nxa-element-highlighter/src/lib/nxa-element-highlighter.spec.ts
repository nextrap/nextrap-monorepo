import { NxaElementHighlighter } from '@nextrap/element-highlighter';
import { html } from 'lit';
import { expect } from 'vitest';
import { render } from 'vitest-browser-lit';

describe('nxaElementHighlighter', () => {
  it('should create an element', () => {
    const el = new NxaElementHighlighter();
    expect(el).toBeInstanceOf(NxaElementHighlighter);
  });

  it('renders', async () => {
    const screen = render(html`
      <div class="target">Target</div>
      <nxa-element-highlighter
        data-testid="highlight"
        initiallyShown
        selector=".target"
      ></nxa-element-highlighter>
    `);
    const element = screen.getByTestId('highlight');
    await expect.element(element).toBeInTheDocument();
  });
});
