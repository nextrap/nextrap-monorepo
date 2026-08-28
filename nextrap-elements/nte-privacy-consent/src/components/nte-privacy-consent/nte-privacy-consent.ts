import { nextrap_element } from '@nextrap/nt-core';
import '@nextrap/nte-dialog';
import { resetStyle } from '@nextrap/style-reset';
import { local_storage, session_storage, waitForDomContentLoaded } from '@trunkjs/browser-utils';
import { html, nothing, PropertyValues, unsafeCSS } from 'lit';
import style from './nte-privacy-consent.scss?inline';

export type NtePrivacyConsentStorage = 'local' | 'session' | 'memory';
export type NtePrivacyConsentPrompt = 'auto' | 'manual';

export interface NtePrivacyConsentDecision {
  schema: 1;
  policyVersion: string;
  services: Record<string, boolean>;
  decidedAt: string;
}

export interface NtePrivacyConsentService {
  name: string;
  label: string;
  purpose: string;
  description: string;
  privacyUrl: string;
}

type ConsentRecord = NtePrivacyConsentDecision & Record<string, unknown>;
type ConsentResource = HTMLScriptElement | HTMLTemplateElement;
type ConsentView = 'summary' | 'preferences';

interface DiscoveredService extends NtePrivacyConsentService {
  resources: ConsentResource[];
  invalid: boolean;
}

interface NteDialogApi extends HTMLElement {
  updateComplete: Promise<boolean>;
  showModal(): void;
  close(): Promise<void>;
}

interface ConsentCopy {
  title: string;
  intro: string;
  settings: string;
  acceptAll: string;
  rejectAll: string;
  save: string;
  cancel: string;
  privacy: string;
  noServices: string;
}

const EMPTY_RECORD: ConsentRecord = {
  schema: 1,
  policyVersion: '',
  services: {},
  decidedAt: '',
};

const DE_COPY: ConsentCopy = {
  title: 'Datenschutzeinstellungen',
  intro:
    'Wir verwenden optionale externe Dienste erst nach deiner Zustimmung. Du kannst alle akzeptieren oder deine Auswahl einzeln festlegen.',
  settings: 'Einstellungen',
  acceptAll: 'Alle akzeptieren',
  rejectAll: 'Alle ablehnen',
  save: 'Auswahl speichern',
  cancel: 'Abbrechen',
  privacy: 'Datenschutzinformationen',
  noServices: 'Es wurden keine optionalen Dienste konfiguriert.',
};

const EN_COPY: ConsentCopy = {
  title: 'Privacy settings',
  intro:
    'We only use optional external services after your consent. You can accept all services or choose them individually.',
  settings: 'Settings',
  acceptAll: 'Accept all',
  rejectAll: 'Reject all',
  save: 'Save selection',
  cancel: 'Cancel',
  privacy: 'Privacy information',
  noServices: 'No optional services have been configured.',
};

const EXECUTABLE_ATTRIBUTES = [
  'crossorigin',
  'defer',
  'fetchpriority',
  'integrity',
  'nomodule',
  'nonce',
  'referrerpolicy',
] as const;

export class NtePrivacyConsent extends nextrap_element() {
  static override properties = {
    policyVersion: { type: String, attribute: 'policy-version', reflect: true },
    storage: { type: String, reflect: true },
    storageKey: { type: String, attribute: 'storage-key', reflect: true },
    prompt: { type: String, reflect: true },
    showRejectAll: { type: Boolean, attribute: 'show-reject-all', reflect: true },
    _services: { state: true },
    _view: { state: true },
    _draft: { state: true },
    _decision: { state: true },
  };

  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  policyVersion = '';
  storage: NtePrivacyConsentStorage = 'local';
  storageKey = 'nte-privacy-consent';
  prompt: NtePrivacyConsentPrompt = 'auto';
  showRejectAll = false;

  private _services: DiscoveredService[] = [];
  private _view: ConsentView = 'summary';
  private _draft: Record<string, boolean> = {};
  private _decision: NtePrivacyConsentDecision | null = null;
  private _initialized = false;
  private _store: ConsentRecord | null = null;
  private _memoryRecord: ConsentRecord = { ...EMPTY_RECORD, services: {} };
  private readonly _generatedNodes = new WeakMap<ConsentResource, Node[]>();
  private readonly _observer = new MutationObserver(() => void this.declarationsChanged());
  private readonly _onStorage = (event: StorageEvent) => void this.storageChanged(event);

