import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import { NteImage } from './nte-image.ts';
import { calculateScaleFactor, cropImage, cssToJson, parseValue } from './nte-image.utils.ts';

// Move setupDom and cleanup to top-level scope for all tests
const setupDom = () => {
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLImageElement = dom.window.HTMLImageElement;
  // Create test image element
  const child = dom.window.document.createElement('img');
  child.src = 'test-image.jpg';
  dom.window.document.body.appendChild(child);
  return { dom, child };
};
const cleanup = () => {
  delete global.window;
  delete global.document;
  delete global.HTMLImageElement;
};

describe('cssToJson', () => {
  it('should convert CSS string to JSON object', () => {
    const input = 'top: 10%; bottom: 20%';
    const expected = { top: '10%', bottom: '20%' };
    expect(cssToJson(input)).toEqual(expected);
  });

  it('should handle empty string', () => {
    expect(cssToJson('')).toEqual({});
  });

  it('should handle undefined', () => {
    expect(cssToJson(undefined)).toEqual({});
  });

  it('should handle string with semicolons', () => {
    const input = 'top: 10%; bottom: 20%; left: 30%';
    const expected = { top: '10%', bottom: '20%', left: '30%' };
    expect(cssToJson(input)).toEqual(expected);
  });

  it('should handle null input', () => {
    expect(cssToJson(null)).toEqual({});
  });

  it('should handle very large numbers and uncommon units', () => {
    const input = 'width: 1000000px; height: 200em;';
    const expected = { width: '1000000px', height: '200em' };
    expect(cssToJson(input)).toEqual(expected);
  });

  it('should handle various CSS style strings', () => {
    const testCases = [
      // Basic positioning
      'left: 50px; top: 20px',

      // Mixed units
      'margin: 10%; padding: 20px; width: 15rem',

      // Transform and opacity
      'transform: translate(10px, 20px); opacity: 0.5',

      // Colors and gradients
      'background-color: #ff0000; color: rgba(0,0,0,0.5)',

      // Multiple properties with spacing
      'border: 1px solid black;   margin-top: 10px;    padding-left: 20px',

      // Font related
      'font-size: 16px; font-weight: bold; line-height: 1.5',

      // Flexbox
      'display: flex; justify-content: center; align-items: center',

      // Grid
      'grid-template-columns: 1fr 2fr; gap: 10px; grid-auto-rows: minmax(100px, auto)',

      // Animation
      'animation: fadeIn 2s ease-in; transition: all 0.3s',

      // Complex values
      'box-shadow: 0 2px 4px rgba(0,0,0,0.1); filter: blur(5px) brightness(120%)',
    ];

    const expected = [
      { left: '50px', top: '20px' },
      { margin: '10%', padding: '20px', width: '15rem' },
      { transform: 'translate(10px, 20px)', opacity: '0.5' },
      { 'background-color': '#ff0000', color: 'rgba(0,0,0,0.5)' },
      { border: '1px solid black', 'margin-top': '10px', 'padding-left': '20px' },
      { 'font-size': '16px', 'font-weight': 'bold', 'line-height': '1.5' },
      { display: 'flex', 'justify-content': 'center', 'align-items': 'center' },
      { 'grid-template-columns': '1fr 2fr', gap: '10px', 'grid-auto-rows': 'minmax(100px, auto)' },
      { animation: 'fadeIn 2s ease-in', transition: 'all 0.3s' },
      { 'box-shadow': '0 2px 4px rgba(0,0,0,0.1)', filter: 'blur(5px) brightness(120%)' },
    ];

    testCases.forEach((input, index) => {
      expect(cssToJson(input)).toEqual(expected[index]);
    });
  });

  it('should handle malformed input', () => {
    const testCases = [
      // Missing values
      'top:; bottom: 20%',
      'top; bottom: 20%',

      // Missing keys
      ': 10%; bottom: 20%',

      // Extra colons
      'top: 10%: 20%; bottom: 30%',
      // Extra semicolons
      'top: 10%;; bottom: 20%;;;',

      // Only whitespace
      '   ',

      // Mixed valid and invalid
      'top: 10%; invalid; bottom: 20%',

      // Single property without semicolon
      'top: 10%',

      // Values with colons (like urls)
      'background-image: url(http://example.com/image.jpg)',

      // Values with semicolons in parentheses
      'font-family: "Helvetica;Arial", sans-serif',
    ];

    const expected = [
      { top: '', bottom: '20%' },
      { top: '', bottom: '20%' },
      { bottom: '20%' },
      { top: '10%: 20%', bottom: '30%' },
      { top: '10%', bottom: '20%' },
      {},
      { top: '10%', invalid: '', bottom: '20%' },
      { top: '10%' },
      { 'background-image': 'url(http://example.com/image.jpg)' },
      { 'font-family': '"Helvetica;Arial", sans-serif' },
    ];

    testCases.forEach((input, index) => {
      expect(cssToJson(input)).toEqual(expected[index]);
    });
  });
});

