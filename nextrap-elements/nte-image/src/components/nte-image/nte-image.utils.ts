/**
 * Converts a CSS-style string into a JSON object.
 *
 * @param cssString - A string containing CSS-style declarations (e.g., "top: 10%; bottom: 20%")
 * @returns A record object where keys are CSS property names and values are the corresponding values
 * @example
 * cssToJson("top: 10%; bottom: 20%") // returns {"top": "10%", "bottom": "20%"}
 * cssToJson("") // returns {}
 */
export const cssToJson = (cssString: string): Record<string, string> => {
  if (!cssString || cssString.trim() === '') {
    return {};
  }

  // Split by semicolons, but keep semicolons inside quotes and parentheses
  const splitByPropertyRegex = /(?![^(]*\))(?![^"]*"(?:[^"]*"[^"]*")*[^"]*$);/;
  const properties = cssString.split(splitByPropertyRegex);

  return properties
    .map((pair) => pair.trim())
    .filter((pair) => pair !== '')
    .reduce(
      (acc, pair) => {
        const colonIndex = pair.indexOf(':');
        if (colonIndex === -1) {
          acc[pair.trim()] = '';
          return acc;
        }

        const key = pair.substring(0, colonIndex).trim();
        const value = pair.substring(colonIndex + 1).trim();

        if (key === '') {
          return acc;
        }

        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
};

// Helper function to parse values and maintain units
export const parseValue = (value?: string) => {
  if (!value) {
    return { value: 0, unit: '%' };
  }

  const match = value.match(/^([\d.-]+)(%|px|em|rem|vh|vw)?$/);
  if (!match) {
    return { value: 0, unit: '%' };
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] || '%',
  };
};

/**
 * Crops an image element using CSS clip-path and adjusts its margins based on the provided crop data.
 *
 * @param {HTMLImageElement} child - The image element to be cropped
 * @param {Object} cropData - Object containing crop values
 * @param referenceSize
 * @param {string} [cropData.top] - Distance from top edge in percentage
 * @param {string} [cropData.right] - Distance from right edge in percentage
 * @param {string} [cropData.bottom] - Distance from bottom edge in percentage
 * @param {string} [cropData.left] - Distance from left edge in percentage
 * @param {string} [cropData.transform] - Additional CSS transform to be applied
 * @param {string} [cropData.position] - Object position value (e.g., 'center', '50% 50%', 'top left')
 *
 * @example
 * cropImage(imageElement, {
 *   top: '10%',
 *   right: '20%',
 *   bottom: '10%',
 *   left: '20%',
 *   position: 'center'
 * });
 */
export const cropImage = (
  child: HTMLImageElement,
  cropData: { [p: string]: string },
  referenceSize: { width: string; height: string },
) => {
  // Set container styles
  child.style.objectFit = 'cover';

  // Set object position if specified
  if (cropData['position']) {
    child.style.objectPosition = cropData['position'];
  }

  // Parse crop values with their units
  const top = parseValue(cropData['top']);
  const right = parseValue(cropData['right']);
  const bottom = parseValue(cropData['bottom']);
  const left = parseValue(cropData['left']);

  // Apply margins with appropriate units
  child.style.marginTop = `-${top.value}${top.unit}`;
  child.style.marginLeft = `-${left.value}${left.unit}`;
  child.style.marginRight = `-${right.value}${right.unit}`;
  child.style.marginBottom = `-${bottom.value}${bottom.unit}`;

  // For percentage values, use simple width and height
  if (top.unit === '%' && right.unit === '%' && bottom.unit === '%' && left.unit === '%') {
    child.style.width = '100%';
    child.style.height = '100%';

    child.style.clipPath = `polygon(
            ${left.value}% ${top.value}%,
            ${100 - right.value}% ${top.value}%,
            ${100 - right.value}% ${100 - bottom.value}%,
            ${left.value}% ${100 - bottom.value}%
        )`;
  } else {
    // Calculate the width and height to ensure full coverage,
    // respecting the original units of each value
    child.style.width = `calc(100% + ${left.value}${left.unit} + ${right.value}${right.unit})`;
    child.style.height = `calc(100% + ${top.value}${top.unit} + ${bottom.value}${bottom.unit})`;

    // Create clip-path with the appropriate units
    child.style.clipPath = `polygon(
            ${left.value}${left.unit} ${top.value}${top.unit},
            calc(100% - ${right.value}${right.unit}) ${top.value}${top.unit},
            calc(100% - ${right.value}${right.unit}) calc(100% - ${bottom.value}${bottom.unit}),
            ${left.value}${left.unit} calc(100% - ${bottom.value}${bottom.unit})
        )`;
  }

  // Calculate the scale factor
  const scale = calculateScaleFactor(cropData, referenceSize);

  // Apply transform and set transform-origin
  child.style.transform = `scale(${scale})`;
  // Use object-position if specified, otherwise default to "center center"
  child.style.transformOrigin = child.style.objectPosition || 'center center';

  // Apply any additional transform if specified
  if (cropData['transform']) {
    const currentTransform = child.style.transform;
    child.style.transform = `${currentTransform} ${cropData['transform']}`;
  }
};

/**
 * Calculates the scale factor needed to make cropped image fill the container
 *
 * @param cropData Object containing crop values (top, right, bottom, left)
 * @param referenceSize
 * @returns The calculated scale factor
 */
export const calculateScaleFactor = (
  cropData: { [p: string]: string },
  referenceSize?: { width: string; height: string },
): number => {
  // Parse crop values with their units
  const top = parseValue(cropData['top']);
  const right = parseValue(cropData['right']);
  const bottom = parseValue(cropData['bottom']);
  const left = parseValue(cropData['left']);

  // For percentage values, use direct calculation
  if (top.unit === '%' && right.unit === '%' && bottom.unit === '%' && left.unit === '%') {
    const visibleWidth = 100 - left.value - right.value;
    const visibleHeight = 100 - top.value - bottom.value;

    const scaleX = visibleWidth > 0 ? 100 / visibleWidth : 1;
    const scaleY = visibleHeight > 0 ? 100 / visibleHeight : 1;

    return Math.max(scaleX, scaleY, 1);
  }
  // For pixel values or mixed units
  else if (referenceSize) {
    // For mixed units, we need to normalize everything to a common reference
    const referenceWidth = parseValue(referenceSize.width);
    const referenceHeight = parseValue(referenceSize.height);

    let referenceWidthPixels: number;
    let referenceHeightPixels: number;

    if (referenceWidth.unit === 'vw') {
      referenceWidthPixels = (window.innerWidth * referenceWidth.value) / 100;
    } else if (referenceWidth.unit === 'vh') {
      referenceWidthPixels = (window.innerHeight * referenceWidth.value) / 100;
    } else if (referenceHeight.unit === '%') {
      referenceWidthPixels = (window.innerWidth * referenceWidth.value) / 100;
    } else {
      // If the reference width is in pixels, use it directly
      referenceWidthPixels = referenceWidth.value;
    }

    if (referenceHeight.unit === 'vw') {
      referenceHeightPixels = (window.innerWidth * referenceHeight.value) / 100;
    } else if (referenceHeight.unit === 'vh') {
      referenceHeightPixels = (window.innerHeight * referenceHeight.value) / 100;
    } else if (referenceHeight.unit === '%') {
      referenceHeightPixels = (window.innerWidth * referenceHeight.value) / 100;
    } else {
      // If the reference height is in pixels, use it directly
      referenceHeightPixels = referenceHeight.value;
    }

    // Convert all values to pixels for calculation
    const topPx = top.unit === '%' ? (top.value * referenceHeightPixels) / 100 : top.value;
    const rightPx = right.unit === '%' ? (right.value * referenceWidthPixels) / 100 : right.value;
    const bottomPx = bottom.unit === '%' ? (bottom.value * referenceHeightPixels) / 100 : bottom.value;
    const leftPx = left.unit === '%' ? (left.value * referenceWidthPixels) / 100 : left.value;

    // Calculate visible dimensions in pixels
    const visibleWidth = referenceWidthPixels - leftPx - rightPx;
    const visibleHeight = referenceHeightPixels - topPx - bottomPx;

    // Calculate scale factors
    const scaleX = visibleWidth > 0 ? referenceWidthPixels / visibleWidth : 1;
    const scaleY = visibleHeight > 0 ? referenceHeightPixels / visibleHeight : 1;

    // Use the larger scale factor to ensure full coverage
    return Math.max(scaleX, scaleY, 1);
  }

  return 1;
};

/**
 * Detects if the current device is a mobile device
 * @returns True if the device is mobile, false otherwise
 */
export const detectMobileDevice = (): boolean => {
  // Check for touch capability
  const hasTouchCapability = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0;

  // Check for mobile screen size
  const isMobileWidth = window.innerWidth <= 768;

  // Check for mobile user agent (as a fallback)
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  return hasTouchCapability && (isMobileWidth || isMobileUserAgent);
};

/**
 * Generates CSS styles for the slideshow
 * @param transition The transition effect to use
 * @returns CSS styles as a string
 */
export const getSlideshowStyles = (transition?: string): string => {
  return `
        nte-image img {
          transition: opacity 0.5s ease;
        }

        nte-image.slideshow img:not(.active) {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        nte-image.slideshow img.active {
          opacity: 1;
          z-index: 1;
          pointer-events: auto;
        }

        ${
          transition === 'blend'
            ? `
        nte-image.slideshow img.active {
          animation: blendTransition 0.5s ease;
        }
        @keyframes blendTransition {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        `
            : ''
        }
    `;
};

// Constants
const SWIPE_THRESHOLD = 50;
const TOUCH_RESET_DELAY = 300;
const TRANSITION_DURATION = 300;

// Types
interface TouchState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isSwiping: boolean;
  touchHandled: boolean;
  touchStartTime: number;
  isButtonTouch: boolean;
  isClosing: boolean;
  touchTarget: HTMLElement | null;
}

/**
 * Creates and displays the fullsize view for an image
 * @param img The image to display in fullsize
 * @param isMobileDevice Whether the current device is mobile
 */
export const createFullsizeView = (
  img: HTMLImageElement,
  isMobileDevice: boolean,
  onClose?: () => void,
  onNext?: () => void,
  onPrev?: () => void,
  instanceId?: string,
): void => {
  // Check if fullscreen view already exists for this instance
  if (instanceId && document.querySelector(`.nxa-fullsize-container[data-instance="${instanceId}"]`)) {
    return;
  }
  // Also check for any existing fullscreen view (fallback for backward compatibility)
  if (document.querySelector('.nxa-fullsize-container')) {
    return;
  }

  // Create style element
  const styleEl = document.createElement('style');
  styleEl.id = 'nxa-fullsize-styles';
  styleEl.textContent = getFullsizeStyles(img.src);

  // Create container with elements
  const container = document.createElement('div');
  container.className = 'nxa-fullsize-container';

  const darkOverlay = document.createElement('div');
  darkOverlay.className = 'nxa-fullsize-dark-overlay';

  const blurredBg = document.createElement('div');
  blurredBg.className = 'nxa-fullsize-bg';

  const fullSizeImg = document.createElement('img');
  fullSizeImg.src = img.src;
  fullSizeImg.className = 'nxa-fullsize-image';

  // Add instance ID to elements if provided
  if (instanceId) {
    container.setAttribute('data-instance', instanceId);
    darkOverlay.setAttribute('data-instance', instanceId);
    blurredBg.setAttribute('data-instance', instanceId);
    fullSizeImg.setAttribute('data-instance', instanceId);
  }

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'nxa-fullsize-close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.style.display = isMobileDevice ? 'flex' : 'none';

  // Add instance ID to close button if provided
  if (instanceId) {
    closeBtn.setAttribute('data-instance', instanceId);
  }

  // Add elements to container
  container.appendChild(darkOverlay);
  container.appendChild(blurredBg);
  container.appendChild(fullSizeImg);
  container.appendChild(closeBtn);

  // Initialize touch state
  const touchState: TouchState = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isSwiping: false,
    touchHandled: false,
    touchStartTime: 0,
    isButtonTouch: false,
    isClosing: false,
    touchTarget: null,
  };

  // Create navigation buttons if onNext/onPrev are provided (slideshow is enabled)
  if (onNext && onPrev) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nxa-fullsize-nav-btn prev';
    prevBtn.innerHTML = '❮';

    // Handle touch events for buttons
    prevBtn.addEventListener(
      'touchstart',
      (e) => {
        e.stopPropagation();
        if (touchState.isClosing) return;
        touchState.isButtonTouch = true;
        touchState.touchHandled = true;
        onPrev();
      },
      { passive: false },
    );

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (touchState.isClosing) return;
      if (!touchState.touchHandled) {
        onPrev();
      }
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nxa-fullsize-nav-btn next';
    nextBtn.innerHTML = '❯';

    nextBtn.addEventListener(
      'touchstart',
      (e) => {
        e.stopPropagation();
        if (touchState.isClosing) return;
        touchState.isButtonTouch = true;
        touchState.touchHandled = true;
        onNext();
      },
      { passive: false },
    );

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (touchState.isClosing) return;
      if (!touchState.touchHandled) {
        onNext();
      }
    });

    // Add instance ID to navigation buttons if provided
    if (instanceId) {
      prevBtn.setAttribute('data-instance', instanceId);
      nextBtn.setAttribute('data-instance', instanceId);
    }

    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
  }

  // Setup event handlers
  const cleanup = () => {
    // Remove event listeners first to prevent any callbacks
    document.removeEventListener('keydown', keyHandler);
    darkOverlay.removeEventListener('click', cleanup);
    fullSizeImg.removeEventListener('click', handleImageClick);
    closeBtn.removeEventListener('click', handleCloseClick);
    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchmove', handleTouchMove);
    container.removeEventListener('touchend', handleTouchEnd);
    container.removeEventListener('touchcancel', handleTouchCancel);

    // Add closing animation class
    container.classList.add('closing');

    // Wait for animation to complete before removing
    setTimeout(() => {
      container.remove();
      // Only remove styles if this is the last fullscreen view
      if (!document.querySelector('.nxa-fullsize-container')) {
        document.getElementById('nxa-fullsize-styles')?.remove();
      }
      // Call onClose after everything is cleaned up
      onClose?.();
    }, TRANSITION_DURATION);
  };

  const handleImageClick = () => {
    cleanup();
  };

  const handleContainerClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Don't close if clicking on navigation buttons
    if (target.classList.contains('nxa-fullsize-nav-btn') || target.closest('.nxa-fullsize-nav-btn')) {
      return;
    }

    // Don't close if clicking on close button (it has its own handler)
    if (target === closeBtn || target.closest('.nxa-fullsize-close-btn')) {
      return;
    }

    // Close fullscreen for any other click
    cleanup();
  };

  const handleCloseClick = (e: MouseEvent) => {
    e.stopPropagation();
    cleanup();
  };

  const handleTouchStart = (e: TouchEvent) => {
    // Only handle single touch and ignore if it's a button touch
    if (e.touches.length > 1 || touchState.isButtonTouch) return;

    // Store the initial touch target
    touchState.touchTarget = e.target as HTMLElement;

    // Don't handle touch if it's on the close button or image
    if (touchState.touchTarget === closeBtn || touchState.touchTarget === fullSizeImg) return;

    touchState.startX = e.touches[0].clientX;
    touchState.startY = e.touches[0].clientY;
    touchState.isSwiping = false;
    touchState.touchHandled = false;
    touchState.touchStartTime = Date.now();

    // Add a class to indicate touch is active
    container.classList.add('touch-active');
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 1 || touchState.isButtonTouch) return;

    // Don't handle touch if it started on the close button or image
    if (touchState.touchTarget === closeBtn || touchState.touchTarget === fullSizeImg) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const xDiff = currentX - touchState.startX;
    const yDiff = currentY - touchState.startY;

    // Only start swiping if we've moved enough horizontally
    if (!touchState.isSwiping && Math.abs(xDiff) > 10) {
      touchState.isSwiping = true;
    }

    // Only handle horizontal swipes
    if (touchState.isSwiping && Math.abs(xDiff) > Math.abs(yDiff)) {
      e.preventDefault();
      touchState.touchHandled = true;

      // Update end coordinates
      touchState.endX = currentX;
      touchState.endY = currentY;
    }
  };

  const handleTouchEnd = () => {
    if (touchState.isButtonTouch) {
      touchState.isButtonTouch = false;
      return;
    }

    // Don't handle touch if it started on the close button or image
    if (touchState.touchTarget === closeBtn || touchState.touchTarget === fullSizeImg) {
      cleanup();
      return;
    }

    const touchDuration = Date.now() - touchState.touchStartTime;
    const xDiff = touchState.endX - touchState.startX;
    const yDiff = touchState.endY - touchState.startY;

    touchState.isSwiping = false;
    container.classList.remove('touch-active');

    // Only handle horizontal swipes that are significant enough
    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > SWIPE_THRESHOLD) {
      if (xDiff > 0 && onPrev) {
        onPrev();
      } else if (xDiff < 0 && onNext) {
        onNext();
      }
    } else if (!touchState.touchHandled && touchDuration < 300) {
      // If it was a quick tap and not a swipe, treat it as a click
      cleanup();
    }

    // Reset touch state after a short delay
    setTimeout(() => {
      touchState.touchHandled = false;
      touchState.endX = 0;
      touchState.endY = 0;
      touchState.touchTarget = null;
    }, TOUCH_RESET_DELAY);
  };

  const handleTouchCancel = () => {
    touchState.isSwiping = false;
    touchState.touchHandled = false;
    touchState.isButtonTouch = false;
    touchState.touchTarget = null;
    container.classList.remove('touch-active');
  };

  const keyHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cleanup();
    } else if (event.key === 'ArrowLeft' && onPrev) {
      onPrev();
    } else if (event.key === 'ArrowRight' && onNext) {
      onNext();
    }
  };

  // Add event listeners
  fullSizeImg.addEventListener('click', handleImageClick, true);
  darkOverlay.addEventListener('click', cleanup);
  container.addEventListener('click', handleContainerClick);
  closeBtn.addEventListener('click', handleCloseClick);
  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchmove', handleTouchMove, { passive: false });
  container.addEventListener('touchend', handleTouchEnd, { passive: true });
  container.addEventListener('touchcancel', handleTouchCancel, { passive: true });
  document.addEventListener('keydown', keyHandler);

  // Add style and container to document
  document.head.appendChild(styleEl);
  document.body.appendChild(container);
};

