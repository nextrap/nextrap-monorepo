// Vor der ersten nte-icon-Instanz kann die Anwendung eine eigene Font-URL setzen.
export const NTE_ICON_CONFIG = {
  bootstrapIconsFontUrl: 'https://cdn.leuffen.de/hyperpage-components/v1.0/fonts/bootstrap-icons.woff2',
};

// Alle Instanzen teilen denselben Font-Eintrag im Dokument.
let registered = false;

// Das Registrieren selbst lädt nichts; CSS löst den Download beim ersten sichtbaren Glyph aus.
export function registerBootstrapIconFont(): void {
  if (registered) return;
  document.fonts.add(new FontFace(
    'bootstrap-icons',
    `url("${NTE_ICON_CONFIG.bootstrapIconsFontUrl}")`,
    { display: 'block' },
  ));
  registered = true;
}
