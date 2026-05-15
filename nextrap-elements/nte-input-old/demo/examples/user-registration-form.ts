import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../src/components/nte-input-control/nte-input-control';
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
          <nte-input-control label="First Name" helperText="Required">
            <nte-input type="text" name="firstName" placeholder="Enter your first name" required></nte-input>
          </nte-input-control>

          <nte-input-control label="Last Name" helperText="Required">
            <nte-input type="text" name="lastName" placeholder="Enter your last name" required></nte-input>
          </nte-input-control>
        </nte-input-group>

        <!-- Email field -->
        <nte-input-control
          label="Email Address"
          helperText="We’ll never share your email"
          invalidFeedback="Please enter a valid email."
        >
          <nte-input type="email" name="email" placeholder="Enter your email" required></nte-input>
        </nte-input-control>

        <!-- Password fields -->
        <nte-input-group cols="1-2-2">
          <nte-input-control label="Password" invalidFeedback="At least 8 characters" validFeedback="Looks good!">
            <nte-input
              type="password"
              name="password"
              placeholder="Create a password"
              minlength="8"
              required
            ></nte-input>
          </nte-input-control>

          <nte-input-control label="Confirm Password" invalidFeedback="Passwords must match">
            <nte-input type="password" name="confirmPassword" placeholder="Confirm your password" required></nte-input>
          </nte-input-control>
        </nte-input-group>

        <!-- Country selection -->
        <nte-input-control label="Country" helperText="Required" invalidFeedback="Please select a country">
          <nte-input
            type="select"
            name="country"
            required
            select-options='[
              {"key":"","value":"Select your country"},
              {"key":"us","value":"United States"},
              {"key":"uk","value":"United Kingdom"},
              {"key":"ca","value":"Canada"},
              {"key":"de","value":"Germany"},
              {"key":"fr","value":"France"},
              {"key":"au","value":"Australia"}
            ]'
          ></nte-input>
        </nte-input-control>

        <!-- Checkboxes -->
        <nte-input-group cols="1-1-1">
          <nte-input-control
            type="checkbox"
            label="I agree to the Terms and Conditions"
            invalidFeedback="Please agree"
            required
          >
            <nte-input type="checkbox" name="agreeToTerms" required></nte-input>
          </nte-input-control>

          <nte-input-control type="checkbox" label="Subscribe to newsletter">
            <nte-input type="checkbox" name="newsletter"></nte-input>
          </nte-input-control>
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
