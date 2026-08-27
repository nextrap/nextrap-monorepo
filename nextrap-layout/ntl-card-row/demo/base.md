# ntl-card-row component
{: layout="1;.container"}

Diese Demo zeigt `ntl-card-row` als responsives Card-Row-Layout. Direkte `section`-Elemente werden automatisch als `nte-card` gerendert. Die Spaltenbreite wird im Desktop-Modus über ein 12-Spalten-Modell gesteuert; mobil werden die Cards untereinander dargestellt.

## Drei Cards mit Header
{: layout="ntl-card-row" cols="3"}

### Row Header
{: slot="header"}

### Col 1
{: layout="nte-card"}

Content 1

### Col 2
{: layout="nte-card.highlight" cols="6"}

Diese Card nutzt die `.highlight` Modifier-Klasse. Einzelne Cards können über `cols` breiter gesetzt werden.

### Col 3
{: layout="nte-card"}

Content 3

### Col 4
{: layout="nte-card"}

Content 4

## Standard ohne explizite Cards
{: layout="ntl-card-row" cols="4"}

### Col 1

Text

### Col 2

Text

### Col 3

Text

## Borderless Cards
{: layout="ntl-card-row.with-borderless-cards" cols="4"}

Diese Variante entfernt Border und Innenabstand aller direkten `nte-card`-Elemente innerhalb der Row.

### Feature 1

Text ohne Card-Rahmen und ohne inneres Padding.

### Feature 2

Text ohne Card-Rahmen und ohne inneres Padding.

### Feature 3

Text ohne Card-Rahmen und ohne inneres Padding.

## Trennerlinien zwischen Cards
{: layout="ntl-card-row.with-item-separators" cols="4"}

Im Desktop-Modus liegt die vertikale Linie als Pseudoelement mittig in der horizontalen Gap. In der Tablet-/Mobile-Ansicht wird daraus eine horizontale Linie mittig in der vertikalen Gap.

### Feature 1

Text

### Feature 2

Text

### Feature 3

Text

## Breite Highlight-Card
{: layout="ntl-card-row" cols="3"}

### Col 1

Text

### Col 2
{: cols="6" .highlight}

Diese Card nimmt im Desktop-Modus sechs von zwölf Spalten ein.

### Col 3

Text
