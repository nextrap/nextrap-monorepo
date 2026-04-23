---
{: layout="1;.container.prose" }

# style-utils demo

## List unstyled style

- Item 1
    - Item 2
- Item 3
- Item 4
- Item 5
{: .list-unstyled }

### list inline style

- Item 1
- Item 2
- Item 3
{: .list-inline }

### list checked style

- Item 1
- Item 2
- Item 3
{: .list-checked }

### list checked variation style

<ul class="list-checked">
    <li class="list-item-removed">Item 1</li>
    <li class="list-item-unavailable">Item 2</li>
    <li>Item 3</li>
</ul>


## Row

### Row with 3 columns

<div class="row g-2 border-1 border-dark">
    <div class="col-4" style="background-color: lightgray; padding: 1rem;">col-4</div>
    <div class="col-4" style="background-color: lightgray; padding: 1rem;">col-4</div>
    <div class="col-4" style="background-color: lightgray; padding: 1rem;">col-4</div>
</div>
<div class="row g-2 border-1 border-dark">
    <div class="col-2" style="background-color: lightgray; padding: 1rem;">col-2</div>
    <div class="col-3" style="background-color: lightgray; padding: 1rem;">col-3</div>
    <div class="col-4" style="background-color: lightgray; padding: 1rem;">col-4</div>
</div>
<div class="row g-2 border-1 border-dark">
    <div class="offset-2 col-3" style="background-color: lightgray; padding: 1rem;">col-2</div>
    <div class="col-3" style="background-color: lightgray; padding: 1rem;">col-3</div>
    <div class="col-3" style="background-color: lightgray; padding: 1rem;">col-4</div>
</div>
