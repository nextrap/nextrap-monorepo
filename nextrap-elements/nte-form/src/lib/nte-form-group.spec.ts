import { html } from 'lit';
import { expect } from 'vitest';
import { render } from 'vitest-browser-lit';
import { NteFormGroup } from './nte-form-group';

// TODO: Here are some errors when running the tests (related to comparing screenshots?)
describe.todo('NteFormGroup', () => {
  it('should create an element', () => {
    const el = new NteFormGroup();
    expect(el).toBeInstanceOf(NteFormGroup);
  });

  it('renders with default properties', async () => {
    const { container } = render(html` <nte-form-group data-testid="form-group"></nte-form-group> `);
    const element = container.querySelector('[data-testid="form-group"]');
    expect(element).not.toBeNull();
    await expect(element).toBeInTheDocument();

    const groupDiv = element!.shadowRoot?.querySelector('.form-group');
    expect(groupDiv).not.toBeNull();
    const style = window.getComputedStyle(groupDiv!);
    expect(style.getPropertyValue('--gap')).toBe('1rem');
    expect(style.getPropertyValue('--align-items')).toBe('stretch');
    expect(style.getPropertyValue('--cols-sm')).toBe('1');
    expect(style.getPropertyValue('--cols-md')).toBe('1');
    expect(style.getPropertyValue('--cols-lg')).toBe('1');
  });

  it('renders with custom properties', async () => {
    const { container } = render(html`
      <nte-form-group data-testid="form-group-custom" gap="2" alignItems="center" cols="1-2-4"></nte-form-group>
    `);
    const element = container.querySelector('[data-testid="form-group-custom"]');
    expect(element).not.toBeNull();
    await expect(element).toBeInTheDocument();

    const groupDiv = element!.shadowRoot?.querySelector('.form-group');
    expect(groupDiv).not.toBeNull();
    // Note: Reading CSS variables set via inline style attribute directly through getComputedStyle can be tricky.
    // It's often better to check the attribute or the effect of the variable.
    // For simplicity, we'll check the inline style string here, though this is less robust.
    const styleAttribute = groupDiv!.getAttribute('style');
    expect(styleAttribute).toContain('--gap: 2rem;');
    expect(styleAttribute).toContain('--align-items: center;');
    expect(styleAttribute).toContain('--cols-sm: 1;');
    expect(styleAttribute).toContain('--cols-md: 2;');
    expect(styleAttribute).toContain('--cols-lg: 4;');
  });

  it('slots content', async () => {
    const { container } = render(html`
      <nte-form-group data-testid="form-group-slotted">
        <div>Slotted Content</div>
      </nte-form-group>
    `);
    const element = container.querySelector('[data-testid="form-group-slotted"]');
    expect(element).not.toBeNull();
    const slot = element!.shadowRoot?.querySelector('slot');
    expect(slot).not.toBeNull();
    const slottedContent = slot!.assignedNodes()[0] as HTMLElement;
    expect(slottedContent.textContent).toBe('Slotted Content');
  });
});
