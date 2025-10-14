import { html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import '../../src/components/nte-input-group/nte-input-group';
import '../../src/components/nte-input-signature/nte-input-signature';
import type { NteInputSignature } from '../../src/components/nte-input-signature/nte-input-signature';
import '../../src/components/nte-input/nte-input';

@customElement('signature-form-example')
export class SignatureFormExample extends LitElement {
  @query('#signature')
  private signatureElement!: NteInputSignature;

  @state() private submittedData: any = null;

  private handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Validate signature field
    const sigValid = this.signatureElement.validateOnSubmit();

    if (!sigValid) {
      console.log('Form validation failed');
      return;
    }

    // Get signature data
    const signatureData = this.signatureElement.getSignatureData();

    this.submittedData = {
      name: formData.get('name'),
      email: formData.get('email'),
      signature: signatureData,
    };

    console.log('Form submitted:', this.submittedData);
  }

  private clearSignature() {
    this.signatureElement.clearCanvas();
    this.submittedData = null;
  }

  protected override render() {
    return html`
      <style>
        :host {
          display: block;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family:
            system-ui,
            -apple-system,
            sans-serif;
        }

        h2 {
          margin-bottom: 2rem;
          color: #1e293b;
        }

        h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #475569;
          font-size: 1.25rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .signature-row {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .form-actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
        }

        button {
          padding: 0.625rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .btn-primary {
          background-color: #0d6efd;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0b5ed7;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #5c636a;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .result-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 0.5rem;
          border: 1px solid #dee2e6;
        }

        .result-section h3 {
          margin-top: 0;
        }

        .result-data {
          font-family: monospace;
          font-size: 0.875rem;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .signature-preview {
          margin-top: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
        }

        .signature-preview img {
          max-width: 100%;
          height: auto;
          border: 1px solid #e5e7eb;
        }

        .info-text {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
      </style>

      <h2>Signature Form Example</h2>

      <form method="get" @submit="${this.handleSubmit}">
        <div class="form-section">
          <nte-input-group>
            <nte-input label="Full Name" name="name" type="text" required helper-text="Enter your full legal name">
              <input slot="input" type="text" name="name" class="form-control" required placeholder="John Doe" />
            </nte-input>
          </nte-input-group>

          <nte-input-group>
            <nte-input label="Email" name="email" type="email" required helper-text="We'll never share your email">
              <input
                slot="input"
                type="email"
                name="email"
                class="form-control"
                required
                placeholder="john@example.com"
              />
            </nte-input>
          </nte-input-group>
        </div>

        <div class="form-section">
          <h3>Digital Signature</h3>
          <p class="info-text">
            Please sign below using your mouse or finger. Your signature will be captured digitally.
          </p>

          <nte-input-signature
            id="signature"
            label="Signature"
            name="signature"
            height="150"
            required
            invalid-feedback="Signature is required"
            valid-feedback="Signature captured"
            helper-text="Sign with your mouse or finger"
          ></nte-input-signature>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Submit Form</button>
          <button type="button" class="btn-secondary" @click="${this.clearSignature}">Clear Signature</button>
        </div>
      </form>

      ${this.submittedData
        ? html`
            <div class="result-section">
              <h3>Submitted Data</h3>
              <div class="result-data">
                <strong>Name:</strong> ${this.submittedData.name} <strong>Email:</strong> ${this.submittedData.email}
              </div>

              <div class="signature-preview">
                <h4>Signature:</h4>
                <img src="${this.submittedData.signature}" alt="Signature" />
              </div>
            </div>
          `
        : ''}
    `;
  }
}
