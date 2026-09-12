// Teilt Registrierung und API mit /unstyled; nur dieser SPA-Einstieg lädt die Defaults.
export * from './unstyled';

// Inline-Kompilierung erhält die automatische Einbindung auch im veröffentlichten ESM-Build.
import defaultStyles from './default.scss?inline';

// Ein Stylesheet pro Package und Dokument; /unstyled erreicht diesen Block niemals.
if (typeof document !== 'undefined' && defaultStyles.trim() && !document.getElementById('nextrap-default-nte-scrollspy')) {
  const stylesheet = document.createElement('style');
  stylesheet.id = 'nextrap-default-nte-scrollspy';
  stylesheet.textContent = defaultStyles;
  document.head.appendChild(stylesheet);
}
