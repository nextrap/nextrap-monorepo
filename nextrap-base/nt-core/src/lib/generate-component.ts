import { BreakPointMixinInterface, LoggerMixinInterface, SlotVisibilityInterface } from '@trunkjs/browser-utils';
import { CSSResultGroup, LitElement, PropertyDeclaration, PropertyValues, html } from 'lit';
import { SetDefaultStyleMixinInterface } from './SetDefaultStyleMixin';
import { NteFeatures, nextrap_element } from './nextrap-element';

// `any` is intentional here: the concrete `this` and argument tuple are retained by each inferred map entry.
type AnyFunction = (this: any, ...args: any[]) => unknown; // eslint-disable-line @typescript-eslint/no-explicit-any
type ValueRecord = Record<string, unknown>;
type FunctionRecord = Record<string, AnyFunction>;

export type ComponentAttributeType =
  StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor;

export interface ComponentAttribute<Value = unknown> {
  type?: ComponentAttributeType;
  initial?: Value;
  attribute?: string | boolean;
  reflect?: boolean;
  useDefault?: boolean;
  parse?: (value: string | null) => Value;
  serialize?: (value: Value) => unknown;
  hasChanged?: (value: Value, oldValue: Value) => boolean;
}

export type ComponentAttributes = Record<string, ComponentAttribute>;

type InferComponentAttribute<Definition> = Definition extends {
  parse: (value: string | null) => infer Value;
}
  ? Value
  : Definition extends { initial: infer Value }
    ? Value
    : Definition extends { type: StringConstructor }
      ? string
      : Definition extends { type: NumberConstructor }
        ? number
        : Definition extends { type: BooleanConstructor }
          ? boolean
          : Definition extends { type: ArrayConstructor }
            ? unknown[]
            : Definition extends { type: ObjectConstructor }
              ? Record<string, unknown>
              : unknown;

export type ComponentAttributeValues<Definitions extends ComponentAttributes> = {
  -readonly [Key in keyof Definitions]: InferComponentAttribute<Definitions[Key]>;
};

export type ComponentEventTarget = 'host' | 'renderRoot' | 'window' | 'document';

export type ProgrammaticSlotElements = HTMLElement | readonly HTMLElement[];

export type ProgrammaticSlotMap<SlotName extends string> = Partial<Record<SlotName, ProgrammaticSlotElements>>;

export type ProgrammaticLightDom<SlotName extends string> =
  | HTMLElement
  | readonly HTMLElement[]
  | ([SlotName] extends [never]
      ? never
      : ProgrammaticSlotMap<SlotName> | ReadonlyMap<SlotName, ProgrammaticSlotElements>);

export interface GenerateComponentOptions<SlotNames extends readonly string[] = readonly []> {
  /** Custom-element name. When present, the generated class is registered by default. */
  tagName?: `${string}-${string}`;
  /** Set to false to return the class without registering it. */
  register?: boolean;
  /** The existing Nextrap/TrunkJS feature mixins used as the generated class base. */
  features?: NteFeatures;
  /** Functional Shadow DOM styles, as a Lit css result or result array. */
  styles?: CSSResultGroup;
  /** Named slots accepted by the typed programmatic Light DOM API. */
  slots?: SlotNames;
}

type NextrapElementInstance = LitElement &
  LoggerMixinInterface &
  SlotVisibilityInterface &
  BreakPointMixinInterface &
  SetDefaultStyleMixinInterface;

type BoundFunctions<Functions extends FunctionRecord> = {
  readonly [Key in keyof Functions]: (...args: Parameters<Functions[Key]>) => ReturnType<Functions[Key]>;
};

export type GeneratedComponentPublicInstance<
  Options extends ValueRecord,
  Attributes extends ValueRecord,
  Methods extends FunctionRecord,
> = NextrapElementInstance & Readonly<Options> & Attributes & Methods;

type GeneratedComponentInternalInstance<
  Options extends ValueRecord,
  Attributes extends ValueRecord,
  State extends ValueRecord,
  Functions extends FunctionRecord,
  Methods extends FunctionRecord,
> = GeneratedComponentPublicInstance<Options, Attributes, Methods> &
  State & {
    $call<Key extends keyof Functions>(name: Key, ...args: Parameters<Functions[Key]>): ReturnType<Functions[Key]>;
  };

export interface ComponentRenderContext<
  Host,
  Options extends ValueRecord,
  Attributes extends ValueRecord,
  State extends ValueRecord,
  Functions extends FunctionRecord,
> {
  readonly $host: Host;
  readonly $options: Readonly<Options>;
  readonly $attributes: Readonly<Attributes>;
  readonly $state: Readonly<State>;
  readonly $fn: BoundFunctions<Functions>;
}

