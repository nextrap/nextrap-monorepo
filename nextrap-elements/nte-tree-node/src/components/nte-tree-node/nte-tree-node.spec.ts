import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NteTreeNodeElement } from './nte-tree-node';

// Helper function to create and mount a tree node element
async function createTreeNode(innerHTML: string = ''): Promise<NteTreeNodeElement> {
  const element = new NteTreeNodeElement();
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  document.body.appendChild(element);
  await element.updateComplete;
  return element;
}

describe('nte-tree-node', () => {
  let element: NteTreeNodeElement;

  beforeEach(async () => {
    element = await createTreeNode(`
      <span slot="name">Test Node</span>
      <i slot="icon" class="fa fa-file"></i>
    `);
  });

  afterEach(() => {
    // Clean up elements after each test
    document.body.innerHTML = '';
  });

  it('should create an element', () => {
    expect(element).toBeInstanceOf(NteTreeNodeElement);
  });

  describe('toggle functionality', () => {
    let parentElement: NteTreeNodeElement;

    beforeEach(async () => {
      parentElement = await createTreeNode(`
        <span slot="name">Parent Node</span>
        <i slot="icon" class="fa fa-folder"></i>
        
        <nte-tree-node>
          <span slot="name">Child Node</span>
          <i slot="icon" class="fa fa-file"></i>
        </nte-tree-node>
      `);
    });

    it('should detect children and show toggle icon', () => {
      const toggleIcon = parentElement.shadowRoot?.querySelector('.toggle-icon');
      expect(toggleIcon).toBeTruthy();
    });

    it('should toggle expanded state when clicked', async () => {
      const button = parentElement.shadowRoot?.querySelector('.tree-node-header') as HTMLButtonElement;
      expect(parentElement.expanded).toBe(false);

      button.click();
      await parentElement.updateComplete;

      expect(parentElement.expanded).toBe(true);
    });
  });

  describe('keyboard navigation', () => {
    let parentElement: NteTreeNodeElement;

    beforeEach(async () => {
      parentElement = await createTreeNode(`
        <nte-tree-node>
          <span slot="name">Parent Node</span>
          <i slot="icon" class="fa fa-folder"></i>
          
          <nte-tree-node>
            <span slot="name">Child Node</span>
            <i slot="icon" class="fa fa-file"></i>
          </nte-tree-node>
        </nte-tree-node>
      `);
    });

    it('should toggle with Enter key', async () => {
      const button = parentElement.shadowRoot?.querySelector('.tree-node-header') as HTMLButtonElement;
      expect(parentElement.expanded).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      button.dispatchEvent(event);
      await parentElement.updateComplete;

      expect(parentElement.expanded).toBe(true);
    });

    it('should toggle with Space key', async () => {
      const button = parentElement.shadowRoot?.querySelector('.tree-node-header') as HTMLButtonElement;
      expect(parentElement.expanded).toBe(false);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      button.dispatchEvent(event);
      await parentElement.updateComplete;

      expect(parentElement.expanded).toBe(true);
    });

    it('should expand with ArrowRight when collapsed', async () => {
      const button = parentElement.shadowRoot?.querySelector('.tree-node-header') as HTMLButtonElement;
      expect(parentElement.expanded).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      button.dispatchEvent(event);
      await parentElement.updateComplete;

      expect(parentElement.expanded).toBe(true);
    });

    it('should collapse with ArrowLeft when expanded', async () => {
      parentElement.expanded = true;
      await parentElement.updateComplete;

      const button = parentElement.shadowRoot?.querySelector('.tree-node-header') as HTMLButtonElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      button.dispatchEvent(event);
      await parentElement.updateComplete;

      expect(parentElement.expanded).toBe(false);
    });
  });

  describe('accessibility features', () => {
    let parentElement: NteTreeNodeElement;

    beforeEach(async () => {
      parentElement = await createTreeNode(`
        <nte-tree-node>
          <span slot="name">Parent Node</span>
          <i slot="icon" class="fa fa-folder"></i>
          
          <nte-tree-node>
            <span slot="name">Child Node</span>
            <i slot="icon" class="fa fa-file"></i>
          </nte-tree-node>
        </nte-tree-node>
      `);
    });

    it('should have proper ARIA attributes', () => {
      const treeNode = parentElement.shadowRoot?.querySelector('.tree-node');
      expect(treeNode?.getAttribute('role')).toBe('treeitem');
      expect(treeNode?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded when toggled', async () => {
      const button = parentElement.shadowRoot?.querySelector('.tree-node-header') as HTMLButtonElement;
      button.click();
      await parentElement.updateComplete;

      const treeNode = parentElement.shadowRoot?.querySelector('.tree-node');
      expect(treeNode?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have button with proper ARIA attributes', () => {
      const button = parentElement.shadowRoot?.querySelector('.tree-node-header') as HTMLButtonElement;
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('should mark children container as inert when collapsed', () => {
      const childrenContainer = parentElement.shadowRoot?.querySelector('.tree-node-children');
      expect(childrenContainer?.hasAttribute('inert')).toBe(true);
    });

    it('should remove inert from children container when expanded', async () => {
      parentElement.expanded = true;
      await parentElement.updateComplete;

      const childrenContainer = parentElement.shadowRoot?.querySelector('.tree-node-children');
      expect(childrenContainer?.hasAttribute('inert')).toBe(false);
    });

    it('should have aria-hidden on decorative elements', () => {
      const icon = parentElement.shadowRoot?.querySelector('.tree-node-icon');
      const toggle = parentElement.shadowRoot?.querySelector('.toggle-spacer');

      expect(icon?.getAttribute('aria-hidden')).toBe('true');
      if (toggle) {
        expect(toggle.getAttribute('aria-hidden')).toBe('true');
      }
    });
  });
});
