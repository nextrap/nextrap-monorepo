

# ntl-consent-blocker in ntl-2col

Diese Pairing-Demo zeigt `ntl-consent-blocker` in `ntl-2col`: einmal als Aside-Spalte und einmal im `top`-Slot innerhalb des Wrapper-Rahmens.


## Consent Blocker als Aside
{: layout="ntl-2col.default" section-style="--cols: 6;"}

Der Text bleibt in der Main-Spalte. Der Consent Blocker wird über die Klasse `.aside` explizit in die Aside-Spalte gelegt.

Nach dem Klick wird der Inhalt aus dem Template in den freigegebenen Bereich übernommen.

<ntl-consent-blocker class="default aside">
  <template>
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"></iframe>
  </template>
</ntl-consent-blocker>




## Consent Blocker im Top-Slot
{: layout="ntl-2col.default"}

<ntl-consent-blocker class="default top">
  <template>
    <iframe title="Google Maps Eiffel Tower" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999441644419!2d2.292292615674698!3d48.85837307928795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66efcbd9b8b9%3A0x421a5e7c8a9b8c0!2sEiffel%20Tower%20(La%20Tour%20Eiffel)!5e0!3m2!1sen!2sfr!4v1616581234567"></iframe>
  </template>
</ntl-consent-blocker>

### Hauptinhalt darunter

Der Consent Blocker liegt oberhalb von Main und Aside. Der Wrapper-Rahmen von `ntl-2col` umfasst den Top-Bereich mit.


### Aside-Inhalt
{: layout=".aside"}

Die Aside-Spalte bleibt für zusätzliche Informationen frei.