export interface ComponentLifecycle<Host> {
  connected?(this: Host): void;
  disconnected?(this: Host): void;
  adopted?(this: Host): void;
  attributeChanged?(this: Host, name: string, oldValue: string | null, newValue: string | null): void;
  shouldUpdate?(this: Host, changedProperties: PropertyValues): boolean;
  willUpdate?(this: Host, changedProperties: PropertyValues): void;
  firstRender?(this: Host, changedProperties: PropertyValues): void;
  updated?(this: Host, changedProperties: PropertyValues): void;
}

export interface ComponentEventBinding<Host, Functions extends FunctionRecord> {
  type: string;
  target?: ComponentEventTarget;
  handler: Extract<keyof Functions, string> | ((this: Host, event: Event) => unknown);
  options?: AddEventListenerOptions | boolean;
}

export interface ComponentDefinition<
  Options extends ValueRecord,
  AttributeDefinitions extends ComponentAttributes,
  State extends ValueRecord,
  Functions extends FunctionRecord,
  Methods extends FunctionRecord,
> {
  /** Constructor-only values. Keys become readonly properties on the public instance type. */
  $options?: Options;
  /** Lit reactive properties with optional HTML attribute conversion. */
  $attributes?: AttributeDefinitions & ComponentAttributes;
  /** Internal Lit reactive state. State keys are intentionally hidden from the public instance type. */
  $state?: State;
  /** Internal callbacks. Lit event bindings receive stable, instance-bound wrappers. */
  $fn?: Functions &
    ThisType<
      GeneratedComponentInternalInstance<
        Options,
        ComponentAttributeValues<AttributeDefinitions>,
        State,
        Functions,
        Methods
      >
    >;
  /** Methods intentionally exposed on instances created from the returned class. */
  $methods?: Methods &
    ThisType<
      GeneratedComponentInternalInstance<
        Options,
        ComponentAttributeValues<AttributeDefinitions>,
        State,
        Functions,
        Methods
      >
    >;
  $events?: readonly ComponentEventBinding<
    GeneratedComponentInternalInstance<
      Options,
      ComponentAttributeValues<AttributeDefinitions>,
      State,
      Functions,
      Methods
    >,
    Functions
  >[];
  $lifecycle?: ComponentLifecycle<
    GeneratedComponentInternalInstance<
      Options,
      ComponentAttributeValues<AttributeDefinitions>,
      State,
      Functions,
      Methods
    >
  >;
  $template?: (
    this: GeneratedComponentInternalInstance<
      Options,
      ComponentAttributeValues<AttributeDefinitions>,
      State,
      Functions,
      Methods
    >,
    context: ComponentRenderContext<
      GeneratedComponentInternalInstance<
        Options,
        ComponentAttributeValues<AttributeDefinitions>,
        State,
        Functions,
        Methods
      >,
      Options,
      ComponentAttributeValues<AttributeDefinitions>,
      State,
      Functions
    >,
  ) => unknown;
}

export type ComponentConstructorInput<
  Options extends ValueRecord,
  Attributes extends ValueRecord,
  SlotName extends string = never,
> = Partial<Options & Attributes> & {
  $slots?: ProgrammaticLightDom<SlotName>;
};

export type GeneratedComponentConstructor<
  Options extends ValueRecord,
  Attributes extends ValueRecord,
  Methods extends FunctionRecord,
  SlotName extends string = never,
> = {
  new (
    input?: ComponentConstructorInput<Options, Attributes, SlotName>,
    ...lightDom: ProgrammaticLightDom<SlotName>[]
  ): GeneratedComponentPublicInstance<Options, Attributes, Methods>;
  readonly prototype: GeneratedComponentPublicInstance<Options, Attributes, Methods>;
  readonly slotNames: readonly SlotName[];
} & Omit<typeof LitElement, 'prototype'>;

function cloneInitialValue<Value>(value: Value): Value {
  if (Array.isArray(value)) {
    return [...value] as Value;
  }
  if (typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype) {
    return { ...value } as Value;
  }
  return value;
}

function propertyDeclaration(definition: ComponentAttribute): PropertyDeclaration {
  return {
    attribute: definition.attribute,
    type: definition.type,
    reflect: definition.reflect,
    useDefault: definition.useDefault,
    hasChanged: definition.hasChanged,
    converter:
      definition.parse !== undefined || definition.serialize !== undefined
        ? {
            fromAttribute: definition.parse,
            toAttribute: definition.serialize,
          }
        : undefined,
  };
}

function appendElements(host: HTMLElement, elements: ProgrammaticSlotElements, slotName?: string): void {
  const entries = Array.isArray(elements) ? elements : [elements];
  for (const element of entries) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('Programmatic Light DOM only accepts HTMLElement instances');
    }
    if (slotName !== undefined) {
      element.slot = slotName;
    }
    host.append(element);
  }
}