describe('parseValue', () => {
  it('should correctly parse percentage values', () => {
    const testCases = [
      { input: '10%', expected: { value: 10, unit: '%' } },
      { input: '0%', expected: { value: 0, unit: '%' } },
      { input: '100%', expected: { value: 100, unit: '%' } },
      { input: '99.5%', expected: { value: 99.5, unit: '%' } },
      { input: '-10%', expected: { value: -10, unit: '%' } },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = parseValue(input);
      expect(result).toEqual(expected, `Parsing ${input} should give ${JSON.stringify(expected)}`);
    });
  });

  it('should correctly parse pixel values', () => {
    const testCases = [
      { input: '10px', expected: { value: 10, unit: 'px' } },
      { input: '0px', expected: { value: 0, unit: 'px' } },
      { input: '250px', expected: { value: 250, unit: 'px' } },
      { input: '99.5px', expected: { value: 99.5, unit: 'px' } },
      { input: '-10px', expected: { value: -10, unit: 'px' } },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = parseValue(input);
      expect(result).toEqual(expected, `Parsing ${input} should give ${JSON.stringify(expected)}`);
    });
  });

  it('should correctly parse other CSS unit values', () => {
    const testCases = [
      { input: '1em', expected: { value: 1, unit: 'em' } },
      { input: '2.5rem', expected: { value: 2.5, unit: 'rem' } },
      { input: '50vh', expected: { value: 50, unit: 'vh' } },
      { input: '75vw', expected: { value: 75, unit: 'vw' } },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = parseValue(input);
      expect(result).toEqual(expected, `Parsing ${input} should give ${JSON.stringify(expected)}`);
    });
  });

  it('should handle numeric values without units', () => {
    const testCases = [
      { input: '10', expected: { value: 10, unit: '%' } },
      { input: '0', expected: { value: 0, unit: '%' } },
      { input: '99.5', expected: { value: 99.5, unit: '%' } },
      { input: '-10', expected: { value: -10, unit: '%' } },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = parseValue(input);
      expect(result).toEqual(expected, `Parsing ${input} should give ${JSON.stringify(expected)}`);
    });
  });

  it('should handle invalid or missing values', () => {
    const testCases = [
      { input: undefined, expected: { value: 0, unit: '%' } },
      { input: '', expected: { value: 0, unit: '%' } },
      { input: 'invalid', expected: { value: 0, unit: '%' } },
      { input: 'px10', expected: { value: 0, unit: '%' } },
      { input: 'em', expected: { value: 0, unit: '%' } },
      { input: '%', expected: { value: 0, unit: '%' } },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = parseValue(input);
      expect(result).toEqual(expected, `Parsing ${input} should give ${JSON.stringify(expected)}`);
    });
  });

  it('should handle edge cases', () => {
    const testCases = [
      { input: '0.001px', expected: { value: 0.001, unit: 'px' } },
      { input: '1000000%', expected: { value: 1000000, unit: '%' } },
      { input: '.5em', expected: { value: 0.5, unit: 'em' } },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = parseValue(input);
      expect(result).toEqual(expected, `Parsing ${input} should give ${JSON.stringify(expected)}`);
    });
  });

  it('should handle uncommon units', () => {
    const testCases = [
      { input: '5ch', expected: { value: 0, unit: '%' } }, // not supported, fallback
      { input: '10ex', expected: { value: 0, unit: '%' } }, // not supported, fallback
    ];
    testCases.forEach(({ input, expected }) => {
      expect(parseValue(input)).toEqual(expected);
    });
  });
});

