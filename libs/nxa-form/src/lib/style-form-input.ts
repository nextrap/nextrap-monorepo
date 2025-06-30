import { css } from 'lit';

export const styleInput = css`
  :host {
    display: block;
    /* Base variables */
    --nxa-primary: #0d6efd;
    --nxa-secondary: #6c757d;
    --nxa-success: #198754;
    --nxa-danger: #dc3545;

    /* Border styles */
    --nxa-border-color: #dee2e6;
    --nxa-border-width: 1px;
    --nxa-border-radius: 0.375rem;
    --nxa-border-bottom: var(--nxa-border-width) solid var(--nxa-border-color);

    /* Input styles */
    --nxa-input-font-size: 1rem;
    --nxa-input-padding-x: 0.75rem;
    --nxa-input-padding-y: 0.375rem;
    --nxa-input-line-height: 1.5;
    --nxa-input-bg: #fff;
    --nxa-input-disabled-bg: #e9ecef;
    --nxa-input-color: #212529;
    --nxa-input-border: 1px solid var(--nxa-input-border-color);
    --nxa-input-border-color: var(--nxa-border-color);

    /* Focus styles */
    --nxa-focus-border-color: #86b7fe;
    --nxa-focus-box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);

    /* Validation styles */
    --nxa-valid-color: var(--nxa-success);
    --nxa-valid-border-color: var(--nxa-success);
    --nxa-valid-focus-box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
    --nxa-invalid-color: var(--nxa-danger);
    --nxa-invalid-border-color: var(--nxa-danger);
    --nxa-invalid-focus-box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);

    /* Text styles */
    --nxa-form-text-color: var(--nxa-secondary);
    --nxa-placeholder-color: var(--nxa-secondary);
    --nxa-placeholder-opacity: 0.65;

    /* Spacing */
    --nxa-spacing-sm: 0.5rem;
    --nxa-spacing-md: 1rem;
    --nxa-spacing-lg: 1.5rem;

    /* Size variants */
    --nxa-font-size-sm: 0.875rem;
    --nxa-font-size-md: 1rem;
    --nxa-font-size-lg: 1.25rem;

    /* Component specific */
    --nxa-group-gap: 1rem;

    /* Check and switch styles */
    --nxa-check-input-size: 1em;
    --nxa-check-bg: #fff;
    --nxa-check-border-color: var(--nxa-border-color);
    --nxa-check-checked-bg: var(--nxa-primary);
    --nxa-check-checked-border-color: var(--nxa-primary);
    --nxa-switch-width: 2.5em;
    --nxa-switch-height: 1.5em;
    --nxa-switch-thumb-size: calc(var(--nxa-switch-height) - 4px);
    --nxa-switch-bg: var(--nxa-secondary);
    --nxa-switch-checked-bg: var(--nxa-primary);
  }

  /* Modern style overrides */
  :host([modern]) {
    --nxa-border-width: 0;
    --nxa-border-radius: 0;
    --nxa-border-color: #dee2e6;
    --nxa-focus-box-shadow: none;
    --nxa-input-border: none;
    --nxa-border-bottom: 1px solid var(--nxa-border-color);
    --nxa-input-border-color: transparent;
  }

  /* Modern floating label specific styles */
  :host([modern]) .form-floating {
    border-bottom: 1px solid var(--nxa-border-color);
    transition: border-bottom-color 0.15s ease-in-out;
  }

  :host([modern]) .form-floating:focus-within {
    border-bottom: 2px solid var(--nxa-primary);
  }

  :host([modern]) .form-floating ::slotted(input.form-control),
  :host([modern]) .form-floating ::slotted(select.form-control),
  :host([modern]) .form-floating ::slotted(textarea.form-control) {
    border: none !important;
    border-bottom: none !important;
    padding-left: 0 !important;
    height: 2.5rem !important;
    min-height: 2.5rem !important;
    padding: 0.5rem 0 !important;
  }

  :host([modern]) .form-floating > label {
    padding-left: 0;
    padding: 0.5rem 0;
    height: 2.5rem;
  }

  /* Override focus and filled state padding for modern style */
  :host([modern]) .form-floating:focus-within ::slotted(input.form-control),
  :host([modern]) .form-floating.has-value ::slotted(input.form-control) {
    padding-top: 1rem !important;
    padding-bottom: 0 !important;
  }

  :host([modern]) .form-floating:focus-within > label,
  :host([modern]) .form-floating.has-value > label {
    transform: scale(0.75) translateY(-0.5rem) translateX(0);
  }

  /* Modern input alignment - remove left padding */
  :host([modern]) ::slotted(input.form-control),
  :host([modern]) ::slotted(select.form-control),
  :host([modern]) ::slotted(textarea.form-control) {
    padding-left: 0 !important;
  }

  /* Base Label Styles */
  .form-label {
    margin-bottom: var(--nxa-spacing-sm);
    font-size: var(--nxa-input-font-size);
    font-weight: 400;
    color: var(--nxa-input-color);
    padding-left: 0;
    display: block;
  }

  /* Ensure all form elements use border-box sizing */
  ::slotted(input),
  ::slotted(select),
  ::slotted(textarea) {
    box-sizing: border-box;
  }

  /* Base Input Styles */
  ::slotted(input.form-control) {
    display: block;
    width: 100%;
    padding: var(--nxa-input-padding-y) var(--nxa-input-padding-x);
    font-size: var(--nxa-input-font-size);
    font-weight: 400;
    line-height: var(--nxa-input-line-height);
    color: var(--nxa-input-color);
    background-color: var(--nxa-input-bg);
    background-clip: padding-box;
    border: var(--nxa-input-border);
    border-bottom: var(--nxa-border-bottom);
    border-radius: var(--nxa-border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    box-sizing: border-box;
  }

  ::slotted(input.form-control.is-invalid) {
    border-color: var(--nxa-danger);
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }

  ::slotted(input.form-control.is-valid) {
    border-color: var(--nxa-success);
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }

  ::slotted(input.form-control:focus) {
    color: var(--nxa-input-color);
    background-color: var(--nxa-input-bg);
    border-color: var(--nxa-focus-border-color);
    outline: 0;
    box-shadow: var(--nxa-focus-box-shadow);
  }

  ::slotted(input.form-control::placeholder) {
    color: var(--nxa-placeholder-color);
    opacity: var(--nxa-placeholder-opacity);
  }

  ::slotted(input.form-control:disabled),
  ::slotted(input.form-control[readonly]) {
    background-color: var(--nxa-input-disabled-bg);
    opacity: 1;
  }

  /* Input Sizes */
  ::slotted(input.form-control-sm) {
    padding: 0.25rem 0.5rem;
    font-size: var(--nxa-font-size-sm);
    border-radius: calc(var(--nxa-border-radius) * 0.75);
  }

  ::slotted(input.form-control-lg) {
    padding: 0.5rem 1rem;
    font-size: var(--nxa-font-size-lg);
    border-radius: calc(var(--nxa-border-radius) * 1.25);
  }

  /* Common base styles for both checkbox and radio */
  .form-check {
    display: flex;
    align-items: center;
    min-height: 1.5rem;
    padding-left: 1.5em;
    margin-bottom: 0.125rem;
  }

  .form-check-label {
    margin-left: 0.5rem;
    margin-bottom: 0;
    cursor: pointer;
  }

  /* Base input styles for both */
  ::slotted(input[type='checkbox'].form-check-input),
  ::slotted(input[type='radio'].form-check-input) {
    float: left;
    margin-left: -1.5em;
    width: 1em;
    height: 1em;
    margin-top: 0.25em;
    vertical-align: top;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: 1px solid rgba(0, 0, 0, 0.25);
    appearance: none;
    border-radius: 0.25em;
  }

  /* Checked state - same for both */
  ::slotted(input[type='checkbox'].form-check-input:checked),
  ::slotted(input[type='radio'].form-check-input:checked) {
    background-color: var(--nxa-primary);
    border-color: var(--nxa-primary);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
  }

  /* Focus states */
  ::slotted(input[type='checkbox'].form-check-input:focus),
  ::slotted(input[type='radio'].form-check-input:focus) {
    border-color: var(--nxa-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }

  /* Hover states */
  ::slotted(input[type='checkbox'].form-check-input:hover),
  ::slotted(input[type='radio'].form-check-input:hover) {
    cursor: pointer;
  }

  /* Disabled states */
  ::slotted(input[type='checkbox'].form-check-input:disabled),
  ::slotted(input[type='radio'].form-check-input:disabled) {
    pointer-events: none;
    filter: none;
    opacity: 0.5;
  }

  ::slotted(input[type='checkbox'].form-check-input:disabled)
    ~ .form-check-label,
  ::slotted(input[type='radio'].form-check-input:disabled) ~ .form-check-label {
    opacity: 0.5;
    cursor: default;
  }

  /* Validation states */
  ::slotted(input[type='checkbox'].form-check-input.is-invalid),
  ::slotted(input[type='radio'].form-check-input.is-invalid) {
    border: 1px solid var(--nxa-danger);
  }

  ::slotted(input[type='checkbox'].form-check-input.is-valid),
  ::slotted(input[type='radio'].form-check-input.is-valid) {
    border-color: var(--nxa-success);
  }

  /* Modern Switch Base Styles */
  .form-switch {
    padding-left: 3.5em;
    min-height: 2em;
  }

  .form-switch ::slotted(input.form-check-input) {
    width: 3em;
    height: 1.5em;
    margin-left: -3.5em;
    margin-top: 0.25em;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e") !important;
    background-position: left center;
    border-radius: 2em;
    transition: background-position 0.15s ease-in-out;
    border: 0;
    background-color: #e9ecef;
  }

  .form-switch ::slotted(input.form-check-input:checked) {
    background-position: right center;
    background-color: var(--nxa-primary);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e") !important;
  }

  /* Focus states */
  .form-switch ::slotted(input.form-check-input:focus) {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }

  /* Disabled state */
  .form-switch ::slotted(input.form-check-input:disabled) {
    opacity: 0.5;
  }

  /* Modern Radio Buttons - same as switches */
  .form-switch ::slotted(input[type='radio'].form-check-input) {
    width: 3em;
    height: 1.5em;
    background-color: #e9ecef;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e") !important;
  }

  .form-switch ::slotted(input[type='radio'].form-check-input:checked) {
    background-position: right center;
    background-color: var(--nxa-primary);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e") !important;
  }

  /* Floating Labels */
  .form-floating {
    position: relative;
  }

  .form-floating > label {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    padding: 0.3rem 0.6rem;
    pointer-events: none;
    border: 1px solid transparent;
    transform-origin: 0 0;
    transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
    color: var(--nxa-placeholder-color);
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }

  /* Base input styles */
  .form-floating ::slotted(input.form-control) {
    height: calc(3.5rem + 2px);
    min-height: calc(3.5rem + 2px);
    line-height: 1.25;
    padding: 1rem 0.75rem;
  }

  /* Focus state using :focus-within */
  .form-floating:focus-within ::slotted(input.form-control) {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
  }

  .form-floating:focus-within > label {
    opacity: 0.65;
    transform: scale(0.85) translateY(-1rem) translateX(0.15rem);
  }

  /* Filled state using class */
  .form-floating.has-value ::slotted(input.form-control) {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
  }

  .form-floating.has-value > label {
    opacity: 0.65;
    transform: scale(0.85) translateY(-1rem) translateX(0.15rem);
  }

  /* Small size variants */
  .form-floating ::slotted(input.form-control-sm) {
    height: calc(2.5rem + 2px);
    min-height: calc(2.5rem + 2px);
    padding: 0.75rem 0.75rem;
  }

  .form-floating:focus-within ::slotted(input.form-control-sm),
  .form-floating.has-value ::slotted(input.form-control-sm) {
    padding-top: 1.25rem;
    padding-bottom: 0.25rem;
  }

  .form-floating:focus-within > label.small,
  .form-floating.has-value > label.small {
    transform: scale(0.85) translateY(-0.7rem);
  }

  /* Large size variants */
  .form-floating ::slotted(input.form-control-lg) {
    height: calc(4.5rem + 2px);
    min-height: calc(4.5rem + 2px);
    padding: 1.25rem 0.75rem;
  }

  .form-floating:focus-within ::slotted(input.form-control-lg),
  .form-floating.has-value ::slotted(input.form-control-lg) {
    padding-top: 2rem;
    padding-bottom: 0.5rem;
  }

  .form-floating:focus-within > label.large,
  .form-floating.has-value > label.large {
    transform: scale(0.85) translateY(-1.3rem) translateX(0.35rem);
  }

  /* Select Styles */
  ::slotted(select.form-control) {
    display: block;
    width: 100%;
    padding: var(--nxa-input-padding-y) var(--nxa-input-padding-x);
    font-size: var(--nxa-input-font-size);
    font-weight: 400;
    line-height: var(--nxa-input-line-height);
    color: var(--nxa-input-color);
    background-color: var(--nxa-input-bg);
    background-clip: padding-box;
    border: var(--nxa-border-width) solid var(--nxa-input-border-color);
    border-bottom: var(--nxa-border-bottom);
    border-radius: var(--nxa-border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    appearance: none;
    padding-right: 2.25rem;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    box-sizing: border-box;
  }

  /* Select Focus State */

  ::slotted(select.form-control:focus) {
    color: var(--nxa-input-color);
    background-color: var(--nxa-input-bg);
    border-color: var(--nxa-focus-border-color);
    outline: 0;
    box-shadow: var(--nxa-focus-box-shadow);
  }

  /* Select Sizes */

  ::slotted(select.form-control-sm) {
    padding: 0.25rem 0.5rem;
    padding-right: 2rem;
    font-size: var(--nxa-font-size-sm);
    border-radius: calc(var(--nxa-border-radius) * 0.75);
    background-position: right 0.5rem center;
    min-height: calc(1.5em + 0.5rem + 2px);
  }

  ::slotted(select.form-control-lg) {
    padding: 0.5rem 1rem;
    padding-right: 2.5rem;
    font-size: var(--nxa-font-size-lg);
    border-radius: calc(var(--nxa-border-radius) * 1.25);
    background-position: right 1rem center;
    min-height: calc(1.5em + 1rem + 2px);
  }

  /* Select Disabled State */

  ::slotted(select.form-control:disabled) {
    background-color: var(--nxa-input-disabled-bg);
    opacity: 1;
    cursor: not-allowed;
  }

  /* Select Validation States */

  ::slotted(select.form-control.is-valid) {
    border-color: var(--nxa-valid-border-color);
    padding-right: 4rem;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e"),
      url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
    background-position: right 0.75rem center, center right 2.25rem;
    background-size: 16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }

  ::slotted(select.form-control.is-invalid) {
    border-color: var(--nxa-invalid-border-color);
    padding-right: 4rem;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e"),
      url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
    background-position: right 0.75rem center, center right 2.25rem;
    background-size: 16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }

  /* Floating Label Support for Select */

  .form-floating ::slotted(select.form-control) {
    height: calc(3.5rem + 2px);
    min-height: calc(3.5rem + 2px);
    line-height: 1.25;
    padding: 1rem 0.75rem;
  }

  .form-floating ::slotted(select.form-control-sm) {
    height: calc(2.5rem + 2px);
    min-height: calc(2.5rem + 2px);
    padding: 0.75rem 0.75rem;
  }

  .form-floating ::slotted(select.form-control-lg) {
    height: calc(4.5rem + 2px);
    min-height: calc(4.5rem + 2px);
    padding: 1.25rem 0.75rem;
  }

  .form-floating:focus-within ::slotted(select.form-control),
  .form-floating.has-value ::slotted(select.form-control) {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
  }

  .form-floating:focus-within ::slotted(select.form-control-sm),
  .form-floating.has-value ::slotted(select.form-control-sm) {
    padding-top: 1.25rem;
    padding-bottom: 0.25rem;
  }

  .form-floating:focus-within ::slotted(select.form-control-lg),
  .form-floating.has-value ::slotted(select.form-control-lg) {
    padding-top: 2rem;
    padding-bottom: 0.5rem;
  }

  /* Multiple Select Support */

  ::slotted(select[multiple].form-control),
  ::slotted(select[size].form-control) {
    height: auto;
    padding-right: 0.75rem;
    background-image: none;
  }

  /* Fix for Firefox Specific Issues */
  @-moz-document url-prefix() {
    ::slotted(select.form-control) {
      background-image: none !important;
      padding-right: 0.75rem;
    }

    ::slotted(select.form-control option) {
      color: var(--nxa-input-color);
      background-color: var(--nxa-input-bg);
    }
  }

  /* Feedback text styles */
  .form-text {
    margin-top: 0.25rem;
    font-size: 0.875em;
    color: var(--nxa-form-text-color);
  }

  .invalid-feedback,
  .valid-feedback {
    display: none;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 0.875em;
  }

  .invalid-feedback {
    color: var(--nxa-invalid-color);
  }

  .valid-feedback {
    color: var(--nxa-valid-color);
  }

  :host(.touched.invalid) .invalid-feedback,
  :host(.touched.valid) .valid-feedback {
    display: block;
  }

  /* Inline form styles */
  .form-inline {
    display: flex;
    align-items: center;
  }

  .form-inline .form-label {
    margin-right: var(--nxa-spacing-md);
    margin-bottom: 0;
  }

  .form-inline .input-wrapper {
    flex-grow: 1;
  }

  /* Required indicator */
  .required-indicator {
    color: var(--nxa-danger);
    margin-left: 0.25rem;
  }

  /* Styles for type="search" (pill input) */
  .search-input-wrapper {
    position: relative;
    border: var(--nxa-input-border);
    border-radius: var(--nxa-border-radius);
    padding: var(--nxa-input-padding-y) var(--nxa-input-padding-x);
    margin-bottom: 0.5rem;
  }
  :host([modern]) .search-input-wrapper {
    border: none;
    border-bottom: 1px solid var(--nxa-border-color);
    border-radius: 0;
    padding-left: 0;
  }

  .pills-and-input-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    min-height: 1.5em;
    width: 100%;
  }

  /* Ensure the slotted input takes remaining space and has flexible width */
  .search-input-wrapper ::slotted(input[slot='input']) {
    border: none;
    outline: none;
    padding: 0;
    flex: 1;
    min-width: 100px;
    box-sizing: border-box;
    font-size: var(--nxa-input-font-size);
    line-height: var(--nxa-input-line-height);
    color: var(--nxa-input-color);
    background-color: transparent;
  }
  .search-input-wrapper ::slotted(input[slot='input']):focus {
    box-shadow: none;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    background-color: #e9ecef;
    color: #495057;
    padding: 0.2em 0.6em;
    border-radius: 0.25rem;
    font-size: 0.875em;
    line-height: 1.2;
  }

  .remove-pill {
    background: none;
    border: none;
    color: #6c757d;
    margin-left: 0.45rem;
    padding: 0;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
    line-height: 1;
  }
  .remove-pill:hover {
    color: #343a40;
  }

  .suggestions-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--nxa-input-bg, #fff);
    border: 1px solid var(--nxa-border-color, #ced4da);
    border-top: none;
    border-radius: 0 0 var(--nxa-border-radius, 0.25rem)
      var(--nxa-border-radius, 0.25rem);
    z-index: 1050;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
  :host([modern]) .suggestions-container {
    border-radius: 0;
  }

  .suggestion-item {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border-bottom: 1px solid var(--nxa-border-color, #eee);
    font-size: var(--nxa-input-font-size);
    color: var(--nxa-input-color);
  }
  .suggestion-item:last-child {
    border-bottom: none;
  }
  .suggestion-item:hover,
  .suggestion-item:focus {
    background-color: #f0f0f0;
    outline: none;
  }
  .suggestion-item.loading {
    color: var(--nxa-secondary, #6c757d);
    font-style: italic;
    cursor: default;
  }
`;