function appendLightDom<SlotName extends string>(
  host: HTMLElement,
  lightDom: ProgrammaticLightDom<SlotName>,
  availableSlotNames: ReadonlySet<string>,
): void {
  if (lightDom instanceof HTMLElement || Array.isArray(lightDom)) {
    appendElements(host, lightDom);
    return;
  }
  if (typeof lightDom !== 'object' || lightDom === null) {
    throw new TypeError('Programmatic Light DOM only accepts HTMLElement instances or slot maps');
  }

  const entries = lightDom instanceof Map ? lightDom.entries() : Object.entries(lightDom);
  for (const [slotName, elements] of entries) {
    if (!availableSlotNames.has(slotName)) {
      throw new Error(`Unknown programmatic slot: ${slotName}`);
    }
    if (elements !== undefined) {
      appendElements(host, elements, slotName);
    }
  }
}

function resolveEventTarget(host: LitElement, target: ComponentEventTarget = 'host'): EventTarget {
  switch (target) {
    case 'window':
      return window;
    case 'document':
      return document;
    case 'renderRoot':
      return host.renderRoot;
    default:
      return host;
  }
}

/**
 * Generates a concrete, newable Lit class from a typed object definition.
 *
 * The returned constructor deliberately exposes attributes, constructor options, and `$methods`,
 * while `$state`, `$fn`, and `$call` remain internal to the definition's contextual `this` type.
 */
export function generate_component<
  const SlotNames extends readonly string[] = readonly [],
  Options extends ValueRecord = Record<never, never>,
  AttributeDefinitions extends ComponentAttributes = Record<never, never>,
  State extends ValueRecord = Record<never, never>,
  Functions extends FunctionRecord = Record<never, never>,
  Methods extends FunctionRecord = Record<never, never>,