  override connectedCallback(): void {
    super.connectedCallback();
    this._observer.observe(this, { childList: true, subtree: true });
    window.addEventListener('storage', this._onStorage);
    void this.initialize();
  }

  override disconnectedCallback(): void {
    this._observer.disconnect();
    window.removeEventListener('storage', this._onStorage);
    super.disconnectedCallback();
  }

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (!this._initialized) return;
    if (
      changedProperties.has('policyVersion') ||
      changedProperties.has('storage') ||
      changedProperties.has('storageKey')
    ) {
      this._store = null;
      void this.applyStoredDecision();
    }
  }

  override render() {
    const copy = this.copy;
    const hasDecision = this._decision !== null;

    return html`
      <nte-dialog
        id="dialog"
        class="style-default size-md"
        exportparts="dialog,header,content,footer"
        .noDismiss=${!hasDecision}
        .hideCloseButton=${true}
        .backdropAction=${'ignore'}
      >
        <slot name="launcher" slot="launcher" @click=${this.openPreferences}></slot>
        <span slot="title" part="title"><slot name="title">${copy.title}</slot></span>

        <div id="body" part="body">
          ${
            this._view === 'summary'
              ? html`<p id="intro" part="intro"><slot name="intro">${copy.intro}</slot></p>`
              : this.renderServices(copy)
          }
        </div>

        <div id="footer-content" slot="footer">
          <slot name="privacy-link"></slot>
          <slot name="footer"></slot>
          <div id="actions" part="actions">${this.renderActions(copy, hasDecision)}</div>
        </div>
      </nte-dialog>
    `;
  }

  show(): void {
    this._view = this._decision ? 'preferences' : 'summary';
    this.dialog?.showModal();
  }

  showPreferences(): void {
    this.openPreferences();
    this.dialog?.showModal();
  }

  hide(): void {
    void this.dialog?.close();
  }

  getDecision(): NtePrivacyConsentDecision | null {
    return this._decision ? this.cloneDecision(this._decision) : null;
  }

  async setDecision(services: Record<string, boolean>): Promise<void> {
    const normalized = Object.fromEntries(
      this._services.map((service) => [service.name, services[service.name] === true]),
    );
    await this.commitDecision(normalized);
  }

  async reset(): Promise<void> {
    const previous = this.getDecision();
    const empty = { ...EMPTY_RECORD, services: {} };
    this.writeRecord(empty);
    this._decision = null;
    this._view = 'summary';
    this._draft = this.allServices(true);
    this.removeGeneratedTemplates();
    this.dispatchConsentChange(previous, null);
    await this.updateComplete;
    this.dialog?.showModal();
  }

  private get dialog(): NteDialogApi | null {
    return this.renderRoot.querySelector<NteDialogApi>('#dialog');
  }

  private get copy(): ConsentCopy {
    const language = (this.lang || document.documentElement.lang || 'de').toLowerCase();
    return language.startsWith('de') ? DE_COPY : EN_COPY;
  }

  private async initialize(): Promise<void> {
    await waitForDomContentLoaded();
    this.discoverDeclarations();
    if (!this.policyVersion) {
      this.dispatchConsentError('discovery', null, new Error('policy-version is required.'));
    }
    await customElements.whenDefined('nte-dialog');
    await this.updateComplete;
    await this.dialog?.updateComplete;
    this._initialized = true;
    await this.applyStoredDecision();
  }

  private async applyStoredDecision(): Promise<void> {
    const decision = this.readValidDecision();
    this._decision = decision;
    this._draft = decision ? this.draftFromDecision(decision) : this.allServices(true);

    if (decision) {
      await this.activateAllowedServices(decision);
    } else if (this.prompt === 'auto') {
      await this.updateComplete;
      this._view = 'summary';
      this.dialog?.showModal();
    }

    this.dispatchEvent(
      new CustomEvent('consent-ready', {
        detail: { decision: this.getDecision() },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private async declarationsChanged(): Promise<void> {
    const oldResources = new Set(this._services.flatMap((service) => service.resources));
    this.discoverDeclarations();
    const hasNewResources = this._services.some((service) =>
      service.resources.some((resource) => !oldResources.has(resource)),
    );
    if (!hasNewResources) return;

    this._draft = this._decision ? this.draftFromDecision(this._decision) : this.allServices(true);
    if (this._decision) await this.activateAllowedServices(this._decision);
  }

  private discoverDeclarations(): void {
    const services = new Map<string, DiscoveredService>();

    for (const child of Array.from(this.children)) {
      if (child instanceof HTMLScriptElement || child instanceof HTMLTemplateElement) {
        const name = child.dataset['consentService'];
        if (name) this.addDeclaration(services, name, child, child);
        continue;
      }

      if (child.localName !== 'nte-privacy-consent-service') continue;
      const name = child.getAttribute('name')?.trim();
      if (!name) continue;
      for (const resource of Array.from(child.children)) {
        if (resource instanceof HTMLScriptElement || resource instanceof HTMLTemplateElement) {
          this.addDeclaration(services, name, resource, child as HTMLElement);
        }
      }
    }

    this._services = Array.from(services.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  private addDeclaration(
    services: Map<string, DiscoveredService>,
    name: string,
    resource: ConsentResource,
    metadataElement: HTMLElement,
  ): void {
    if (resource instanceof HTMLScriptElement && resource.type !== 'text/plain') {
      this.dispatchConsentError('discovery', name, new Error('Consent scripts must use type="text/plain".'));
      return;
    }

    const metadata = this.readMetadata(name, metadataElement);
    const existing = services.get(name);
    if (!existing) {
      services.set(name, { ...metadata, label: metadata.label || name, resources: [resource], invalid: false });
      return;
    }

    for (const key of ['label', 'purpose', 'description', 'privacyUrl'] as const) {
      const incoming = metadata[key];
      if (!incoming) continue;
      if (existing[key] && existing[key] !== incoming) {
        existing.invalid = true;
        this.dispatchConsentError('discovery', name, new Error(`Conflicting ${key} metadata for service "${name}".`));
      } else {
        existing[key] = incoming;
      }
    }
    existing.resources.push(resource);
  }

  private readMetadata(name: string, element: HTMLElement): NtePrivacyConsentService {
    const wrapper = element.localName === 'nte-privacy-consent-service';
    const read = (dataName: string, attributeName: string) =>
      wrapper
        ? element.getAttribute(attributeName)?.trim() || ''
        : element.getAttribute(`data-consent-${dataName}`)?.trim() || '';

    return {
      name,
      label: read('label', 'label'),
      purpose: read('purpose', 'purpose'),
      description: read('description', 'description'),
      privacyUrl: read('privacy', 'privacy-url'),
    };
  }

  private renderServices(copy: ConsentCopy) {
    if (this._services.length === 0) return html`<p>${copy.noServices}</p>`;

    return html`
      <ul id="services" part="services">
        ${this._services.map(
          (service) => html`
            <li class="service" part="service">
              <input
                id=${`service-${service.name}`}
                type="checkbox"
                .checked=${this._draft[service.name] !== false}
                ?disabled=${service.invalid}
                data-service=${service.name}
                @change=${this.serviceSelectionChanged}
              />
              <label class="service-copy" for=${`service-${service.name}`}>
                <strong>${service.label}</strong>
                ${service.purpose ? html`<span class="service-purpose">${service.purpose}</span>` : nothing}
                ${service.description ? html`<span class="service-description">${service.description}</span>` : nothing}
                ${
                  service.privacyUrl
                    ? html`<a
                        class="service-privacy"
                        href=${service.privacyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        >${copy.privacy}</a
                      >`
                    : nothing
                }
              </label>
            </li>
          `,
        )}
      </ul>
    `;
  }

  private renderActions(copy: ConsentCopy, hasDecision: boolean) {
    if (this._view === 'summary') {
      return html`
        ${
          this.showRejectAll
            ? html`<button class="secondary-action" type="button" @click=${this.rejectAll}>${copy.rejectAll}</button>`
            : nothing
        }
        <button class="secondary-action" type="button" @click=${this.openPreferences}>${copy.settings}</button>
        <button id="accept-all" type="button" @click=${this.acceptAll}>${copy.acceptAll}</button>
      `;
    }

    return html`
      ${
        hasDecision
          ? html`<button class="secondary-action" type="button" @click=${this.cancelPreferences}>
              ${copy.cancel}
            </button>`
          : nothing
      }
      <button class="secondary-action" type="button" @click=${this.saveSelection}>${copy.save}</button>
      <button id="accept-all" type="button" @click=${this.acceptAll}>${copy.acceptAll}</button>
    `;
  }

  private readonly serviceSelectionChanged = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const service = input.dataset['service'];
    if (!service) return;
    this._draft = { ...this._draft, [service]: input.checked };
  };

  private readonly openPreferences = () => {
    this._view = 'preferences';
    this._draft = this._decision ? this.draftFromDecision(this._decision) : this.allServices(true);
  };

  private readonly cancelPreferences = () => {
    this._view = 'summary';
    this.hide();
  };

  private readonly acceptAll = () => void this.commitDecision(this.allServices(true));
  private readonly rejectAll = () => void this.commitDecision(this.allServices(false));
  private readonly saveSelection = () => void this.commitDecision(this._draft);

  private allServices(value: boolean): Record<string, boolean> {
    return Object.fromEntries(this._services.map((service) => [service.name, value]));
  }

  private draftFromDecision(decision: NtePrivacyConsentDecision): Record<string, boolean> {
    return Object.fromEntries(
      this._services.map((service) => [service.name, decision.services[service.name] === true]),
    );
  }

  private async commitDecision(services: Record<string, boolean>): Promise<void> {
    if (!this.policyVersion) {
      this.dispatchConsentError('storage', null, new Error('Cannot store consent without policy-version.'));
      return;
    }

    const previous = this.getDecision();
    const decision: NtePrivacyConsentDecision = {
      schema: 1,
      policyVersion: this.policyVersion,
      services: Object.fromEntries(this._services.map((service) => [service.name, services[service.name] === true])),
      decidedAt: new Date().toISOString(),
    };

    this.writeRecord(decision as ConsentRecord);
    this._decision = decision;
    this._draft = { ...decision.services };
    await this.applyDecision(previous, decision);
    this.dispatchConsentChange(previous, decision);
    this._view = 'summary';
    await this.dialog?.close();
  }

  private async applyDecision(
    previous: NtePrivacyConsentDecision | null,
    current: NtePrivacyConsentDecision,
  ): Promise<void> {
    for (const service of this._services) {
      if (current.services[service.name]) {
        await this.activateService(service);
      } else if (previous?.services[service.name]) {
        this.removeGeneratedTemplates(service);
      }
    }
  }

  private async activateAllowedServices(decision: NtePrivacyConsentDecision): Promise<void> {
    for (const service of this._services) {
      if (decision.services[service.name]) await this.activateService(service);
    }
  }

  private async activateService(service: DiscoveredService): Promise<void> {
    if (service.invalid) return;
    const activated: Node[] = [];

    try {
      for (const resource of service.resources) {
        if (resource.dataset['consentActivated'] === 'true') continue;
        const nodes =
          resource instanceof HTMLScriptElement
            ? await this.activateScript(resource, service.name)
            : this.activateTemplate(resource);
        activated.push(...nodes);
        resource.dataset['consentActivated'] = 'true';
      }
    } catch (error) {
      this.dispatchConsentError('activation', service.name, error);
      return;
    }

    if (activated.length > 0) {
      this.dispatchEvent(
        new CustomEvent('consent-service-activated', {
          detail: { service: service.name, elements: activated },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private async activateScript(source: HTMLScriptElement, service: string): Promise<Node[]> {
    const script = document.createElement('script');
    for (const attribute of EXECUTABLE_ATTRIBUTES) {
      if (source.hasAttribute(attribute)) script.setAttribute(attribute, source.getAttribute(attribute) ?? '');
    }

    const executableType = source.dataset['type'];
    if (executableType) script.type = executableType;

    const sourceUrl = source.dataset['src'];
    if (!sourceUrl) {
      script.textContent = source.textContent;
      source.after(script);
      return [script];
    }

    script.src = sourceUrl;
    const isAsync = source.hasAttribute('data-async');
    script.async = isAsync;

    if (isAsync) {
      script.addEventListener('error', () =>
        this.dispatchConsentError('activation', service, new Error(`Failed to load consent script: ${sourceUrl}`)),
      );
      source.after(script);
      return [script];
    }

    await new Promise<void>((resolve, reject) => {
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => reject(new Error(`Failed to load consent script: ${sourceUrl}`)), {
        once: true,
      });
      source.after(script);
    });
    return [script];
  }

  private activateTemplate(template: HTMLTemplateElement): Node[] {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const nodes = Array.from(fragment.childNodes);
    template.after(fragment);
    this._generatedNodes.set(template, nodes);
    return nodes;
  }

  private removeGeneratedTemplates(service?: DiscoveredService): void {
    const services = service ? [service] : this._services;
    for (const current of services) {
      for (const resource of current.resources) {
        if (!(resource instanceof HTMLTemplateElement)) continue;
        for (const node of this._generatedNodes.get(resource) ?? []) node.parentNode?.removeChild(node);
        this._generatedNodes.delete(resource);
        resource.removeAttribute('data-consent-activated');
      }
    }
  }

  private getStore(): ConsentRecord {
    if (this.storage === 'memory') return this._memoryRecord;
    if (this._store) return this._store;

    const initial = { ...EMPTY_RECORD, services: {} };
    this._store =
      this.storage === 'session'
        ? session_storage<ConsentRecord>(this.storageKey, initial)
        : local_storage<ConsentRecord>(this.storageKey, initial);
    return this._store;
  }

  private readValidDecision(): NtePrivacyConsentDecision | null {
    let record: ConsentRecord;
    try {
      record = this.getStore();
      void record.schema;
    } catch (error) {
      this._store = null;
      this.dispatchConsentError('storage', null, error);
      return null;
    }

    if (
      record.schema !== 1 ||
      record.policyVersion !== this.policyVersion ||
      typeof record.decidedAt !== 'string' ||
      record.decidedAt.length === 0 ||
      typeof record.services !== 'object' ||
      record.services === null ||
      Array.isArray(record.services)
    ) {
      return null;
    }

    const services = Object.fromEntries(
      Object.entries(record.services).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
    );
    return {
      schema: 1,
      policyVersion: record.policyVersion,
      services,
      decidedAt: record.decidedAt,
    };
  }

  private writeRecord(record: ConsentRecord): void {
    if (this.storage === 'memory') {
      this._memoryRecord = { ...record, services: { ...record.services } };
      return;
    }

    try {
      const store = this.getStore();
      store.schema = record.schema;
      store.policyVersion = record.policyVersion;
      store.services = { ...record.services };
      store.decidedAt = record.decidedAt;
    } catch (error) {
      this._store = null;
      this._memoryRecord = { ...record, services: { ...record.services } };
      this.dispatchConsentError('storage', null, error);
    }
  }

  private async storageChanged(event: StorageEvent): Promise<void> {
    if (this.storage !== 'local' || event.storageArea !== window.localStorage || event.key !== this.storageKey) return;
    this._store = null;
    await this.applyStoredDecision();
    if (this._decision) await this.dialog?.close();
  }

  private cloneDecision(decision: NtePrivacyConsentDecision): NtePrivacyConsentDecision {
    return { ...decision, services: { ...decision.services } };
  }

  private dispatchConsentChange(
    previous: NtePrivacyConsentDecision | null,
    current: NtePrivacyConsentDecision | null,
  ): void {
    const serviceNames = new Set([...Object.keys(previous?.services ?? {}), ...Object.keys(current?.services ?? {})]);
    const changedServices = Array.from(serviceNames).filter(
      (service) => previous?.services[service] !== current?.services[service],
    );

    this.dispatchEvent(
      new CustomEvent('consent-change', {
        detail: { previous, current, changedServices },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private dispatchConsentError(
    phase: 'discovery' | 'storage' | 'activation',
    service: string | null,
    error: unknown,
  ): void {
    this.dispatchEvent(
      new CustomEvent('consent-error', {
        detail: { phase, service, error },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

if (!customElements.get('nte-privacy-consent')) {
  customElements.define('nte-privacy-consent', NtePrivacyConsent);
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-privacy-consent': NtePrivacyConsent;
  }
}