describe('cropImage', () => {
  it('should set object-fit to cover for all cases', () => {
    const { child } = setupDom();
    try {
      cropImage(child, {}, { width: '100px', height: '100px' });
      expect(child.style.objectFit).toEqual('cover');
    } finally {
      cleanup();
    }
  });

  it('should set object-position when provided', () => {
    const { child } = setupDom();
    try {
      cropImage(child, { position: 'left top' }, { width: '100px', height: '100px' });
      expect(child.style.objectPosition).toEqual('left top');
    } finally {
      cleanup();
    }
  });

  it('should create clip-path for percentage crop values', () => {
    const { child } = setupDom();
    try {
      const cropData = { top: '10%', right: '20%', bottom: '30%', left: '40%' };
      cropImage(child, cropData, { width: '100px', height: '100px' });

      const clipPath = child.style.clipPath;
      expect(clipPath.includes('40% 10%')).toBeTruthy();
      expect(clipPath.includes('80% 10%')).toBeTruthy();
      expect(clipPath.includes('80% 70%')).toBeTruthy();
      expect(clipPath.includes('40% 70%')).toBeTruthy();

      // For percentage values, width and height should be 100%
      expect(child.style.width).toEqual('100%');
      expect(child.style.height).toEqual('100%');
    } finally {
      cleanup();
    }
  });

  it('should create clip-path for pixel crop values', () => {
    const { child } = setupDom();
    try {
      const cropData = { top: '10px', right: '20px', bottom: '30px', left: '40px' };
      cropImage(child, cropData, { width: '100px', height: '100px' });

      const clipPath = child.style.clipPath;
      expect(clipPath.includes('40px 10px')).toBeTruthy();
      expect(clipPath.includes('calc(100% - 20px) 10px')).toBeTruthy();
      expect(clipPath.includes('calc(100% - 20px) calc(100% - 30px)')).toBeTruthy();
      expect(clipPath.includes('40px calc(100% - 30px)')).toBeTruthy();
    } finally {
      cleanup();
    }
  });

  it('should set correct width and height for pixel crops', () => {
    const { child } = setupDom();
    try {
      const cropData = { top: '10px', right: '20px', bottom: '30px', left: '40px' };
      cropImage(child, cropData, { width: '100px', height: '100px' });

      expect(child.style.width).toEqual('calc(100% + 60px)');
      expect(child.style.height).toEqual('calc(100% + 40px)');
    } finally {
      cleanup();
    }
  });

  it('should set correct margins for pixel crops', () => {
    const { child } = setupDom();
    try {
      const cropData = { top: '10px', right: '20px', bottom: '30px', left: '40px' };
      cropImage(child, cropData, { width: '100px', height: '100px' });

      expect(child.style.marginTop).toEqual('-10px');
      expect(child.style.marginRight).toEqual('-20px');
      expect(child.style.marginBottom).toEqual('-30px');
      expect(child.style.marginLeft).toEqual('-40px');
    } finally {
      cleanup();
    }
  });

  it('should handle mixed unit crop values', () => {
    const { child } = setupDom();
    try {
      const cropData = { top: '10%', right: '20px', bottom: '30%', left: '40px' };
      cropImage(child, cropData, { width: '100px', height: '100px' });

      expect(child.style.marginTop).toEqual('-10%');
      expect(child.style.marginRight).toEqual('-20px');
      expect(child.style.marginBottom).toEqual('-30%');
      expect(child.style.marginLeft).toEqual('-40px');

      expect(child.style.width).toEqual('calc(100% + 60px)');
      expect(child.style.height).toEqual('calc(140%)');
    } finally {
      cleanup();
    }
  });

  it('should apply transform scale based on crop dimensions', () => {
    const { child } = setupDom();
    try {
      // Mock window.innerWidth/Height which are used in calculateScaleFactor
      global.window.innerWidth = 1000;
      global.window.innerHeight = 1000;

      const cropData = { top: '10%', right: '10%', bottom: '10%', left: '10%' };
      cropImage(child, cropData, { width: '100px', height: '100px' });

      // Scale factor should be 1.25 (100 / (100 - 10 - 10))
      expect(child.style.transform.includes('scale(1.25)')).toBeTruthy();
    } finally {
      cleanup();
    }
  });

  it('should set transform-origin based on object-position', () => {
    const { child } = setupDom();
    try {
      cropImage(child, { position: 'left top' }, { width: '100px', height: '100px' });
      expect(child.style.transformOrigin).toEqual('left top');

      cropImage(child, { position: 'center center' }, { width: '100px', height: '100px' });
      expect(child.style.transformOrigin).toEqual('center center');
    } finally {
      cleanup();
    }
  });

  it('should apply additional transform when specified in cropData', () => {
    const { child } = setupDom();
    try {
      cropImage(
        child,
        {
          top: '10%',
          right: '10%',
          bottom: '10%',
          left: '10%',
          transform: 'rotate(45deg)',
        },
        { width: '100px', height: '100px' },
      );

      expect(child.style.transform.includes('scale(')).toBeTruthy();
      expect(child.style.transform.includes('rotate(45deg)')).toBeTruthy();
    } finally {
      cleanup();
    }
  });

  it('should handle empty cropData without errors', () => {
    const { child } = setupDom();
    try {
      cropImage(child, {}, { width: '100px', height: '100px' });

      // Scale should default to 1
      expect(child.style.transform.includes('scale(1)')).toBeTruthy();

      // Default transform-origin should be 'center center'
      expect(child.style.transformOrigin).toEqual('center center');
    } finally {
      cleanup();
    }
  });

  it('should handle different reference sizes', () => {
    const { child } = setupDom();
    try {
      cropImage(child, { top: '10%', right: '10%', bottom: '10%', left: '10%' }, { width: '200px', height: '100px' });

      // Scale factor should still be 1.25
      expect(child.style.transform.includes('scale(1.25)')).toBeTruthy();
    } finally {
      cleanup();
    }
  });

  it('should handle reference sizes with different units', () => {
    const { child } = setupDom();
    try {
      global.window.innerWidth = 1000;
      global.window.innerHeight = 800;

      cropImage(child, { top: '10%', right: '10%', bottom: '10%', left: '10%' }, { width: '50vw', height: '50vh' });

      // Scale factor should still be 1.25
      expect(child.style.transform.includes('scale(1.25)')).toBeTruthy();
    } finally {
      cleanup();
    }
  });
});

