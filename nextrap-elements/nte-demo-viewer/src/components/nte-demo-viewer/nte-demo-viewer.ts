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

  private _markdownContent = '';

  @state()
  private accessor _isLoadingCode = false;

  private _debounceTimer: number | null = null;
  private _currentBlobUrl: string | null = null;
  private _iframeObservers: Map<HTMLIFrameElement, MutationObserver> = new Map();

  override connectedCallback() {
    super.connectedCallback();
    this._parseDemos();
    this._handleInitialRoute();
    window.addEventListener('popstate', this._handlePopState);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._handlePopState);

    // Cleanup: Revoke blob URL if exists
    if (this._currentBlobUrl) {
      URL.revokeObjectURL(this._currentBlobUrl);
      this._currentBlobUrl = null;
    }

    // Cleanup: Disconnect all MutationObservers
    this._iframeObservers.forEach((observer) => observer.disconnect());
    this._iframeObservers.clear();

    // Cleanup: Clear debounce timer
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
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
   * Extract filename with extension from a path
   */
  private _extractFilename(src: string): string {
    return src.split('/').pop() || '';
  }

  /**
   * Parse <demo> child elements to extract demo configurations
   */
  private _parseDemos() {
    const demoElements = Array.from(this.querySelectorAll('demo'));
    this._demos = demoElements.map((el) => {
      const title = el.getAttribute('title') || 'Untitled Demo';
      const src = el.getAttribute('src') || '';
      return {
        title,
        src,
        description: el.getAttribute('description') || undefined,
        slug: this._extractFilename(src),
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
   * Check if file is HTML based on extension
   */
  private _isHtmlFile(src: string): boolean {
    return src.toLowerCase().endsWith('.html') || src.toLowerCase().endsWith('.htm');
  }

  /**
   * Setup auto-resize for iframe based on content
   */
  private _setupIframeAutoResize(iframe: HTMLIFrameElement) {
    iframe.onload = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const resizeIframe = () => {
            const height = iframeDoc.body.scrollHeight;
            iframe.style.height = height + 'px';
          };

          // Initial resize
          resizeIframe();

          // Observe changes in iframe content
          const observer = new MutationObserver(resizeIframe);
          observer.observe(iframeDoc.body, {
            childList: true,
            subtree: true,
            attributes: true,
          });

          // Store observer for cleanup
          this._iframeObservers.set(iframe, observer);
        }
      } catch (e) {
        // Cross-origin iframe, can't access content
        iframe.style.height = '600px';
      }
    };
  }

  /**
   * Load HTML file in an iframe for proper execution
   */
  private _loadHtmlContent(src: string, container: Element) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '400px';

    this._setupIframeAutoResize(iframe);
    container.appendChild(iframe);
  }

  /**
   * Reload the markdown loader by removing and recreating it
   */
  private _reloadMarkdownLoader() {
    const container = this.querySelector('#demo-content-container');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Create new content pane and loader in Light DOM
    const currentDemo = this._demos[this._currentIndex];
    if (currentDemo) {
      // Check if it's an HTML file
      if (this._isHtmlFile(currentDemo.src)) {
        // Load HTML directly without markdown parser
        this._loadHtmlContent(currentDemo.src, container);
      } else {
        // Use markdown loader for .md files
        const contentPane = document.createElement('tj-content-pane');
        container.appendChild(contentPane);

        const loader = document.createElement('tj-markdown-loader');
        loader.setAttribute('target', 'tj-content-pane');
        loader.setAttribute('src', currentDemo.src);
        container.appendChild(loader);
      }
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
    const container = this.querySelector('#readme-content-container');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Check if README is HTML file
    if (this._isHtmlFile(this.readme)) {
      // Load HTML directly
      this._loadHtmlContent(this.readme, container);
    } else {
      // Use markdown loader for .md files
      const contentPane = document.createElement('tj-content-pane');
      container.appendChild(contentPane);

      const loader = document.createElement('tj-markdown-loader');
      loader.setAttribute('target', 'tj-content-pane');
      loader.setAttribute('src', this.readme);
      container.appendChild(loader);
    }
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
   * Reload demo from edited content (for live editing)
   */
  private _reloadDemoFromContent(content: string) {
    const container = this.querySelector('#demo-content-container');
    if (!container) return;

    const currentDemo = this._demos[this._currentIndex];
    if (!currentDemo) return;

    // Clear container
    container.innerHTML = '';

    // Check if it's HTML or Markdown
    if (this._isHtmlFile(currentDemo.src)) {
      // Revoke previous blob URL if exists
      if (this._currentBlobUrl) {
        URL.revokeObjectURL(this._currentBlobUrl);
        this._currentBlobUrl = null;
      }

      // For HTML: create blob URL and load in iframe
      const blob = new Blob([content], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      this._currentBlobUrl = blobUrl;

      const iframe = document.createElement('iframe');
      iframe.setAttribute('data-demo-iframe', '');
      iframe.src = blobUrl;
      iframe.style.width = '100%';
      iframe.style.border = 'none';
      iframe.style.minHeight = '400px';
      iframe.style.display = 'block';

      this._setupIframeAutoResize(iframe);
      container.appendChild(iframe);
    } else {
      // For Markdown: use markdown-loader with blob URL
      const contentPane = document.createElement('tj-content-pane');
      container.appendChild(contentPane);

      const blob = new Blob([content], { type: 'text/markdown' });
      const blobUrl = URL.createObjectURL(blob);

      const loader = document.createElement('tj-markdown-loader');
      loader.setAttribute('target', 'tj-content-pane');
      loader.setAttribute('src', blobUrl);
      container.appendChild(loader);

      // Revoke blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }
  }

  /**
   * Handle code input with debounced live reload
   */
  private _handleCodeInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    // Update content without triggering re-render
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
    const currentDemo = this._demos[this._currentIndex];

    // Don't allow code editing for HTML files (iframe-based demos)
    if (currentDemo && this._isHtmlFile(currentDemo.src)) {
      return;
    }

    this._codeViewOpen = !this._codeViewOpen;

    if (this._codeViewOpen) {
      this._loadMarkdownContent();
    }
  }

  // ============================================
  // Render Methods
  // ============================================

  private _renderWelcomeScreen() {
    return html`
      <div class="welcome">
        <header class="welcome-header">
          <h1 class="welcome-title">${this.welcomeTitle}</h1>
          ${this.readme
            ? html`
                <button class="readme-link" @click="${this._showReadme}">
                  <span class="readme-icon">📄</span>
                  README.md
                </button>
              `
            : nothing}
        </header>

        <div class="demo-cards">
          ${this._demos.map(
            (demo, i) => html`
              <button class="demo-card" @click="${() => this._selectDemo(i)}">
                <span class="demo-card-index">${i + 1}</span>
                <div class="demo-card-content">
                  <h3 class="demo-card-title">${demo.title}</h3>
                  ${demo.description ? html`<p class="demo-card-description">${demo.description}</p>` : nothing}
                </div>
                <span class="demo-card-arrow">→</span>
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
      <div class="container ${this._codeViewOpen ? 'nte-split-view' : ''}">
        <div class="demo-content" id="demo-content-container">
          <!-- tj-content-pane and tj-markdown-loader will be inserted here dynamically -->
        </div>

        ${this._codeViewOpen && !(currentDemo && this._isHtmlFile(currentDemo.src))
          ? html`
              <div class="code-panel">
                <div class="code-header">
                  <span class="code-title"
                    >${this._isHtmlFile(currentDemo.src) ? 'HTML Source' : 'Markdown Source'}</span
                  >
                  <span class="code-file">${currentDemo.src}</span>
                  <button class="code-close" @click="${this._toggleCodeView}" title="Close editor">✕</button>
                </div>
                <textarea
                  class="code-editor"
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
      <div class="container">
        <div class="demo-content nte-readme-content" id="readme-content-container">
          <!-- tj-content-pane and tj-markdown-loader will be inserted here dynamically -->
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
              class="fab"
              @click="${this._toggleMenu}"
              title="Menu"
              aria-label="Open menu"
              aria-expanded="${this._menuOpen}"
            >
              📋 ${this._demos.length > 0 ? html`<span class="badge">${this._demos.length}</span>` : ''}
            </button>
          `
        : nothing}

      <!-- Menu -->
      ${this._menuOpen
        ? html`
            <div class="backdrop" @click="${this._toggleMenu}"></div>
            <nav class="menu" role="menu" aria-label="Demo selection">
              <div class="menu-header">
                <span>Navigation</span>
                ${this._viewState === 'demo' && !(currentDemo && this._isHtmlFile(currentDemo.src))
                  ? html`
                      <button
                        class="code-toggle ${this._codeViewOpen ? 'active' : ''}"
                        @click="${this._toggleCodeView}"
                        title="${this._codeViewOpen ? 'Hide Code' : 'Show Code'}"
                      >
                        &lt;/&gt;
                      </button>
                    `
                  : nothing}
              </div>

              <!-- Home Button -->
              <button class="menu-item nte-menu-home" role="menuitem" @click="${this._goHome}">
                <div class="menu-item-content">
                  <span class="menu-item-title">🏠 Home</span>
                </div>
              </button>

              <!-- README Link -->
              ${this.readme
                ? html`
                    <button
                      class="menu-item ${this._viewState === 'readme' ? 'active' : ''}"
                      role="menuitem"
                      @click="${this._showReadme}"
                    >
                      <div class="menu-item-content">
                        <span class="menu-item-title">📄 README.md</span>
                      </div>
                      ${this._viewState === 'readme'
                        ? html`<span class="menu-item-check" aria-hidden="true">✓</span>`
                        : ''}
                    </button>
                  `
                : nothing}

              <div class="menu-divider"></div>

              <!-- Demo List -->
              ${this._demos.map(
                (demo, i) => html`
                  <button
                    class="menu-item ${i === this._currentIndex && this._viewState === 'demo' ? 'active' : ''}"
                    role="menuitem"
                    aria-current="${i === this._currentIndex && this._viewState === 'demo' ? 'true' : 'false'}"
                    @click="${() => this._selectDemo(i)}"
                  >
                    <div class="menu-item-content">
                      <span class="menu-item-title">${demo.title}</span>
                      ${demo.description
                        ? html`<span class="menu-item-description">${demo.description}</span>`
                        : nothing}
                    </div>
                    ${i === this._currentIndex && this._viewState === 'demo'
                      ? html`<span class="menu-item-check" aria-hidden="true">✓</span>`
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
