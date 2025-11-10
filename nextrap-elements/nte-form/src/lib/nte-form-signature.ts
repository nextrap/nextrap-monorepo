import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import style from './nte-form-signature.scss?inline';

@customElement('nte-form-signature')
export class NteFormSignature extends LitElement {
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

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override firstUpdated() {
    this.setupCanvas();
    window.addEventListener('resize', () => this.handleResize());
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', () => this.handleResize());
  }

  private setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.strokeWidth;
    }
    this.clearCanvas();
  }

  private handleResize() {
    const imageData = this.ctx?.getImageData(0, 0, this.canvas.width, this.canvas.height);

    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = this.height;

    if (this.ctx) {
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.strokeWidth;

      if (imageData && !this.isEmpty) {
        this.ctx.putImageData(imageData, 0, 0);
      } else {
        this.clearCanvas();
      }
    }
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

    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;

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
