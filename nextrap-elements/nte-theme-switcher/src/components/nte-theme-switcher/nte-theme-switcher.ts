import { resetStyle } from '@nextrap/style-reset';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './nte-theme-switcher.scss?inline';
/**
 * Theme Switcher component that sets a theme class on the body element
 * and syncs the selected theme with URL parameters.
 *
 * @element nte-theme-switcher
 *
 * @property {string} themes - Comma-separated list of available theme names
 */
@customElement('nte-theme-switcher')
export class NteThemeSwitcherElement extends LitElement {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  /**
   * Space-separated list of available theme names
   */
  @property({ type: String })
  public themes = '';

  /**
   * The target element to apply the theme class to (default: 'html', can be set to 'body' if needed)
   */
  @property({ type: String, reflect: true })
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
    this._removeThemeClass();
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
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  /**
   * Read theme from URL parameter `?theme=XYZ`
   */
  private _readThemeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme');
    if (urlTheme && (this._themeList.includes(urlTheme))) {
      this._activeTheme = urlTheme;
    } else {
      this._activeTheme = this._themeList[0] || 'default';
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
   * Apply the theme class to the body element
   */
  private _applyTheme() {
    this._removeThemeClass();

    if (this._activeTheme !== 'default') {
      document.querySelector(this.target)?.classList.add(`${this._activeTheme}`) || console.log(`Target element "${this.target}" not found for theme application.`);
    }
  }

  /**
   * Remove all theme classes from the body element (cleanup)
   */
  private _removeThemeClass() {
    const allThemeClasses = this._themeList.map((t) => `${t}`);
    document.querySelector(this.target)?.classList.remove(...allThemeClasses);
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
          ${this._themeList.map(
            (theme) => html` <option value="${theme}" ?selected="${theme === this._activeTheme}">${theme}</option> `,
          )}
        </select>
      </div>
    `;
  }
}
