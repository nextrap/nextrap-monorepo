import { css, html } from 'lit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generate_component } from './generate-component';

describe('generate_component', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('creates a typed, newable Lit class with options, attributes, state, callbacks, and methods', async () => {
    const connected = vi.fn();
    const tagName = `nte-generated-${Math.random().toString(36).slice(2)}` as `${string}-${string}`;
    const Counter = generate_component(
      {
        tagName,
        slots: ['actions'],
        styles: css`
          :host {
            display: block;
          }
        `,
      },
      {
        $options: {
          prefix: 'Count',
        },
        $attributes: {
          count: { type: Number, initial: 0, reflect: true },
          label: { type: String, initial: 'Clicks' },
        },
        $state: {
          connectedCount: 0,
        },
        $fn: {
          increment() {
            this.count += 1;
          },
          handleIncrement() {
            this.$call('increment');
          },
        },
        $methods: {
          reset(value = 0) {
            this.count = value;
          },
        },
        $events: [{ type: 'counter-increment', target: 'host', handler: 'handleIncrement' }],
        $lifecycle: {
          connected() {
            this.connectedCount += 1;
            connected();
          },
        },
        $template({ $attributes, $state, $fn }) {
          return html`
            <button @click=${$fn.increment}>
              ${this.prefix}: ${$attributes.label} ${$attributes.count}/${$state.connectedCount}
            </button>
            <slot></slot>
            <slot name="actions"></slot>
          `;
        },
      },
    );

    const action = document.createElement('button');
    action.textContent = 'Reset';
    const defaultContent = document.createElement('p');
    defaultContent.textContent = 'Default content';
    const counter = new Counter({ prefix: 'Total', count: 2, $slots: defaultContent }, { actions: action });
    const inferredCount: number = counter.count;
    const inferredPrefix: string = counter.prefix;
    expect(inferredCount).toBe(2);
    expect(inferredPrefix).toBe('Total');
    const assertPublicType = () => {
      // @ts-expect-error internal state is intentionally absent from the public constructor type
      void counter.connectedCount;
      // @ts-expect-error internal callback dispatch is intentionally absent from the public constructor type
      counter.$call('increment');
    };
    void assertPublicType;

    document.body.append(counter);
    await counter.updateComplete;

    expect(connected).toHaveBeenCalledOnce();
    expect(counter.prefix).toBe('Total');
    expect(counter.count).toBe(2);
    expect(counter.reset).toBeTypeOf('function');
    expect(counter.textContent).toContain('Default content');
    expect(action.slot).toBe('actions');
    expect(counter.shadowRoot?.textContent).toContain('Total: Clicks 2/1');

    counter.dispatchEvent(new Event('counter-increment'));
    await counter.updateComplete;
    expect(counter.count).toBe(3);

    counter.reset(7);
    await counter.updateComplete;
    expect(counter.count).toBe(7);
  });

  it('parses custom HTML attributes and registers the generated constructor', async () => {
    const tagName = `nte-generated-${Math.random().toString(36).slice(2)}` as `${string}-${string}`;
    const Parsed = generate_component(
      { tagName },
      {
        $attributes: {
          values: {
            initial: [] as string[],
            parse: (value) => value?.split(',').map((entry) => entry.trim()) ?? [],
          },
        },
        $template({ $attributes }) {
          return html`${$attributes.values.join('|')}`;
        },
      },
    );

    expect(customElements.get(tagName)).toBe(Parsed);

    const parsed = document.createElement(tagName) as InstanceType<typeof Parsed>;
    parsed.setAttribute('values', 'one, two');
    document.body.append(parsed);
    await parsed.updateComplete;

    expect(parsed.values).toEqual(['one', 'two']);
    expect(parsed.shadowRoot?.textContent).toBe('one|two');
  });

  it('appends individual elements, arrays, object slot maps, and Map slot entries', () => {
    const tagName = `nte-generated-${Math.random().toString(36).slice(2)}` as `${string}-${string}`;
    const Slotted = generate_component(
      { tagName, slots: ['header', 'actions'] },
      {
        $template() {
          return html`<slot name="header"></slot><slot></slot><slot name="actions"></slot>`;
        },
      },
    );

    const direct = document.createElement('main');
    const first = document.createElement('p');
    const second = document.createElement('p');
    const header = document.createElement('h2');
    const mappedHeader = document.createElement('h3');
    const firstAction = document.createElement('button');
    const secondAction = document.createElement('button');
    const map = new Map<'header' | 'actions', HTMLElement>([['header', mappedHeader]]);

    const slotted = new Slotted(
      { $slots: direct },
      [first, second],
      { header, actions: [firstAction, secondAction] },
      map,
    );

    const inferredSlotNames: readonly ('header' | 'actions')[] = Slotted.slotNames;
    expect(inferredSlotNames).toEqual(['header', 'actions']);
    expect(Array.from(slotted.children)).toEqual([
      direct,
      first,
      second,
      header,
      firstAction,
      secondAction,
      mappedHeader,
    ]);
    expect(direct.slot).toBe('');
    expect(first.slot).toBe('');
    expect(second.slot).toBe('');
    expect(header.slot).toBe('header');
    expect(mappedHeader.slot).toBe('header');
    expect(firstAction.slot).toBe('actions');
    expect(secondAction.slot).toBe('actions');

    const assertSlotTypes = () => {
      // @ts-expect-error strings are not valid programmatic Light DOM children
      new Slotted({}, 'text');
      // @ts-expect-error only configured slot names are accepted as map keys
      new Slotted({}, { footer: document.createElement('footer') });
    };
    void assertSlotTypes;
  });

  it('rejects invalid Light DOM values and unknown slot names at runtime', () => {
    const tagName = `nte-generated-${Math.random().toString(36).slice(2)}` as `${string}-${string}`;
    const Slotted = generate_component({ tagName, slots: ['content'] }, {});

    expect(() => new Slotted({}, 'text' as never)).toThrow(TypeError);
    expect(() => new Slotted({}, { footer: document.createElement('footer') } as never)).toThrow(
      'Unknown programmatic slot: footer',
    );
  });
});
