import { html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

/**
 * Demo configuration parsed from <demo> child elements
 */
interface DemoConfig {
  title: string;
  src: string;
  description?: string;
}

/**
 * nte-demo-viewer - A component for viewing and switching between demo files
 *
 * @example
 * ```html
 * <nte-demo-viewer>
 *   <demo title="Basic Demo" src="/demo/basic.md"></demo>
 *   <demo title="Advanced Demo" src="/demo/advanced.md"></demo>
 * </nte-demo-viewer>
 * ```
 *
 * @fires demo-change - Fired when the selected demo changes
 * @fires code-change - Fired when the code is edited
 */
@customElement('nte-demo-viewer')
export class NteDemoViewerElement extends LitElement {
  /**
   * Render to Light DOM instead of Shadow DOM.
   * This is required because tj-markdown-loader needs to find tj-content-pane
   * in the same DOM tree.
   */
  override createRenderRoot() {
    return this;
  }

  @state()
  private accessor _demos: DemoConfig[] = [];

  @state()
  private accessor _currentIndex = 0;

  @state()
  private accessor _menuOpen = false;

  @state()
  private accessor _codeViewOpen = false;

  @state()
  private accessor _markdownContent = '';

  @state()
  private accessor _isLoadingCode = false;

  private _debounceTimer: number | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this._parseDemos();
  }

  /**
   * Parse <demo> child elements to extract demo configurations
   */
  private _parseDemos() {
    const demoElements = Array.from(this.querySelectorAll('demo'));
    this._demos = demoElements.map((el) => ({
      title: el.getAttribute('title') || 'Untitled Demo',
      src: el.getAttribute('src') || '',
      description: el.getAttribute('description') || undefined,
    }));
  }

  /**
   * Select a demo by index and reload the content
   */
  private _selectDemo(index: number) {
    if (index < 0 || index >= this._demos.length) return;

    this._currentIndex = index;
    this._menuOpen = false;

    this._reloadDemo();

    // Load markdown content if code view is open
    if (this._codeViewOpen) {
      this._loadMarkdownContent();
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('demo-change', {
        detail: { index, demo: this._demos[index] },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Reload the current demo from its source file
   */
  private _reloadDemo() {
    // Remove old markdown-loader and clear content
    const oldLoader = this.querySelector('tj-markdown-loader');
    if (oldLoader) oldLoader.remove();

    const contentPane = this.querySelector('tj-content-pane');
    if (contentPane) contentPane.innerHTML = '';

    // Create new markdown-loader with updated src
    const currentDemo = this._demos[this._currentIndex];
    if (currentDemo) {
      const loader = document.createElement('tj-markdown-loader');
      loader.setAttribute('target', 'tj-content-pane');
      loader.setAttribute('src', currentDemo.src);
      this.appendChild(loader);
    }
  }

  /**
   * Reload demo from edited markdown content (for live editing)
   */
  private _reloadDemoFromContent(markdownContent: string) {
    const contentPane = this.querySelector('tj-content-pane');
    if (!contentPane) return;

    // Remove old markdown-loader
    const oldLoader = this.querySelector('tj-markdown-loader');
    if (oldLoader) oldLoader.remove();

    // Clear content
    contentPane.innerHTML = '';

    // Create a blob URL for the edited content
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const blobUrl = URL.createObjectURL(blob);

    // Create new markdown-loader with blob URL
    const loader = document.createElement('tj-markdown-loader');
    loader.setAttribute('target', 'tj-content-pane');
    loader.setAttribute('src', blobUrl);
    this.appendChild(loader);

    // Revoke blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  /**
   * Load the markdown content for the current demo
   */
  private async _loadMarkdownContent() {
    const currentDemo = this._demos[this._currentIndex];
    if (!currentDemo) return;

    this._isLoadingCode = true;

    try {
      const response = await fetch(currentDemo.src);
      if (response.ok) {
        this._markdownContent = await response.text();
      } else {
        this._markdownContent = `// Error loading ${currentDemo.src}`;
      }
    } catch (error) {
      this._markdownContent = `// Error: ${error}`;
    } finally {
      this._isLoadingCode = false;
    }
  }

  /**
   * Handle code input with debounced live reload
   */
  private _handleCodeInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this._markdownContent = textarea.value;

    // Debounce the reload
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = window.setTimeout(() => {
      this._reloadDemoFromContent(this._markdownContent);

      this.dispatchEvent(
        new CustomEvent('code-change', {
          detail: { content: this._markdownContent },
          bubbles: true,
          composed: true,
        }),
      );
    }, 500);
  }

  private _toggleMenu() {
    this._menuOpen = !this._menuOpen;
  }

  private _toggleCodeView() {
    this._codeViewOpen = !this._codeViewOpen;
    this._menuOpen = false;

    if (this._codeViewOpen && !this._markdownContent) {
      this._loadMarkdownContent();
    }
  }

  override render() {
    const currentDemo = this._demos[this._currentIndex];

    return html`
      <!-- Main Container with Split View -->
      <div class="nte-container ${this._codeViewOpen ? 'nte-split-view' : ''}">
        <!-- Demo Content Area -->
        <div class="nte-demo-content">
          <tj-content-pane></tj-content-pane>
          <tj-markdown-loader target="tj-content-pane" src="${currentDemo?.src || ''}"> </tj-markdown-loader>
        </div>

        <!-- Code Editor Panel -->
        ${this._codeViewOpen
          ? html`
              <div class="nte-code-panel">
                <div class="nte-code-header">
                  <span class="nte-code-title">Markdown Source</span>
                  <span class="nte-code-file">${currentDemo?.src || ''}</span>
                  <button class="nte-code-close" @click="${this._toggleCodeView}" title="Close editor">✕</button>
                </div>
                <textarea
                  class="nte-code-editor"
                  .value="${this._markdownContent}"
                  @input="${this._handleCodeInput}"
                  spellcheck="false"
                  placeholder="${this._isLoadingCode ? 'Loading...' : 'Markdown content'}"
                  ?disabled="${this._isLoadingCode}"
                ></textarea>
              </div>
            `
          : nothing}
      </div>

      <!-- Floating Action Button -->
      <button
        class="nte-fab"
        @click="${this._toggleMenu}"
        title="Switch Demo"
        aria-label="Open demo menu"
        aria-expanded="${this._menuOpen}"
      >
        📋 ${this._demos.length > 0 ? html`<span class="nte-badge">${this._demos.length}</span>` : ''}
      </button>

      <!-- Demo Selection Menu -->
      ${this._menuOpen
        ? html`
            <div class="nte-backdrop" @click="${this._toggleMenu}"></div>
            <nav class="nte-menu" role="menu" aria-label="Demo selection">
              <div class="nte-menu-header">
                <span>Demos</span>
                <button
                  class="nte-code-toggle ${this._codeViewOpen ? 'active' : ''}"
                  @click="${this._toggleCodeView}"
                  title="${this._codeViewOpen ? 'Hide Code' : 'Show Code'}"
                >
                  &lt;/&gt;
                </button>
              </div>
              ${this._demos.map(
                (demo, i) => html`
                  <button
                    class="nte-menu-item ${i === this._currentIndex ? 'active' : ''}"
                    role="menuitem"
                    aria-current="${i === this._currentIndex ? 'true' : 'false'}"
                    @click="${() => this._selectDemo(i)}"
                  >
                    <div class="nte-menu-item-content">
                      <span class="nte-menu-item-title">${demo.title}</span>
                      ${demo.description
                        ? html`<span class="nte-menu-item-description">${demo.description}</span>`
                        : nothing}
                    </div>
                    ${i === this._currentIndex
                      ? html`<span class="nte-menu-item-check" aria-hidden="true">✓</span>`
                      : ''}
                  </button>
                `,
              )}
            </nav>
          `
        : ''}
    `;
  }
}
