import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../src/components/nte-input-group/nte-input-group';
import '../../src/components/nte-input/nte-input';

@customElement('user-registration-form')
export class UserRegistrationForm extends LitElement {
  @state() formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    agreeToTerms: false,
    newsletter: false,
  };

  private handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    console.log('Form submitted:', Object.fromEntries(formData as any));
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    this.formData = {
      ...this.formData,
      [name]: type === 'checkbox' ? checked : value,
    };
  }

  protected override render() {
    return html`
      <style>
        :host {
          display: block;
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        h2 {
          margin-bottom: 2rem;
          color: #1e293b;
        }

        .form-actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
        }

        button {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-primary {
          background-color: #0d6efd;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0b5ed7;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
      </style>

      <h2>User Registration</h2>

      <form method="get" @submit="${this.handleSubmit}" @input="${this.handleInputChange}">
        <!-- Name fields -->
        <nte-input-group cols="1-2-2">
          <nte-input label="First Name" name="firstName" required>
            <input
              slot="input"
              type="text"
              class="form-control"
              name="firstName"
              placeholder="Enter your first name"
              required
            />
          </nte-input>

          <nte-input label="Last Name" name="lastName" required>
            <input
              slot="input"
              type="text"
              class="form-control"
              name="lastName"
              placeholder="Enter your last name"
              required
            />
          </nte-input>
        </nte-input-group>

        <!-- Email field -->
        <nte-input label="Email Address" name="email" required>
          <input slot="input" type="email" class="form-control" name="email" placeholder="Enter your email" required />
        </nte-input>

        <!-- Password fields -->
        <nte-input-group cols="1-2-2">
          <nte-input label="Password" name="password" required>
            <input
              slot="input"
              type="password"
              class="form-control"
              name="password"
              placeholder="Create a password"
              required
            />
          </nte-input>

          <nte-input label="Confirm Password" name="confirmPassword" required>
            <input
              slot="input"
              type="password"
              class="form-control"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </nte-input>
        </nte-input-group>

        <!-- Country selection -->
        <nte-input label="Country" type="select" name="country" required>
          <select slot="input" class="form-control" name="country" required>
            <option value="">Select your country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="au">Australia</option>
          </select>
        </nte-input>

        <!-- Checkboxes -->
        <nte-input-group cols="1-1-1">
          <nte-input type="checkbox" label="I agree to the Terms and Conditions" name="agreeToTerms" required>
            <input slot="input" type="checkbox" class="form-check-input" name="agreeToTerms" required />
          </nte-input>

          <nte-input type="checkbox" label="Subscribe to newsletter" name="newsletter">
            <input slot="input" type="checkbox" class="form-check-input" name="newsletter" />
          </nte-input>
        </nte-input-group>

        <!-- Submit buttons -->
        <div class="form-actions">
          <button type="submit" class="btn-primary">Create Account</button>
          <button type="button" class="btn-secondary">Cancel</button>
        </div>
      </form>
    `;
  }
}
