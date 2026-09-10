# NTE Image Demos

Die Beispiele laufen im zentralen Demo-Viewer. Im Repository starten:

```bash
npm run demo
```

Unter **NTE Image** auswählen:

- [Stabile Bildfläche](01-stable-frame.demo.ts): drei Bilder in 16:9, quadratischem Rahmen und festen Abmessungen.
- [Navigation](02-navigation.demo.ts): sichtbare Vor-/Zurück-Buttons, schmaler Rahmen und deaktivierte Pfeile; Konfiguration über CSS-Klasse oder Inline-Style.

Beide Demos verwenden die drei vorgegebenen Leuffen-CDN-Bilder direkt im Markdown. `{: layout="nte-image"}` unmittelbar unter der Bildgruppe erzeugt die Komponente über Content Pane. Feature-Auswahl und Wechselintervall werden über `--nte-image-features` und `--nte-image-interval` gesteuert.

Die vollständige API und Migration stehen in der [Package-README](../README.md).
