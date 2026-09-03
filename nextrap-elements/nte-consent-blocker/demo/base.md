---
{: layout="1;.container.prose" }

# nte-consent-blocker component

## Google Maps Mode (kompakte Verwendung)

Die kompakte Variante setzt nur den Consent-Inhalt. Ohne weitere Angaben ergänzt der Blocker automatisch die Maps-
Vorschau und den Standard-Consent-Hinweis.

---
{: layout="nte-consent-blocker" style="--default-template-selector: #google-maps-template;"}

## Globale Vorlagen für kurze Content-Blöcke

Die folgenden Templates können einmal zentral im Theme oder Seitenrahmen liegen. Werden die drei Selector-Variablen dort
auf `nte-consent-blocker` gesetzt, lassen sich beliebig viele Elemente im Content ohne dupliziertes Background-, Hinweis-
oder Embed-Markup platzieren. Individuelle direkte Templates und Slot-Inhalte bleiben möglich und haben Vorrang.

<!-- Das inerte Quell-Template bleibt für mehrere Consent Blocker wiederverwendbar. -->
<template id="google-maps-template">
    <iframe title="Eiffelturm auf Google Maps" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"></iframe>
</template>

<template id="google-maps-background">
    <img loading="lazy" fetchpriority="low" alt="Eiffelturm – Karte noch nicht geladen" src="https://cdn.leuffen.de/hyperpage-components/v1.0/google-maps/maps-preview.jpg">
</template>

<template id="google-maps-pre-consent">
    <button class="btn btn-primary" data-action="consent">Karte laden</button>
    <p>Mit Klick auf Karte laden werden externe Google-Maps-Inhalte geladen.</p>
</template>

<style>
    /* Für eine globale Anwendung kann der Klassen-Selektor im Theme durch den nackten Element-Selektor ersetzt werden. */
    nte-consent-blocker.maps-global {
        --default-template-selector: #google-maps-template;
        --default-background-selector: #google-maps-background;
        --default-pre-consent-selector: #google-maps-pre-consent;
    }
</style>

---
{: layout="nte-consent-blocker.maps-global"}

## Vollständige deklarative Variante (nur Referenz)

---
{: layout="nte-consent-blocker"}

![Map preview](https://cdn.leuffen.de/hyperpage-components/v1.0/google-maps/maps-preview.jpg)

<template>
    <iframe title="Eiffelturm auf Google Maps" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"></iframe>
</template>

<button class="btn btn-primary" data-action="consent" slot="pre-consent">Karte laden</button>
<p slot="pre-consent">Mit Klick auf Karte laden werden externe Google-Maps-Inhalte geladen.</p>
