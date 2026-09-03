---
{: layout="1;.container.prose" }

# nte-consent-blocker component

## Google Maps Mode (kompakte Verwendung)

<!-- Die vollständige deklarative Variante ist weiter unten ausschließlich als Referenz dokumentiert. -->

---
{: layout="nte-consent-blocker" style="--default-template-selector: #google-maps-template;"}

## Vollständige deklarative Variante (nur Referenz)

<!-- Das inerte Quell-Template bleibt für mehrere Consent Blocker wiederverwendbar. -->
<template id="google-maps-template">
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"></iframe>
</template>

---
{: layout="nte-consent-blocker" style="--default-template-selector: #google-maps-template;"}

## Google Maps (via CSS-Klasse)

<style>
    /* Verknüpft den Blocker mit dem wiederverwendbaren Template im Dokument. */
    .google-maps-consent {
        --default-template-selector: #google-maps-template;
    }
</style>

---
{: layout="nte-consent-blocker.google-maps-consent"}
