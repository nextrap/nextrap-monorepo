import { afterAll, beforeAll, describe, expect, vi } from 'vitest';
import { NteInputSignature } from './nte-input-signature';

describe('NteInputSignature', () => {
  let getContextSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () =>
        ({
          beginPath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          stroke: vi.fn(),
          clearRect: vi.fn(),
          getImageData: vi.fn(() => ({ data: [] }) as ImageData),
          putImageData: vi.fn(),
          closePath: vi.fn(),
        }) as unknown as CanvasRenderingContext2D,
    );
  });

  afterAll(() => {
    getContextSpy.mockRestore();
  });

  it('should create an element', () => {
    const el = new NteInputSignature();
    expect(el).toBeInstanceOf(NteInputSignature);
  });

  it('renders with default properties', async () => {
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element).toBeInstanceOf(NteInputSignature);
    const canvas = element.shadowRoot?.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas?.height).toBe(150);

    document.body.removeChild(element);
  });

  it('renders with a label', async () => {
    const labelText = 'Your Signature';
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    element.label = labelText;
    document.body.appendChild(element);
    await element.updateComplete;

    const labelElement = element.shadowRoot?.querySelector('.form-label');
    expect(labelElement).not.toBeNull();
    expect(labelElement?.textContent).toContain(labelText);

    document.body.removeChild(element);
  });

  it('shows required indicator when required', async () => {
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    element.label = 'Signature';
    element.required = true;
    document.body.appendChild(element);
    await element.updateComplete;

    const requiredIndicator = element.shadowRoot?.querySelector('.required-indicator');
    expect(requiredIndicator).not.toBeNull();
    expect(requiredIndicator?.textContent).toBe('*');

    document.body.removeChild(element);
  });

  it('renders with custom height', async () => {
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    element.height = 300;
    document.body.appendChild(element);
    await element.updateComplete;

    const canvas = element.shadowRoot?.querySelector('canvas');
    expect(canvas?.height).toBe(300);

    document.body.removeChild(element);
  });

  it('has a clear button', async () => {
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    document.body.appendChild(element);
    await element.updateComplete;

    const clearButton = element.shadowRoot?.querySelector('.clear-button');
    expect(clearButton).not.toBeNull();
    expect(clearButton?.textContent).toContain('Clear');

    document.body.removeChild(element);
  });

  it('validates required field when empty', async () => {
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    element.required = true;
    element.invalidFeedback = 'Signature is required';
    document.body.appendChild(element);
    await element.updateComplete;

    // Validate on submit
    const isValid = element.validateOnSubmit();
    expect(isValid).toBe(false);

    // Check if invalid feedback is shown
    await element.updateComplete;
    const invalidFeedback = element.shadowRoot?.querySelector('.invalid-feedback');
    expect(invalidFeedback).not.toBeNull();

    document.body.removeChild(element);
  });

  it('clears the canvas when clear method is called', async () => {
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    document.body.appendChild(element);
    await element.updateComplete;

    // Clear the canvas
    element.clearCanvas();
    await element.updateComplete;

    // Verify the canvas is cleared (isEmpty should be true)
    expect(element['isEmpty']).toBe(true);

    document.body.removeChild(element);
  });

  // TODO: Canvas not fully supported in jsdom test environment
  it.todo('returns data URL from getSignatureData');

  it('renders helper text when provided', async () => {
    const helperText = 'Sign with your mouse or finger';
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    element.helperText = helperText;
    document.body.appendChild(element);
    await element.updateComplete;

    const helperElement = element.shadowRoot?.querySelector('.form-text');
    expect(helperElement).not.toBeNull();
    expect(helperElement?.textContent).toBe(helperText);

    document.body.removeChild(element);
  });

  it('shows valid feedback when configured', async () => {
    const validText = 'Signature captured';
    const element = document.createElement('nte-input-signature') as NteInputSignature;
    element.validFeedback = validText;
    document.body.appendChild(element);
    await element.updateComplete;

    const validElement = element.shadowRoot?.querySelector('.valid-feedback');
    expect(validElement).not.toBeNull();
    expect(validElement?.textContent).toBe(validText);

    document.body.removeChild(element);
  });
});
