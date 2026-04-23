---
{: layout="1;.container.prose" }

# ntl-consent-blocker component

## Google Maps Mode (declarative)

---
{: layout="ntl-consent-blocker"}

![](https://cdn.leuffen.de/hyperpage-components/v1.0/google-maps/maps-preview.jpg)

<template>
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"></iframe>
</template>

<button class="btn btn-primary" data-action="consent" slot="pre-consent">
    Daten von Google laden
</button>

Mit clicke auf Daten von google laden, wird die Karte geladen und die Datenschutzerklärung von Google akzeptiert.
{: slot="pre-consent"}

## Google Maps (with CSS Variables)

---
{: layout="ntl-consent-blocker" style="--default-template: '<iframe src=&amp;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567&amp;>';"}

## Google Maps (via Css Class)

<style>
    .google-maps-consent {
        --default-template: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"></iframe>';
    }
</style>

---
{: layout="ntl-consent-blocker.google-maps-consent"}