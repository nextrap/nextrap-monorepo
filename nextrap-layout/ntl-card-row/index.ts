// Teilt Registrierung und API mit /unstyled; nur dieser SPA-Einstieg lädt die Defaults.
export * from './unstyled';
import '@nextrap/nte-card';

// Inline-Kompilierung erhält die automatische Einbindung auch im veröffentlichten ESM-Build.
import defaultStyles from './default.scss?inline';

// Ein Stylesheet pro Package und Dokument; /unstyled erreicht diesen Block niemals.
if (typeof document !== 'undefined' && defaultStyles.trim() && !document.getElementById('nextrap-default-ntl-card-row')) {
  const stylesheet = document.createElement('style');
  stylesheet.id = 'nextrap-default-ntl-card-row';
  stylesheet.textContent = defaultStyles;
  document.head.appendChild(stylesheet);
}
