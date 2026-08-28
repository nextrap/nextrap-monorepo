# NTE Privacy Consent

Das Element zeigt beim ersten Besuch einen Dialog. **Alle akzeptieren** bleibt immer die primäre Aktion. Über **Einstellungen** lassen sich Dienste einzeln abwählen; `show-reject-all` ergänzt die direkte Ablehnung.

```html
<nte-privacy-consent policy-version="2026-08" show-reject-all>
  <script
    type="text/plain"
    data-consent-service="analytics"
    data-consent-label="Analytics"
    data-src="/analytics.js">
  </script>

  <template data-consent-service="youtube" data-consent-label="YouTube">
    <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Video"></iframe>
  </template>
</nte-privacy-consent>
```

Die Entscheidung liegt standardmäßig versioniert im Local Storage. `storage="session"` begrenzt sie auf die Browsersitzung; `storage="memory"` speichert sie nur bis zum Verlassen der Seite.
