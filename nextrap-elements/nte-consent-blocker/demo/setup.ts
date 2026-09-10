// Stellt die inerten Vorlagen vor dem Content Pane bereit, auch beim direkten Start einer einzelnen Demo.
export const wrapperHtml = `
<template id="google-maps-template">
      <iframe
        title="Eiffelturm auf Google Maps"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"
      ></iframe>
    </template>
    <template id="google-maps-background">
      <img
        loading="lazy"
        fetchpriority="low"
        alt="Eiffelturm – Karte noch nicht geladen"
        src="https://cdn.leuffen.de/hyperpage-components/v1.0/google-maps/maps-preview.jpg"
      />
    </template>
    <template id="google-maps-pre-consent">
      <button class="btn btn-primary" data-action="consent">Karte laden</button>
      <p>Mit Klick auf Karte laden werden externe Google-Maps-Inhalte geladen.</p>
    </template>
<tj-content-pane>{{content}}</tj-content-pane>
`;
