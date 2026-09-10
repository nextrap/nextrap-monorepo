// Erzeugt reproduzierbare Bildformate ohne Netzwerkzugriff, damit Lade- und Layouttests stabil bleiben.
function image(width: number, height: number, color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${color}"/><circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 3}" fill="white" opacity=".2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="36" font-family="sans-serif">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Fügt die drei Testbilder nach dem Markdown-Layout als direkte Kinder ein, wie die Komponenten-API es verlangt.
export function attachImages(environment: { queryAll: (selector: string) => readonly Element[] }): void {
  for (const element of environment.queryAll('nte-image')) {
    const fixtures = [
      [1200, 600, '#245a72', 'Querformat 2:1'],
      [400, 900, '#a04938', 'Hochformat'],
      [600, 600, '#536c39', 'Quadrat'],
    ] as const;
    element.replaceChildren(...fixtures.map(([width, height, color, label]) => {
      const img = document.createElement('img');
      img.alt = label;
      img.src = image(width, height, color, label);
      return img;
    }));
  }
}
