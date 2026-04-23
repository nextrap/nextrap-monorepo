import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import style from './nte-input-signature.scss?inline';

const MIN_CANVAS_WIDTH = 2;
const SIZE_CHECK_INTERVAL = 1000;

@customElement('nte-input-signature')
export class NteInputSignature extends LitElement {
  static formAssociated = true;
  static override styles = [unsafeCSS(style)];

  @query('canvas')
  private canvas!: HTMLCanvasElement;

  @property() label = '';
  @property() name = '';
  @property({ type: Number }) height = 150;
  @property() strokeColor = '#000000';
  @property({ type: Number }) strokeWidth = 2;
  @property({ type: Boolean }) required = false;
  @property() invalidFeedback = '';
  @property() validFeedback = '';
  @property() helperText = '';

  @state() private isEmpty = true;
  @state() private isDrawing = false;
  @state() private touched = false;
  @state() private valid = false;
  @state() private invalid = false;

  private ctx: CanvasRenderingContext2D | null = null;
  private internals: ElementInternals;
  private lastX = 0;
  private lastY = 0;
  private touchIdentifier: number | null = null;
  private resizeObserver?: ResizeObserver;
  private sizeFallbackHandle: ReturnType<typeof setInterval> | null = null;
  private readonly handleWindowResize = () => this.updateCanvasDimensions();

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override firstUpdated() {
    this.initializeCanvas();
    this.observeSizeChanges();
    this.updateCanvasDimensions();
    window.addEventListener('resize', this.handleWindowResize);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleWindowResize);
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.stopFallbackSizeCheck();
  }

  private initializeCanvas() {
    this.ctx = this.canvas.getContext('2d');
    this.canvas.height = this.height;
    this.configureContext();
    this.clearCanvas();
  }

  private observeSizeChanges() {
    if (typeof ResizeObserver === 'undefined') {
      this.startFallbackSizeCheck();
      return;
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this) {
          this.updateCanvasDimensions(entry.contentRect.width);
        }
      }
    });
    this.resizeObserver.observe(this);
  }

  private getHostWidth(): number {
    const rect = this.getBoundingClientRect();
    if (rect.width) {
      return rect.width;
    }

    const computedWidth = Number.parseFloat(globalThis.getComputedStyle?.(this)?.width ?? '0');
    if (!Number.isNaN(computedWidth) && computedWidth > 0) {
      return computedWidth;
    }

    return this.offsetWidth || this.canvas.getBoundingClientRect().width || 0;
  }

  private updateCanvasDimensions(explicitWidth?: number) {
    if (!this.canvas) {
      return;
    }

    const previousWidth = this.canvas.width;
    const previousHeight = this.canvas.height;
    const measuredWidth = explicitWidth ?? this.getHostWidth();
    const targetWidth = Math.max(measuredWidth, MIN_CANVAS_WIDTH);

    let snapshot: ImageData | null = null;
    if (this.ctx && !this.isEmpty && previousWidth > 0 && previousHeight > 0) {
      try {
        snapshot = this.ctx.getImageData(0, 0, previousWidth, previousHeight);
      } catch (error) {
        snapshot = null;
      }
    }

    this.canvas.width = targetWidth;
    this.canvas.height = this.height;
    this.configureContext();

    if (snapshot && !this.isEmpty) {
      this.ctx?.putImageData(snapshot, 0, 0);
    } else {
      this.ctx?.clearRect(0, 0, targetWidth, this.height);
    }

    if (measuredWidth < MIN_CANVAS_WIDTH) {
      this.startFallbackSizeCheck();
    } else {
      this.stopFallbackSizeCheck();
    }
  }

  private configureContext() {
    if (!this.ctx) return;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;
  }

  private startFallbackSizeCheck() {
    if (this.sizeFallbackHandle) {
      return;
    }
    this.sizeFallbackHandle = setInterval(() => {
      this.updateCanvasDimensions();
    }, SIZE_CHECK_INTERVAL);
  }

  private stopFallbackSizeCheck() {
    if (!this.sizeFallbackHandle) {
      return;
    }
    clearInterval(this.sizeFallbackHandle);
    this.sizeFallbackHandle = null;
  }

  private startDrawing(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    this.isDrawing = true;

    if (!this.touched) {
      this.touched = true;
    }

    if (e instanceof MouseEvent) {
      const rect = this.canvas.getBoundingClientRect();
      this.lastX = e.clientX - rect.left;
      this.lastY = e.clientY - rect.top;
    } else if (e instanceof TouchEvent && e.touches.length > 0) {
      const touch = e.touches[0];
      this.touchIdentifier = touch.identifier;
      const rect = this.canvas.getBoundingClientRect();
      this.lastX = touch.clientX - rect.left;
      this.lastY = touch.clientY - rect.top;
    }
  }

  private draw(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    if (!this.isDrawing || !this.ctx) return;

    let currentX: number;
    let currentY: number;

    if (e instanceof MouseEvent) {
      const rect = this.canvas.getBoundingClientRect();
      currentX = e.clientX - rect.left;
      currentY = e.clientY - rect.top;
    } else if (e instanceof TouchEvent) {
      const touch = Array.from(e.touches).find((t) => t.identifier === this.touchIdentifier);
      if (!touch) return;
      const rect = this.canvas.getBoundingClientRect();
      currentX = touch.clientX - rect.left;
      currentY = touch.clientY - rect.top;
    } else {
      return;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;

    if (this.isEmpty) {
      this.isEmpty = false;
      this.validate();
    }
  }

  private stopDrawing(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    if (!this.isDrawing) return;

    this.isDrawing = false;
    this.touchIdentifier = null;

    this.validate();
  }

  private handleCanvasLeave(e: MouseEvent | TouchEvent) {
    if (this.isDrawing) {
      this.stopDrawing(e);
    }
  }

  public clearCanvas() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.configureContext();

    this.isEmpty = true;
    this.validate();
  }

  public getSignatureData(): string {
    return this.canvas.toDataURL();
  }

  public validateOnSubmit(): boolean {
    this.touched = true;
    return this.validate();
  }

  override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has('height')) {
      this.updateCanvasDimensions();
    }
    if (changed.has('strokeColor') || changed.has('strokeWidth')) {
      this.configureContext();
    }
  }

  private validate(): boolean {
    if (!this.touched) {
      this.valid = false;
      this.invalid = false;
      this.style.setProperty('--show-valid-feedback', 'none');
      this.style.setProperty('--show-invalid-feedback', 'none');
      return !this.required || !this.isEmpty;
    }

    if (this.required && this.isEmpty) {
      this.valid = false;
      this.invalid = true;
      this.style.setProperty('--show-valid-feedback', 'none');
      this.style.setProperty('--show-invalid-feedback', 'block');
      return false;
    }

    if (!this.required && this.isEmpty) {
      this.valid = false;
      this.invalid = false;
      this.style.setProperty('--show-valid-feedback', 'none');
      this.style.setProperty('--show-invalid-feedback', 'none');
      return true;
    }

    this.valid = true;
    this.invalid = false;
    this.style.setProperty('--show-valid-feedback', 'block');
    this.style.setProperty('--show-invalid-feedback', 'none');
    return true;
  }

  override render() {
    return html`
      ${this.label
        ? html`
            <label class="form-label">
              ${this.label}${this.required ? html`<span class="required-indicator">*</span>` : ''}
            </label>
          `
        : ''}
      <div class="signature-container">
        <canvas
          height="${this.height}"
          @mousedown="${this.startDrawing}"
          @mousemove="${this.draw}"
          @mouseup="${this.stopDrawing}"
          @mouseleave="${this.handleCanvasLeave}"
          @touchstart="${this.startDrawing}"
          @touchmove="${this.draw}"
          @touchend="${this.stopDrawing}"
          @touchcancel="${this.stopDrawing}"
          class="${this.invalid ? 'is-invalid' : ''} ${this.valid ? 'is-valid' : ''}"
        ></canvas>
        <button type="button" class="clear-button" @click="${this.clearCanvas}" aria-label="Clear signature">
          Clear
        </button>
      </div>
      ${this.helperText ? html`<div class="form-text">${this.helperText}</div>` : ''}
      ${this.invalidFeedback !== '' ? html`<div class="invalid-feedback">${this.invalidFeedback}</div>` : ''}
      ${this.validFeedback !== '' ? html`<div class="valid-feedback">${this.validFeedback}</div>` : ''}
    `;
  }
}