>(
  options: GenerateComponentOptions<SlotNames>,
  definition: ComponentDefinition<Options, AttributeDefinitions, State, Functions, Methods>,
): GeneratedComponentConstructor<Options, ComponentAttributeValues<AttributeDefinitions>, Methods, SlotNames[number]> {
  type Attributes = ComponentAttributeValues<AttributeDefinitions>;
  type InternalHost = GeneratedComponentInternalInstance<Options, Attributes, State, Functions, Methods>;

  const Base = nextrap_element(options.features);
  const optionDefaults = definition.$options ?? ({} as Options);
  const attributeDefinitions = definition.$attributes ?? ({} as AttributeDefinitions);
  const stateDefaults = definition.$state ?? ({} as State);
  const functions = definition.$fn ?? ({} as Functions);
  const methods = definition.$methods ?? ({} as Methods);
  const lifecycle = definition.$lifecycle;
  const configuredEvents = definition.$events ?? [];
  const slotNames = options.slots ?? ([] as unknown as SlotNames);
  const availableSlotNames = new Set<string>(slotNames);
  const reactiveProperties: Record<string, PropertyDeclaration> = {};
  const baseAdoptedCallback = (Base.prototype as unknown as { adoptedCallback?: (this: LitElement) => void })
    .adoptedCallback;

  const configuredKeyOwners = new Map<string, string>();
  for (const [owner, keys] of [
    ['$options', Object.keys(optionDefaults)],
    ['$attributes', Object.keys(attributeDefinitions)],
    ['$state', Object.keys(stateDefaults)],
    ['$methods', Object.keys(methods)],
  ] as const) {
    for (const key of keys) {
      const previousOwner = configuredKeyOwners.get(key);
      if (previousOwner !== undefined) {
        throw new Error(`Generated component key "${key}" is declared in both ${previousOwner} and ${owner}`);
      }
      configuredKeyOwners.set(key, owner);
    }
  }

  for (const [name, attribute] of Object.entries(attributeDefinitions)) {
    reactiveProperties[name] = propertyDeclaration(attribute);
  }
  for (const name of Object.keys(stateDefaults)) {
    reactiveProperties[name] = { state: true, attribute: false };
  }

  class GeneratedComponent extends Base {
    static override properties = reactiveProperties;
    static override styles = options.styles ?? [];
    static readonly slotNames = slotNames;

    readonly #boundFunctions: BoundFunctions<Functions>;
    readonly #renderContext: ComponentRenderContext<InternalHost, Options, Attributes, State, Functions>;
    #eventCleanups: (() => void)[] = [];

    constructor(
      input: ComponentConstructorInput<Options, Attributes, SlotNames[number]> = {},
      ...lightDom: ProgrammaticLightDom<SlotNames[number]>[]
    ) {
      super();

      const inputValues = input as Record<string, unknown>;
      for (const [name, value] of Object.entries(optionDefaults)) {
        const configuredValue = Object.prototype.hasOwnProperty.call(inputValues, name) ? inputValues[name] : value;
        Object.defineProperty(this, name, {
          configurable: false,
          enumerable: true,
          writable: false,
          value: cloneInitialValue(configuredValue),
        });
      }
      for (const [name, attribute] of Object.entries(attributeDefinitions)) {
        if (Object.prototype.hasOwnProperty.call(inputValues, name)) {
          (this as unknown as Record<string, unknown>)[name] = inputValues[name];
        } else if ('initial' in attribute) {
          (this as unknown as Record<string, unknown>)[name] = cloneInitialValue(attribute.initial);
        }
      }
      for (const [name, value] of Object.entries(stateDefaults)) {
        (this as unknown as Record<string, unknown>)[name] = cloneInitialValue(value);
      }

      this.#boundFunctions = Object.fromEntries(
        Object.keys(functions).map((name) => [name, (...args: unknown[]) => this.$call(name, ...args)]),
      ) as unknown as BoundFunctions<Functions>;
      this.#renderContext = Object.freeze({
        $host: this as unknown as InternalHost,
        $options: this as unknown as Readonly<Options>,
        $attributes: this as unknown as Readonly<Attributes>,
        $state: this as unknown as Readonly<State>,
        $fn: this.#boundFunctions,
      });

      if (input.$slots !== undefined) {
        appendLightDom(this, input.$slots, availableSlotNames);
      }
      for (const child of lightDom) {
        appendLightDom(this, child, availableSlotNames);
      }
    }

    $call(name: string, ...args: unknown[]): unknown {
      const callback = functions[name];
      if (callback === undefined) {
        throw new Error(`Unknown generated component callback: ${name}`);
      }
      return callback.apply(this, args);
    }

    override connectedCallback(): void {
      super.connectedCallback();
      this.#bindConfiguredEvents();
      lifecycle?.connected?.call(this as unknown as InternalHost);
    }

    override disconnectedCallback(): void {
      for (const cleanup of this.#eventCleanups.splice(0)) {
        cleanup();
      }
      lifecycle?.disconnected?.call(this as unknown as InternalHost);
      super.disconnectedCallback();
    }

    adoptedCallback(): void {
      baseAdoptedCallback?.call(this);
      lifecycle?.adopted?.call(this as unknown as InternalHost);
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      lifecycle?.attributeChanged?.call(this as unknown as InternalHost, name, oldValue, newValue);
    }

    override shouldUpdate(changedProperties: PropertyValues): boolean {
      const parentAllowsUpdate = super.shouldUpdate(changedProperties);
      const definitionAllowsUpdate = lifecycle?.shouldUpdate?.call(this as unknown as InternalHost, changedProperties);
      return parentAllowsUpdate && definitionAllowsUpdate !== false;
    }

    override willUpdate(changedProperties: PropertyValues): void {
      super.willUpdate(changedProperties);
      lifecycle?.willUpdate?.call(this as unknown as InternalHost, changedProperties);
    }

    override firstUpdated(changedProperties: PropertyValues): void {
      super.firstUpdated(changedProperties);
      lifecycle?.firstRender?.call(this as unknown as InternalHost, changedProperties);
    }

    override updated(changedProperties: PropertyValues): void {
      super.updated(changedProperties);
      lifecycle?.updated?.call(this as unknown as InternalHost, changedProperties);
    }

    protected override render(): unknown {
      return definition.$template?.call(this as unknown as InternalHost, this.#renderContext) ?? html`<slot></slot>`;
    }

    #bindConfiguredEvents(): void {
      if (this.#eventCleanups.length > 0) {
        return;
      }
      for (const event of configuredEvents) {
        const target = resolveEventTarget(this, event.target);
        const handler = event.handler;
        const listener: EventListener =
          typeof handler === 'function'
            ? (domEvent) => handler.call(this as unknown as InternalHost, domEvent)
            : (domEvent) => this.$call(handler, domEvent);
        target.addEventListener(event.type, listener, event.options);
        this.#eventCleanups.push(() => target.removeEventListener(event.type, listener, event.options));
      }
    }
  }

  for (const [name, method] of Object.entries(methods)) {
    if (name.startsWith('$') || name in GeneratedComponent.prototype) {
      throw new Error(`Generated public method conflicts with a reserved member: ${name}`);
    }
    Object.defineProperty(GeneratedComponent.prototype, name, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: method,
    });
  }

  if (options.tagName !== undefined && options.register !== false && typeof customElements !== 'undefined') {
    const existing = customElements.get(options.tagName);
    if (existing !== undefined && existing !== GeneratedComponent) {
      throw new Error(`Custom element is already registered: ${options.tagName}`);
    }
    if (existing === undefined) {
      customElements.define(options.tagName, GeneratedComponent as unknown as CustomElementConstructor);
    }
  }

  return GeneratedComponent as unknown as GeneratedComponentConstructor<
    Options,
    Attributes,
    Methods,
    SlotNames[number]
  >;
}