/**
 * Generates CSS styles for the fullsize view
 * @param imgSrc The source URL of the image
 * @returns CSS styles as a string
 */
export const getFullsizeStyles = (imgSrc: string): string => {
  return `
        @keyframes nxa-fullsize-fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes nxa-fullsize-scale-in {
            from {
                transform: scale(0.85);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes nxa-fullsize-blur-in {
            from {
                opacity: 0;
                filter: blur(40px);
            }
            to {
                opacity: 0.4;
                filter: blur(25px);
            }
        }

        .nxa-fullsize-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            cursor: zoom-out;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: nxa-fullsize-fade-in 0.3s ease-out;
        }

        .nxa-fullsize-dark-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            z-index: 0;
            animation: nxa-fullsize-fade-in 0.4s ease-out;
        }

        .nxa-fullsize-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url(${imgSrc});
            background-size: cover;
            background-position: center;
            filter: blur(25px);
            opacity: 0.4;
            mix-blend-mode: overlay;
            z-index: 0;
            animation: nxa-fullsize-blur-in 0.8s ease-out;
        }

        .nxa-fullsize-image {
            max-width: calc(100% - 2rem);
            max-height: calc(100% - 2rem);
            object-fit: contain;
            position: relative;
            z-index: 1;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            animation: nxa-fullsize-scale-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            will-change: transform, opacity;
        }

        .nxa-fullsize-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            background-color: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2;
            backdrop-filter: blur(8px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: nxa-fullsize-fade-in 0.5s ease-out 0.2s backwards;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .nxa-fullsize-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.15);
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .nxa-fullsize-close-btn:active {
            transform: scale(0.95);
        }

        @media (max-width: 768px) {
            .nxa-fullsize-close-btn {
                top: 16px;
                right: 16px;
                width: 40px;
                height: 40px;
                font-size: 20px;
            }
        }

        /* Animation for closing */
        .nxa-fullsize-container.closing {
            animation: nxa-fullsize-fade-in 0.3s ease-in reverse;
        }

        .nxa-fullsize-container.closing .nxa-fullsize-image {
            animation: nxa-fullsize-scale-in 0.3s ease-in reverse;
        }

        .nxa-fullsize-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 60px;
            background: rgba(0, 0, 0, 0.2);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto 0;
            font-size: 18px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(4px);
            z-index: 2;
            animation: nxa-fullsize-fade-in 0.5s ease-out 0.2s backwards;
        }

        .nxa-fullsize-nav-btn.prev {
            left: 0;
            border-radius: 0 4px 4px 0;
        }

        .nxa-fullsize-nav-btn.next {
            right: 0;
            border-radius: 4px 0 0 4px;
        }

        .nxa-fullsize-nav-btn:hover {
            background: rgba(0, 0, 0, 0.5);
            width: 50px;
        }

        @media (max-width: 768px) {
            .nxa-fullsize-nav-btn {
                width: 35px;
                height: 50px;
                font-size: 16px;
            }

            .nxa-fullsize-nav-btn:hover {
                width: 45px;
            }
        }
    `;
};
