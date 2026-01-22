import { expect } from 'vitest';
import { NtlParallaxBg } from './ntl-parallax-bg';

describe('ntl-parallax-bg', () => {
  let el: NtlParallaxBg;

  beforeEach(() => {
    el = document.createElement('ntl-parallax-bg') as NtlParallaxBg;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should create an element', () => {
    const element = new NtlParallaxBg();
    expect(element).toBeInstanceOf(NtlParallaxBg);
  });

  it('should have default property values', () => {
    expect(el.image).toBe('');
    expect(el.height).toBe('100vh');
    expect(el.width).toBe('100vw');
    expect(el.backgroundColor).toBe('transparent');
  });

  it('should render with default dimensions', async () => {
    await el.updateComplete;

    const wrapper = el.shadowRoot?.querySelector('.parallax-wrapper') as HTMLElement;
    expect(wrapper).toBeDefined();
    expect(wrapper.style.height).toBe('100vh');
    expect(wrapper.style.width).toBe('100vw');
    expect(wrapper.style.backgroundColor).toBe('transparent');
  });

  it('should render with custom image', async () => {
    const testImage = 'https://example.com/test.jpg';
    el.image = testImage;
    await el.updateComplete;

    expect(el.image).toBe(testImage);
    const container = el.shadowRoot?.querySelector('.parallax-container') as HTMLElement;
    expect(container.style.backgroundImage).toBe(`url("${testImage}")`);
  });

  it('should render with custom height', async () => {
    el.height = '50vh';
    await el.updateComplete;

    expect(el.height).toBe('50vh');
    const wrapper = el.shadowRoot?.querySelector('.parallax-wrapper') as HTMLElement;
    expect(wrapper.style.height).toBe('50vh');
  });

  it('should render with custom width', async () => {
    el.width = '80%';
    await el.updateComplete;

    expect(el.width).toBe('80%');
    const wrapper = el.shadowRoot?.querySelector('.parallax-wrapper') as HTMLElement;
    expect(wrapper.style.width).toBe('80%');
  });

  it('should render with custom background color', async () => {
    el.backgroundColor = '#ff0000';
    await el.updateComplete;

    expect(el.backgroundColor).toBe('#ff0000');
    const wrapper = el.shadowRoot?.querySelector('.parallax-wrapper') as HTMLElement;
    expect(wrapper.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should render all custom properties together', async () => {
    el.image = 'https://example.com/custom.jpg';
    el.height = '60vh';
    el.width = '90%';
    el.backgroundColor = '#123456';
    await el.updateComplete;

    expect(el.image).toBe('https://example.com/custom.jpg');
    expect(el.height).toBe('60vh');
    expect(el.width).toBe('90%');
    expect(el.backgroundColor).toBe('#123456');

    const wrapper = el.shadowRoot?.querySelector('.parallax-wrapper') as HTMLElement;
    expect(wrapper.style.height).toBe('60vh');
    expect(wrapper.style.width).toBe('90%');
  });

  it('should have parallax container in shadow DOM', async () => {
    await el.updateComplete;

    const container = el.shadowRoot?.querySelector('.parallax-container');
    expect(container).toBeDefined();
    expect(container?.classList.contains('parallax-container')).toBe(true);
  });

  it('should update properties reactively', async () => {
    await el.updateComplete;

    el.image = 'https://example.com/new.jpg';
    el.height = '75vh';
    await el.updateComplete;

    expect(el.image).toBe('https://example.com/new.jpg');
    expect(el.height).toBe('75vh');

    const container = el.shadowRoot?.querySelector('.parallax-container') as HTMLElement;
    expect(container.style.backgroundImage).toBe('url("https://example.com/new.jpg")');

    const wrapper = el.shadowRoot?.querySelector('.parallax-wrapper') as HTMLElement;
    expect(wrapper.style.height).toBe('75vh');
  });

  it('should have proper structure with wrapper and container', async () => {
    await el.updateComplete;

    const wrapper = el.shadowRoot?.querySelector('.parallax-wrapper');
    const container = el.shadowRoot?.querySelector('.parallax-container');

    expect(wrapper).toBeDefined();
    expect(container).toBeDefined();
    expect(wrapper?.contains(container!)).toBe(true);
  });

  it('should set attributes via HTML', async () => {
    const customEl = document.createElement('ntl-parallax-bg') as NtlParallaxBg;
    customEl.setAttribute('image', 'https://example.com/attr.jpg');
    customEl.setAttribute('height', '45vh');
    customEl.setAttribute('width', '75%');
    customEl.setAttribute('backgroundColor', '#abcdef');
    document.body.appendChild(customEl);
    await customEl.updateComplete;

    expect(customEl.image).toBe('https://example.com/attr.jpg');
    expect(customEl.height).toBe('45vh');
    expect(customEl.width).toBe('75%');
    expect(customEl.backgroundColor).toBe('#abcdef');

    document.body.removeChild(customEl);
  });
});