describe('calculateScaleFactor', () => {
  it('should calculate correct scale factor for percentage values', () => {
    setupDom();
    try {
      // Test with standard crop values
      const cropData = { top: '10%', right: '10%', bottom: '10%', left: '10%' };
      const scaleFactor = calculateScaleFactor(cropData);

      // Expected scale factor: 100 / (100 - 10 - 10) = 1.25
      expect(scaleFactor).toEqual(1.25);
    } finally {
      cleanup();
    }
  });

  it('should calculate correct scale factor for pixel values', () => {
    setupDom();
    try {
      // Test with pixel values
      const cropData = { top: '50px', right: '50px', bottom: '50px', left: '50px' };
      const referenceSize = { width: '500px', height: '500px' };
      const scaleFactor = calculateScaleFactor(cropData, referenceSize);

      // Expected scale factor: 500 / (500 - 50 - 50) = 1.25
      expect(scaleFactor).toEqual(1.25);
    } finally {
      cleanup();
    }
  });

  it('should handle mixed units correctly', () => {
    setupDom();
    try {
      // Test with mixed units
      const cropData = { top: '10%', right: '50px', bottom: '10%', left: '50px' };
      const referenceSize = { width: '500px', height: '400px' };

      // For width: 500 - 50 - 50 = 400, scale = 500 / 400 = 1.25
      // For height: 400 - 40 - 40 = 320, scale = 400 / 320 = 1.25
      // Choose max of both = 1.25
      const scaleFactor = calculateScaleFactor(cropData, referenceSize);

      expect(scaleFactor).toEqual(1.25);
    } finally {
      cleanup();
    }
  });

  it('should handle different aspect ratios', () => {
    setupDom();
    try {
      // Test with non-square reference size
      const cropData = { top: '10%', right: '20%', bottom: '10%', left: '20%' };
      const referenceSize = { width: '800px', height: '400px' };

      // For width: visible = 60%, scale = 1.67
      // For height: visible = 80%, scale = 1.25
      // Choose max = 1.67
      const scaleFactor = calculateScaleFactor(cropData, referenceSize);

      // Allow small floating point differences
      expect(Math.abs(scaleFactor - 1.67) < 0.01).toBeTruthy();
    } finally {
      cleanup();
    }
  });

  it('should handle viewport relative units (vh, vw)', () => {
    setupDom();
    try {
      global.window.innerWidth = 1000;
      global.window.innerHeight = 800;

      const cropData = { top: '10%', right: '10%', bottom: '10%', left: '10%' };
      const referenceSize = { width: '50vw', height: '50vh' };

      // Width: 50vw = 500px, height: 50vh = 400px
      // Crop is 10% on each side, so visible is 80%
      // Scale factor = 1.25
      const scaleFactor = calculateScaleFactor(cropData, referenceSize);

      expect(scaleFactor).toEqual(1.25);
    } finally {
      cleanup();
    }
  });

  it('should return 1 when no crop values are provided', () => {
    setupDom();
    try {
      const cropData = {};
      const referenceSize = { width: '500px', height: '500px' };

      const scaleFactor = calculateScaleFactor(cropData, referenceSize);

      expect(scaleFactor).toEqual(1);
    } finally {
      cleanup();
    }
  });

  it('should handle zero or negative visible area with percentage values', () => {
    setupDom();
    try {
      // Test with crop values that would result in no visible area
      const cropData = { top: '50%', right: '50%', bottom: '50%', left: '50%' };

      const scaleFactor = calculateScaleFactor(cropData);

      // Should return 1 for zero visible area (avoid division by zero)
      expect(scaleFactor).toEqual(1);
    } finally {
      cleanup();
    }
  });

  it('should handle zero or negative visible area with pixel values', () => {
    setupDom();
    try {
      // Test with crop values that would result in no visible area
      const cropData = { top: '250px', right: '250px', bottom: '250px', left: '250px' };
      const referenceSize = { width: '500px', height: '500px' };

      const scaleFactor = calculateScaleFactor(cropData, referenceSize);

      // Should return 1 for zero or negative visible area
      expect(scaleFactor).toEqual(1);
    } finally {
      cleanup();
    }
  });

  it('should handle missing reference size for pixel values', () => {
    setupDom();
    try {
      const cropData = { top: '50px', right: '50px', bottom: '50px', left: '50px' };

      // When reference size is missing, should return 1
      const scaleFactor = calculateScaleFactor(cropData);

      expect(scaleFactor).toEqual(1);
    } finally {
      cleanup();
    }
  });

  it('should handle oversized crop values', () => {
    setupDom();
    try {
      // Test with very large crop values
      const cropData = { top: '100%', right: '100%', bottom: '100%', left: '100%' };

      const scaleFactor = calculateScaleFactor(cropData);

      // Should default to 1 for impossible scaling
      expect(scaleFactor).toEqual(1);
    } finally {
      cleanup();
    }
  });

  it('should handle negative crop values', () => {
    try {
      // Test with negative crop values (which would expand rather than crop)
      const cropData = { top: '-10%', right: '-10%', bottom: '-10%', left: '-10%' };

      const scaleFactor = calculateScaleFactor(cropData);

      // With negative values: visible area is 120%, scale = 100/120 = 0.83
      // But we use Math.max(scaleX, scaleY, 1) to not scale down below 1
      expect(scaleFactor).toEqual(1);
    } finally {
      cleanup();
    }
  });
});

describe('NteImage Debug Property', () => {
  it('should have debug property with default value false', () => {
    setupDom();
    try {
      // Create a new instance
      const component = new NteImage();

      // Check that debug property exists and defaults to false
      expect(component.debug).toBe(false);
    } finally {
      cleanup();
    }
  });

  it('should enable debug logging when debug property is set to true', () => {
    setupDom();
    try {
      const originalConsoleLog = console.log;
      const mockLog = vi.fn();
      console.log = mockLog;
      const component = new NteImage();
      component.debug = true;
      component.debugLog('Test debug message', { test: 'data' });
      expect(mockLog).toHaveBeenCalledWith('[nte-image] Test debug message', { test: 'data' });
      console.log = originalConsoleLog;
    } finally {
      cleanup();
    }
  });
  it('should not log when debug property is false', () => {
    setupDom();
    try {
      const originalConsoleLog = console.log;
      const mockLog = vi.fn();
      console.log = mockLog;
      const component = new NteImage();
      component.debug = false;
      component.debugLog('Test debug message', { test: 'data' });
      expect(mockLog).not.toHaveBeenCalled();
      console.log = originalConsoleLog;
    } finally {
      cleanup();
    }
  });
});
