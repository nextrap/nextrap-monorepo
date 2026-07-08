---
name: nextrap-lib-programming
description: Use this skill for programming within the nextrap library project.
---

# Basic Coding

Nextrap is a css,ts webcomponents library project with no dependencies except trunkjs and lit elements.

Dieses Repo ist ein nx monorepo. unter `nextrap-base/` liegen styles und shared utilities, unter `nextrap-layout/` liegen layout webcomponents und unter `nextrap-elements/` liegen die element webcomponents.

Layouts sind webcomponents, die auf Websites zusammen mit trunkjs/content-pane und trunkjs/responsive genutzt werden. Elemente sind webcomponents, die in Layouts oder direkt in APPs genutzt werden.

Die nextrap elemente werden als einzelne packages auf npmjs veröffentlicht. Es darf daher keine direkten urls 
zwischen den packages geben. Diese müssen untereinander über @nextap/package-name importiert werden.

## Basic rules

- Befolge die Regeln des basic-coding Skills.
- Lies so wenig wie möglich andere Packages ein.
- So wenig styling wie nötig: Die Webcomponents sollen später von außen gestyled werden. Daher soll im shadow dom
    nur die nötigsten styles enthalten sein. Es sollten immer parts definiert sein, damit diese von außen gestyled werden können.
- Das default styling erfolgt in den mixins jedes packages, das nachher in den theme importiert wird.


## Ai Usage Info

- Update the .ai-usage-info.md file in the package you are working on. Keep it short.

## Do's

- Erfordert ein Prompt änderungen an mehr als 3 Dateien, frag den User, ob das so gewünscht ist. Gib einen kurzen Abriss, was Du ändern willst.
- Versuche css styling zunächst mit purem CSS (Selektoren) zu machen. Frag nach, wenn du typescript code ändern musst.
- Frag nach, wenn Du andere Packages ändern musst.
- 

## Dont`s

- Ändere keine Dateien außerhalb der `nextrap-base/`, `nextrap-layout/` und `nextrap-elements/` Verzeichnisse außer es wird explizit im Prompt verlangt.
- Füge keine Css Variablen in den shadow dom hinzu ohne vorher den User zu fragen.
- Führe nie Git Befehle dirket aus ohne zu fragen.


