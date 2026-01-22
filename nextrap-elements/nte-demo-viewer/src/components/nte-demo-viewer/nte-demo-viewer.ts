import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@trunkjs/content-pane';
import '@trunkjs/markdown-loader';

/**
 * Demo configuration parsed from <demo> child elements
 */
interface DemoConfig {
  title: string;
  src: string;
  description?: string;
  slug: string;
}

/** View states */
type ViewState = 'welcome' | 'demo' | 'readme';

/**
 * nte-demo-viewer - A component for viewing and switching between demo files
 *
 * @example
 * ```html
 * <nte-demo-viewer readme="/README.md">
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

  /** Path to the component's README.md file */
  @property({ type: String })
  accessor readme: string = '';

  /** Title for the welcome screen */
  @property({ type: String, attribute: 'welcome-title' })
  accessor welcomeTitle: string = 'Component Demos';

  @state()
  private accessor _demos: DemoConfig[] = [];

  @state()
  private accessor _currentIndex = -1; // -1 = welcome screen

  @state()
  private accessor _viewState: ViewState = 'welcome';

  @state()
  private accessor _menuOpen = false;

  @state()
  private accessor _codeViewOpen = false;

  @state()
  private accessor _markdownContent = '';

  @state()
  private accessor _isLoadingCode = false;

  @state()
  private accessor _readmeContent = '';

  private _debounceTimer: number | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this._parseDemos();
    this._handleInitialRoute();
    window.addEventListener('popstate', this._handlePopState);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._handlePopState);
  }

  private _handlePopState = () => {
    this._handleInitialRoute();
  };

  /**
   * Handle initial route from URL hash
   */
  private _handleInitialRoute() {
    const hash = window.location.hash.slice(1); // Remove #

    if (!hash || hash === '') {
      this._viewState = 'welcome';
      this._currentIndex = -1;
      return;
    }

    if (hash === 'readme') {
      this._showReadme();
      return;
    }

    // Find demo by slug
    const demoIndex = this._demos.findIndex((d) => d.slug === hash);
    if (demoIndex >= 0) {
      this._selectDemo(demoIndex, false); // false = don't update URL (already there)
    } else {
      this._viewState = 'welcome';
      this._currentIndex = -1;
    }
  }

  /**
   * Generate URL-safe slug from title
   */
  private _generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[äöüß]/g, (char) => {
        const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Parse <demo> child elements to extract demo configurations
   */
  private _parseDemos() {
    const demoElements = Array.from(this.querySelectorAll('demo'));
    this._demos = demoElements.map((el) => {
      const title = el.getAttribute('title') || 'Untitled Demo';
      return {
        title,
        src: el.getAttribute('src') || '',
        description: el.getAttribute('description') || undefined,
        slug: this._generateSlug(title),
      };
    });
  }

  /**
   * Update URL hash
   */
  private _updateUrl(hash: string) {
    const newUrl = hash ? `#${hash}` : window.location.pathname;
    window.history.pushState(null, '', newUrl);
  }

  /**
   * Select a demo by index and reload the content
   */
  private _selectDemo(index: number, updateUrl = true) {
    if (index < 0 || index >= this._demos.length) return;

    this._currentIndex = index;
    this._viewState = 'demo';
    this._menuOpen = false;
    this._codeViewOpen = false;
    this._markdownContent = '';

    if (updateUrl) {
      this._updateUrl(this._demos[index].slug);
    }

    // Force reload of markdown loader after render
    this.updateComplete.then(() => this._reloadMarkdownLoader());

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
   * Reload the markdown loader by removing and recreating it
   */
  private _reloadMarkdownLoader() {
    const contentPane = this.querySelector('tj-content-pane');
    if (!contentPane) return;

    // Remove old loader
    const oldLoader = this.querySelector('.nte-demo-content tj-markdown-loader');
    if (oldLoader) oldLoader.remove();

    // Clear content
    contentPane.innerHTML = '';

    // Create new loader with current demo src
    const currentDemo = this._demos[this._currentIndex];
    if (currentDemo) {
      const loader = document.createElement('tj-markdown-loader');
      loader.setAttribute('target', 'tj-content-pane');
      loader.setAttribute('src', currentDemo.src);
      contentPane.parentElement?.appendChild(loader);
    }
  }

  /**
   * Show README view
   */
  private _showReadme() {
    if (!this.readme) return;

    this._viewState = 'readme';
    this._currentIndex = -1;
    this._menuOpen = false;
    this._codeViewOpen = false;
    this._updateUrl('readme');

    // Force reload of markdown loader after render
    this.updateComplete.then(() => this._reloadReadmeLoader());
  }

  /**
   * Reload the README markdown loader
   */
  private _reloadReadmeLoader() {
    const contentPane = this.querySelector('.nte-readme-content tj-content-pane');
    if (!contentPane) return;

    // Remove old loader
    const oldLoader = this.querySelector('.nte-readme-content tj-markdown-loader');
    if (oldLoader) oldLoader.remove();

    // Clear content
    contentPane.innerHTML = '';

    // Create new loader
    const loader = document.createElement('tj-markdown-loader');
    loader.setAttribute('target', 'tj-content-pane');
    loader.setAttribute('src', this.readme);
    contentPane.parentElement?.appendChild(loader);
  }

  /**
   * Go back to welcome screen
   */
  private _goHome() {
    this._viewState = 'welcome';
    this._currentIndex = -1;
    this._menuOpen = false;
    this._codeViewOpen = false;
    this._markdownContent = '';
    this._updateUrl('');
  }

  /**
   * Load the markdown content for the current demo (code editor)
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

  // ============================================
  // Render Methods
  // ============================================

  private _renderWelcomeScreen() {
    return html`
      <div class="nte-welcome">
        <header class="nte-welcome-header">
          <h1 class="nte-welcome-title">${this.welcomeTitle}</h1>
          ${this.readme
            ? html`
                <button class="nte-readme-link" @click="${this._showReadme}">
                  <span class="nte-readme-icon">📄</span>
                  README.md
                </button>
              `
            : nothing}
        </header>

        <div class="nte-demo-cards">
          ${this._demos.map(
            (demo, i) => html`
              <button class="nte-demo-card" @click="${() => this._selectDemo(i)}">
                <span class="nte-demo-card-index">${i + 1}</span>
                <div class="nte-demo-card-content">
                  <h3 class="nte-demo-card-title">${demo.title}</h3>
                  ${demo.description ? html`<p class="nte-demo-card-description">${demo.description}</p>` : nothing}
                </div>
                <span class="nte-demo-card-arrow">→</span>
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }

  private _renderDemoView() {
    const currentDemo = this._demos[this._currentIndex];
    if (!currentDemo) return nothing;

    return html`
      <div class="nte-container ${this._codeViewOpen ? 'nte-split-view' : ''}">
        <div class="nte-demo-content">
          <tj-content-pane></tj-content-pane>
          <tj-markdown-loader target="tj-content-pane" src="${currentDemo.src}"></tj-markdown-loader>
        </div>

        ${this._codeViewOpen
          ? html`
              <div class="nte-code-panel">
                <div class="nte-code-header">
                  <span class="nte-code-title">Markdown Source</span>
                  <span class="nte-code-file">${currentDemo.src}</span>
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
    `;
  }

  private _renderReadmeView() {
    return html`
      <div class="nte-container">
        <div class="nte-demo-content nte-readme-content">
          <tj-content-pane></tj-content-pane>
          <tj-markdown-loader target="tj-content-pane" src="${this.readme}"></tj-markdown-loader>
        </div>
      </div>
    `;
  }

  private _renderFabAndMenu() {
    const currentDemo = this._demos[this._currentIndex];
    const isInDemoOrReadme = this._viewState === 'demo' || this._viewState === 'readme';

    return html`
      <!-- Floating Action Button - only show when not on welcome screen -->
      ${isInDemoOrReadme
        ? html`
            <button
              class="nte-fab"
              @click="${this._toggleMenu}"
              title="Menu"
              aria-label="Open menu"
              aria-expanded="${this._menuOpen}"
            >
              📋 ${this._demos.length > 0 ? html`<span class="nte-badge">${this._demos.length}</span>` : ''}
            </button>
          `
        : nothing}

      <!-- Menu -->
      ${this._menuOpen
        ? html`
            <div class="nte-backdrop" @click="${this._toggleMenu}"></div>
            <nav class="nte-menu" role="menu" aria-label="Demo selection">
              <div class="nte-menu-header">
                <span>Navigation</span>
                ${this._viewState === 'demo'
                  ? html`
                      <button
                        class="nte-code-toggle ${this._codeViewOpen ? 'active' : ''}"
                        @click="${this._toggleCodeView}"
                        title="${this._codeViewOpen ? 'Hide Code' : 'Show Code'}"
                      >
                        &lt;/&gt;
                      </button>
                    `
                  : nothing}
              </div>

              <!-- Home Button -->
              <button class="nte-menu-item nte-menu-home" role="menuitem" @click="${this._goHome}">
                <div class="nte-menu-item-content">
                  <span class="nte-menu-item-title">🏠 Home</span>
                </div>
              </button>

              <!-- README Link -->
              ${this.readme
                ? html`
                    <button
                      class="nte-menu-item ${this._viewState === 'readme' ? 'active' : ''}"
                      role="menuitem"
                      @click="${this._showReadme}"
                    >
                      <div class="nte-menu-item-content">
                        <span class="nte-menu-item-title">📄 README.md</span>
                      </div>
                      ${this._viewState === 'readme'
                        ? html`<span class="nte-menu-item-check" aria-hidden="true">✓</span>`
                        : ''}
                    </button>
                  `
                : nothing}

              <div class="nte-menu-divider"></div>

              <!-- Demo List -->
              ${this._demos.map(
                (demo, i) => html`
                  <button
                    class="nte-menu-item ${i === this._currentIndex && this._viewState === 'demo' ? 'active' : ''}"
                    role="menuitem"
                    aria-current="${i === this._currentIndex && this._viewState === 'demo' ? 'true' : 'false'}"
                    @click="${() => this._selectDemo(i)}"
                  >
                    <div class="nte-menu-item-content">
                      <span class="nte-menu-item-title">${demo.title}</span>
                      ${demo.description
                        ? html`<span class="nte-menu-item-description">${demo.description}</span>`
                        : nothing}
                    </div>
                    ${i === this._currentIndex && this._viewState === 'demo'
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

  override render() {
    return html`
      ${this._viewState === 'welcome' ? this._renderWelcomeScreen() : nothing}
      ${this._viewState === 'demo' ? this._renderDemoView() : nothing}
      ${this._viewState === 'readme' ? this._renderReadmeView() : nothing} ${this._renderFabAndMenu()}
    `;
  }
}
