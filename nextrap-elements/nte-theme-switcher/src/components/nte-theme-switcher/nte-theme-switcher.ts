import { resetStyle } from '@nextrap/style-reset';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-theme-switcher.scss?inline';
/**
 * Theme Switcher component that sets a `data-theme` attribute on a target element
 * and syncs the selected theme with URL parameters.
 *
 * @element nte-theme-switcher
 *
 * @property {string} themes - Comma-separated list of available theme names
 * @property {string} target - Target element for `data-theme` attribute:
 *   "html" (default), "body", "current" (self), or an element ID
 */
@customElement('nte-theme-switcher')
export class NteThemeSwitcherElement extends LitElement {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  /**
   * Comma-separated list of available theme names
   */
  @property({ type: String })
  public themes = '';

  /**
   * Target element for the data-theme attribute.
   * "html" | "body" | "current" | element ID
   */
  @property({ type: String })
  public target = 'html';

  /**
   * Currently active theme
   */
  @state()
  private _activeTheme = 'default';

  /**
   * Parsed list of available themes
   */
  @state()
  private _themeList: string[] = [];

  override connectedCallback() {
    super.connectedCallback();
    this._parseThemes();
    this._readThemeFromUrl();
    this._applyTheme();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._removeThemeAttribute();
  }

  /**
   * Parse the themes property into an array
   */
  private _parseThemes() {
    if (!this.themes) {
      this._themeList = [];
      return;
    }
    this._themeList = this.themes
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  /**
   * Read theme from URL parameter `?theme=XYZ`
   */
  private _readThemeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme');
    if (urlTheme && (this._themeList.includes(urlTheme) || urlTheme === 'default')) {
      this._activeTheme = urlTheme;
    }
  }

  /**
   * Update URL parameter without page reload
   */
  private _updateUrl() {
    const url = new URL(window.location.href);
    if (this._activeTheme === 'default') {
      url.searchParams.delete('theme');
    } else {
      url.searchParams.set('theme', this._activeTheme);
    }
    window.history.replaceState(null, '', url.toString());
  }

  /**
   * Resolve the target DOM element
   */
  private _getTargetElement(): HTMLElement | null {
    switch (this.target) {
      case 'html':
        return document.documentElement;
      case 'body':
        return document.body;
      case 'current':
        return this;
      default:
        return document.getElementById(this.target);
    }
  }

  /**
   * Apply the data-theme attribute to the target element
   */
  private _applyTheme() {
    const el = this._getTargetElement();
    if (!el) return;

    if (this._activeTheme === 'default') {
      el.removeAttribute('data-theme');
    } else {
      el.setAttribute('data-theme', this._activeTheme);
    }
  }

  /**
   * Remove the data-theme attribute from the target element (cleanup)
   */
  private _removeThemeAttribute() {
    const el = this._getTargetElement();
    if (el) {
      el.removeAttribute('data-theme');
    }
  }

  /**
   * Handle theme selection change
   */
  private _onThemeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this._activeTheme = select.value;
    this._applyTheme();
    this._updateUrl();
  }

  override render() {
    if (this._themeList.length === 0) return nothing;

    return html`
      <div class="switcher">
        <span class="label">Theme:</span>
        <select @change="${this._onThemeChange}" .value="${this._activeTheme}">
          <option value="default">Default / System</option>
          ${this._themeList.map(
            (theme) => html` <option value="${theme}" ?selected="${theme === this._activeTheme}">${theme}</option> `,
          )}
        </select>
      </div>
    `;
  }
}
