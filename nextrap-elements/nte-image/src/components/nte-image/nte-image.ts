import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import componentStyles from './nte-image.scss?inline';
import type { SlideShowConfig } from './nte-image.types';
import { defaultSlideshowInterval, SlideShowTransitions } from './nte-image.types';
import { createFullsizeView, cropImage, cssToJson, detectMobileDevice, getSlideshowStyles } from './nte-image.utils';

/**
 * NteImage component - A versatile image display component with slideshow, fullscreen, and cropping capabilities.
 *
 * @element nte-image
 *
 * @attr {string} data-features - Space-separated list of features to enable. Supported values:
 *   - "slideshow" - Enables slideshow functionality
 *   - "fullsize" - Enables fullscreen view on click
 *   - "arrows" - Shows navigation arrows for slideshow
 *   - "indicators" - Shows indicator dots for slideshow
 *   - "round-borders" - Applies rounded corners to the component
 *   - "blend" - Uses blend transition effect for slideshow TODO: Not implemented yet
 *   - "dont-pause-on-hover" - Prevents slideshow from pausing on hover
 *
 * @attr {string} data-crop - Global crop settings applied to all images. Format: "top: value; right: value; bottom: value; left: value"
 *   Values can be in pixels (e.g., "10px") or percentages (e.g., "10%")
 *
 * @attr {number} interval - Custom interval for slideshow transitions in milliseconds (default: 5000)
 *
 * @attr {boolean} debug - Enables debug mode with detailed console logging for troubleshooting
 *
 * @csspart image-container - The container for the images
 * @csspart caption-container - The container for the caption
 * @csspart indicators - The container for the slideshow indicators
 * @csspart navigation-arrows - The container for the navigation arrows
 *
 * @cssprop --nte-image-border-radius - Border radius for rounded corners (default: 12px)
 *
 * @fires nte-image-fullsize-open - Fired when fullsize view is opened
 * @fires nte-image-fullsize-close - Fired when fullsize view is closed
 * @fires nte-image-slide-change - Fired when the active slide changes
 *
 * @slot - Default slot for images. Each image can have the following attributes:
 *   - data-caption: Text caption for the image
 *   - data-crop: Individual crop settings for this image (overrides global settings)
 *   - style="object-position: X Y": Controls the focus point of the image
 */
@customElement('nte-image')
export class NteImage extends LitElement {
  static override styles = [unsafeCSS(componentStyles)];

  /**
   * Global crop settings applied to all images in the component.
   * Can be overridden by individual image crop settings.
   */
  @property({ type: Object }) globalDataCrop: Record<string, string> = {};

  /**
   * Array of crop settings for each individual image.
   * Each index corresponds to the position of the image in the component.
   */
  @property({ type: Array }) childDataCrop: Record<string, string>[] = [];

  /**
   * List of enabled features for the component.
   * Features are specified in the data-features attribute as space-separated values.
   */
  @property({
    type: Array,
    attribute: 'data-features',
    converter: {
      fromAttribute: (value: string | null) => {
        const result = value?.split(' ').filter(Boolean) || [];
        return result;
      },
      toAttribute: (value: string[]) => {
        return value.join(' ');
      },
    },
  })
  dataFeatures: string[] = [];

  /**
   * Configuration object for slideshow functionality.
   * Contains settings like interval, transition effects, and UI elements visibility.
   */
  @property({ type: Object }) slidesShowConfig: SlideShowConfig = {};

  /**
   * Whether the component supports fullscreen view of images.
   * Enabled when 'fullsize' is included in data-features.
   */
  @property({ type: Boolean }) fullSize = false;

  /**
   * Whether the component has rounded corners.
   * Enabled when 'round-borders' is included in data-features.
   */
  @property({ type: Boolean }) roundBorders = false;

  /**
   * Custom interval duration for slideshow transitions in milliseconds.
   * If not specified, defaults to defaultSlideshowInterval.
   */
  @property({ type: Number }) interval = 0;

  /**
   * Callback function called when the active slide changes.
   * Receives the index of the new active slide and the image element.
   */
  @property({ type: Function }) onSlideChange?: (index: number, image: HTMLImageElement) => void;

  /**
   * Callback function called when entering fullscreen mode.
   * Receives the image element that was clicked.
   */
  @property({ type: Function }) onFullscreenEnter?: (image: HTMLImageElement) => void;

  /**
   * Callback function called when exiting fullscreen mode.
   * Receives the image element that was in fullscreen.
   */
  @property({ type: Function }) onFullscreenExit?: (image: HTMLImageElement) => void;

  /**
   * Callback function called when the slideshow is paused.
   * Receives the current active image element.
   */
  @property({ type: Function }) onSlideshowPause?: (image: HTMLImageElement) => void;

  /**
   * Callback function called when the slideshow is resumed.
   * Receives the current active image element.
   */
  @property({ type: Function }) onSlideshowResume?: (image: HTMLImageElement) => void;

  /**
   * Callback function called when an image is clicked.
   * Receives the clicked image element and the click event.
   */
  @property({ type: Function }) onImageClick?: (image: HTMLImageElement, event: MouseEvent) => void;

  /**
   * Whether debug mode is enabled for this component.
   * When enabled, detailed console logs will be output for debugging purposes.
   */
  @property({ type: Boolean }) debug = false;

  /**
   * Whether the component is in fullscreen mode.
   */
  @state() isFullSizeActive = false;

  /**
   * Current caption text displayed below the active image.
   * Updated when slides change or when a new image becomes active.
   */
  @state() currentCaption = '';

  /**
   * X-coordinate of the touch start position.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() touchStartX = 0;

  /**
   * Y-coordinate of the touch start position.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() touchStartY = 0;

  /**
   * X-coordinate of the touch end position.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() touchEndX = 0;

  /**
   * Y-coordinate of the touch end position.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() touchEndY = 0;

  /**
   * Whether the current device is a mobile device.
   * Affects touch event handling and UI adaptations.
   */
  @state() isMobileDevice = false;

  /**
   * Whether the slideshow is currently paused.
   * Can be triggered by hover events or user interaction.
   */
  @state() isPaused = false;

  /**
   * Current progress of the slideshow transition (0-100).
   * Used for progress bar animation in indicators.
   */
  @state() slideProgress = 0;

  /**
   * Whether the slideshow is currently being swiped.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() isSwiping = false;

  /**
   * Distance of the swipe gesture.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() swipeDistance = 0;

  /**
   * Threshold distance for swipe gesture detection.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() swipeThreshold = 50;

  /**
   * Velocity threshold for swipe gesture detection.
   * Used for swipe gesture detection on mobile devices.
   */
  @state() swipeVelocityThreshold = 0.3;

  /**
   * ID of the current slideshow interval.
   * Used for proper cleanup and interval management.
   */
  private _intervalId: number | null = null;

  /**
   * ResizeObserver instance for detecting size changes.
   * Used to update image cropping when the component size changes.
   */
  private _resizeObserver: ResizeObserver | null = null;

  /**
   * Bound event handlers for proper cleanup.
   */
  private _boundHandleResize: (() => void) | null = null;
  private _boundPauseSlideshow: (() => void) | null = null;
  private _boundResumeSlideshow: (() => void) | null = null;

  /**
   * Unique instance ID to prevent conflicts when multiple instances exist on the same page.
   */
  private _instanceId: string;

  /**
   * Creates a new NteImage component.
   * Sets default width and height if not specified.
   */
  constructor() {
    super();
    this._instanceId = `nte-image-${Math.random().toString(36).substring(2, 11)}`;
    if (!this.style.width) {
      this.style.width = '100%';
    }
    if (!this.style.height) {
      this.style.height = '100%';
    }
  }

  /**
   * Logs debug messages to the console if debug mode is enabled.
   * @param message The debug message
   * @param data Optional additional data
   */
  debugLog(message: string, data?: unknown) {
    if (this.debug) {
      console.log(`[nte-image] ${message}`, data);
    }
  }

  /**
   * Lifecycle method called when the element is added to the DOM
   * Initializes properties, event listeners, and observers
   */
  override connectedCallback() {
    super.connectedCallback();
    this.debugLog('Component connected to DOM');

    // Initialize arrays and objects to ensure they exist
    this.childDataCrop = [];
    // Don't manually initialize dataFeatures - let the reactive property system handle it
    this.slidesShowConfig = {};
    this.globalDataCrop = {};

    // Parse data-crop attribute
    this.globalDataCrop = cssToJson(this.getAttribute('data-crop') || '');

    // Get child data-crop attributes
    Array.from(this.children).forEach((child, index) => {
      this.childDataCrop[index] = cssToJson(child?.getAttribute('data-crop') || '');
    });

    // Initialize slideshow config (dataFeatures is now handled by reactive property)
    this.initSlidesShowConfig();

    // Check for captions
    const children = Array.from(this.children) as HTMLElement[];
    this.slidesShowConfig.showCaptions = children.some((child) => child.getAttribute('data-caption') !== null);

    this.fullSize = this.dataFeatures.includes('fullsize');
    this.debugLog('Fullsize property set', {
      fullSize: this.fullSize,
      dataFeatures: this.dataFeatures,
    });

    // Set roundBorders based on data-features
    this.roundBorders = this.dataFeatures.includes('round-borders');

    // Apply round-borders class if needed
    if (this.roundBorders && !this.currentCaption) {
      this.classList.add('round-borders');
    } else {
      this.classList.remove('round-borders');
    }

    // Set initial caption
    this.updateCurrentCaption();

    // Wait for layout to complete before measuring
    requestAnimationFrame(() => {
      this.cropImages();

      // Set up size change detection
      this._resizeObserver = new ResizeObserver(() => {
        this.cropImages();
      });
      this._resizeObserver.observe(this);
    });

    // Detect if mobile device and set up touch events
    this.isMobileDevice = detectMobileDevice();

    if (this.isMobileDevice) {
      this.addEventListener('touchstart', this.handleTouchStart, {
        passive: false,
      });
      this.addEventListener('touchmove', this.handleTouchMove, {
        passive: false,
      });
      this.addEventListener('touchend', this.handleTouchEnd, {
        passive: false,
      });
    }

    // Add resize listener
    this._boundHandleResize = this.handleResize;
    window.addEventListener('resize', this._boundHandleResize);

    // Check if we need to restart slideshow (in case of rapid reconnection)
    // Use a small delay to allow the component to stabilize
    setTimeout(() => {
      this.checkAndRestartSlideshow();
    }, 100);
  }

  /**
   * Lifecycle method called when the element is removed from the DOM
   * Cleans up intervals and event listeners
   */
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.clearInterval();

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    if (this.isMobileDevice) {
      this.removeEventListener('touchstart', this.handleTouchStart);
      this.removeEventListener('touchmove', this.handleTouchMove);
      this.removeEventListener('touchend', this.handleTouchEnd);
    }

    // Remove the fullsize click handlers only if fullsize is enabled
    if (this.fullSize) {
      this.removeFullsizeClickHandlers();
    }

    // Remove bound event listeners
    if (this._boundHandleResize) {
      window.removeEventListener('resize', this._boundHandleResize);
      this._boundHandleResize = null;
    }
    if (this._boundPauseSlideshow) {
      this.removeEventListener('mouseenter', this._boundPauseSlideshow);
      this._boundPauseSlideshow = null;
    }
    if (this._boundResumeSlideshow) {
      this.removeEventListener('mouseleave', this._boundResumeSlideshow);
      this._boundResumeSlideshow = null;
    }
  }

  private clearInterval() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Lifecycle method called before each update
   * Handles changes to reactive properties
   */
  override willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('dataFeatures')) {
      this.debugLog('dataFeatures changed', {
        oldValue: changedProperties.get('dataFeatures'),
        newValue: this.dataFeatures,
      });

      this.debugLog('dataFeatures updated', {
        dataFeatures: this.dataFeatures,
        includesFullsize: this.dataFeatures.includes('fullsize'),
      });

      // Update fullSize property
      const wasFullSize = this.fullSize;
      this.fullSize = this.dataFeatures.includes('fullsize');

      this.debugLog('Fullsize state changed', {
        wasFullSize,
        newFullSize: this.fullSize,
      });

      // Handle fullsize feature changes
      if (wasFullSize !== this.fullSize) {
        if (this.fullSize) {
          this.initFullSize();
          this.debugLog('Fullsize feature enabled');
        } else {
          this.removeFullsizeClickHandlers();
          this.debugLog('Fullsize feature disabled');
        }
      }

      // Reinitialize slideshow config
      this.initSlidesShowConfig();

      // Update roundBorders
      this.roundBorders = this.dataFeatures.includes('round-borders');
      if (this.roundBorders && !this.currentCaption) {
        this.classList.add('round-borders');
      } else {
        this.classList.remove('round-borders');
      }
    }
  }

  /**
   * Lifecycle method called after the element's first render
   * Initializes features that require the DOM to be rendered
   */
  override firstUpdated() {
    this.isMobileDevice = detectMobileDevice();

    if (this.slidesShowConfig.enabled) {
      this.attachSlideshowStyles();
      this.initSlideshowInterval();
    }

    if (this.fullSize) {
      this.initFullSize();
    }

    this.preventImageDrag();
    this.requestUpdate();
  }

  /**
   * Renders the component template
   * @returns The component's HTML template
   */
  override render() {
    return html`
      <div class="image-container">
        <slot @slotchange=${this.handleSlotChange}></slot>
        ${this.slidesShowConfig.showArrows && this.slidesShowConfig.enabled && !this.isMobileDevice
          ? html`
              <div class="navigation-arrows">
                <button class="arrow-button prev" @click=${this.prevSlide}>&lt;</button>
                <button class="arrow-button next" @click=${this.nextSlide}>&gt;</button>
              </div>
            `
          : ''}
        ${this.slidesShowConfig.showIndicators && this.slidesShowConfig.enabled
          ? html` <div class="indicators">${this.renderIndicators()}</div> `
          : ''}
        ${this.slidesShowConfig.enabled && this.isPaused
          ? html`
              <div class="pause-indicator">
                <div class="pause-icon"></div>
              </div>
            `
          : ''}
      </div>
      <div class="caption-container">
        <div class="caption">${this.currentCaption || ''}</div>
      </div>
    `;
  }

  /**
   * Handles changes to the slotted content
   * Updates crop data, captions, and reinitializes features
   */
  handleSlotChange = () => {
    this.childDataCrop = [];
    Array.from(this.children).forEach((child, index) => {
      this.childDataCrop[index] = cssToJson(child?.getAttribute('data-crop') || '');
    });

    this.cropImages();
    this.updateCurrentCaption();
    this.preventImageDrag();

    if (this.slidesShowConfig.enabled) {
      this.attachSlideshowStyles();
    }

    // Reinitialize fullsize feature if enabled
    if (this.fullSize) {
      // Remove old handlers and add new ones for any new images
      this.removeFullsizeClickHandlers();
      this.addFullsizeClickHandlers();
    }
  };

  /**
   * Updates the current caption based on the active slide or first image
   */
  updateCurrentCaption() {
    if (this.slidesShowConfig.enabled) {
      const activeSlide = this.querySelector('img.active') as HTMLImageElement;
      if (activeSlide) {
        this.currentCaption = activeSlide.getAttribute('data-caption') || '';
        return;
      }
    }

    // For non-slideshow, just get the first image's caption
    const firstImg = this.querySelector('img') as HTMLImageElement;
    if (firstImg) {
      this.currentCaption = firstImg.getAttribute('data-caption') || '';
    }
  }

  /**
   * Initializes slideshow configuration based on data-features
   */
  initSlidesShowConfig() {
    // Check if slideshow is enabled
    this.slidesShowConfig.enabled = this.dataFeatures.includes('slideshow');

    if (!this.slidesShowConfig.enabled) {
      // Check if there are multiple images and auto-enable slideshow
      const imageCount = Array.from(this.children).filter(
        (child) => child instanceof HTMLImageElement || child.tagName.toLowerCase() === 'img',
      ).length;

      if (imageCount > 1) {
        this.slidesShowConfig.enabled = true;
        this.dataFeatures.push('slideshow');
        this.dataFeatures.push('arrows');
        this.dataFeatures.push('indicators');
      } else {
        return;
      }
    }

    // Set default values
    this.slidesShowConfig.interval = this.interval || defaultSlideshowInterval;
    this.slidesShowConfig.pauseOnHover = !this.dataFeatures.includes('dont-pause-on-hover');

    // Set transition effect TODO: Right now it looks always the same - it does not change with different values.
    const transition = SlideShowTransitions.find((t) => this.dataFeatures.includes(t));
    this.slidesShowConfig.transition = transition || 'fade';

    // Set UI options
    this.slidesShowConfig.showArrows = this.dataFeatures.includes('arrows');
    this.slidesShowConfig.showIndicators = this.dataFeatures.includes('indicators');

    // Set roundBorders based on data-features
    this.roundBorders = this.dataFeatures.includes('round-borders');
  }

  /**
   * Initializes the fullsize view functionality for images
   */
  initFullSize() {
    this.debugLog('Initializing fullsize feature');

    // Remove any existing click handlers from images
    this.removeFullsizeClickHandlers();

    // Add click handlers with a small delay to ensure images are loaded
    setTimeout(() => {
      this.addFullsizeClickHandlers();
      this.debugLog('Fullsize click handlers added to images (delayed)');
    }, 100);
  }

  /**
   * Adds click handlers to all images for fullsize functionality
   */
  private addFullsizeClickHandlers() {
    const images = Array.from(this.querySelectorAll('img'));
    this.debugLog('Adding click handlers to images', {
      imageCount: images.length,
      fullSize: this.fullSize,
      dataFeatures: this.dataFeatures,
    });

    if (images.length === 0) {
      this.debugLog('No images found in component');
      return;
    }

    // Wait for all images to be loaded
    const imagePromises = images.map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Also resolve on error to not block
      });
    });

    Promise.all(imagePromises).then(() => {
      this.debugLog('All images loaded, adding click handlers');

      images.forEach((img, index) => {
        // Remove any existing click handler first
        img.removeEventListener('click', this.handleFullsizeClick);

        // Add the click handler
        img.addEventListener('click', this.handleFullsizeClick, {
          capture: true,
        });

        // Test if the click handler is actually attached
        const hasListener = img.onclick !== null || img.hasAttribute('onclick');
        this.debugLog(`Added click handler to image ${index}`, {
          src: img.src,
          hasListener: hasListener,
          imgOnClick: img.onclick,
          imgHasOnclickAttr: img.hasAttribute('onclick'),
          imgComplete: img.complete,
          imgNaturalWidth: img.naturalWidth,
          imgNaturalHeight: img.naturalHeight,
        });

        // Add a test click handler to see if clicks are being captured at all
        img.addEventListener(
          'click',
          (e) => {
            this.debugLog('Test click detected on image', {
              src: img.src,
              event: e,
            });
          },
          { capture: true },
        );
      });
    });
  }

  /**
   * Removes click handlers from all images
   */
  private removeFullsizeClickHandlers() {
    const images = Array.from(this.querySelectorAll('img'));
    images.forEach((img) => {
      img.removeEventListener('click', this.handleFullsizeClick);
    });
  }

  /**
   * Handles click events for fullsize view
   */
  private handleFullsizeClick = (event: MouseEvent) => {
    // The target should always be an image since we're adding the listener directly to images
    const target = event.target as HTMLImageElement;

    event.stopPropagation();
    this.debugLog('Image clicked for fullsize view', {
      src: target.src,
      fullSize: this.fullSize,
    });

    // Call onImageClick callback if provided
    if (this.onImageClick) {
      this.onImageClick(target, event);
      this.debugLog('onImageClick callback called');
    }

    // For slideshow, use the active image; otherwise use the clicked image
    let img: HTMLImageElement;
    if (this.slidesShowConfig.enabled) {
      img = (this.querySelector('img.active') as HTMLImageElement) || target;
      this.debugLog('Using active slide for fullsize view', {
        src: img.src,
      });
    } else {
      img = target;
      this.debugLog('Using clicked image for fullsize view', {
        src: img.src,
      });
    }

    if (img) {
      this.isFullSizeActive = true;
      this.debugLog('Setting isFullSizeActive to true');

      if (this.slidesShowConfig.enabled) {
        this.pauseSlideshow();
      }

      const onClose = () => {
        this.isFullSizeActive = false;
        this.debugLog('Fullsize view closed');
        if (this.onFullscreenExit) {
          this.onFullscreenExit(img);
          this.debugLog('onFullscreenExit callback called');
        }
        if (this.slidesShowConfig.enabled) {
          this.resumeSlideshow();
        }
      };

      // Check if we have multiple images to determine if navigation should be enabled
      const imageCount = Array.from(this.children).filter(
        (child) => child instanceof HTMLImageElement || child.tagName.toLowerCase() === 'img',
      ).length;

      const hasNavigation = imageCount > 1;

      this.debugLog('Calling createFullsizeView', {
        imgSrc: img.src,
        isMobileDevice: this.isMobileDevice,
        hasNavigation: hasNavigation,
        imageCount: imageCount,
        hasOnNext: !!this.handleFullscreenNext,
        hasOnPrev: !!this.handleFullscreenPrev,
      });

      createFullsizeView(
        img,
        this.isMobileDevice,
        onClose,
        hasNavigation ? this.handleFullscreenNext : undefined,
        hasNavigation ? this.handleFullscreenPrev : undefined,
        this._instanceId,
      );

      if (this.onFullscreenEnter) {
        this.onFullscreenEnter(img);
        this.debugLog('onFullscreenEnter callback called');
      }
    } else {
      this.debugLog('No image found for fullsize view');
    }
  };

  /**
   * Attaches slideshow styles to the document and initializes the first slide
   */
  attachSlideshowStyles() {
    // Add active class to first image
    const firstImg = Array.from(this.children).find((child) => child instanceof HTMLImageElement) as
      | HTMLImageElement
      | undefined;

    if (firstImg) {
      firstImg.classList.add('active');
    }

    // For slideshow styles, we need to add global styles
    const styleId = `${this._instanceId}-slideshow-styles`;
    if (!document.getElementById(styleId)) {
      const globalStyle = document.createElement('style');
      globalStyle.id = styleId;
      globalStyle.textContent = getSlideshowStyles(this.slidesShowConfig.transition);
      document.head.appendChild(globalStyle);
    }

    // Add slideshow class to host
    this.classList.add('slideshow');

    // Ensure fullsize click handlers are added to all images
    if (this.fullSize) {
      this.addFullsizeClickHandlers();
    }
  }

  /**
   * Initializes the slideshow interval and pause/resume behavior
   */
  initSlideshowInterval() {
    this.clearInterval();

    const interval = this.slidesShowConfig.interval || defaultSlideshowInterval;

    // Reset progress
    this.slideProgress = 0;

    // Create a more frequent interval for smooth progress updates
    const progressUpdateInterval = 50; // Update every 50ms for smooth animation
    const progressIncrement = (progressUpdateInterval / interval) * 100;

    this._intervalId = window.setInterval(() => {
      // Check if component is still connected to DOM
      if (!this.isConnected) {
        this.debugLog('Component disconnected, clearing interval');
        this.clearInterval();
        return;
      }

      if (!this.isPaused) {
        this.slideProgress += progressIncrement;

        if (this.slideProgress >= 100) {
          this.slideProgress = 0;
          this.debugLog('Slideshow advancing to next slide');
          this.nextSlide();
        }

        this.requestUpdate();
      }
    }, progressUpdateInterval);

    if (this.slidesShowConfig.pauseOnHover) {
      this._boundPauseSlideshow = this.pauseSlideshow;
      this._boundResumeSlideshow = this.resumeSlideshow;
      this.addEventListener('mouseenter', this._boundPauseSlideshow);
      this.addEventListener('mouseleave', this._boundResumeSlideshow);
    }
  }

  /**
   * Advances to the next slide in the slideshow
   */
  nextSlide = () => {
    // Reset progress
    this.slideProgress = 0;

    const activeSlide = this.querySelector('img.active');
    if (!activeSlide) {
      return;
    }

    const nextSlide = activeSlide.nextElementSibling || this.querySelector('img:first-child');
    if (nextSlide) {
      activeSlide.classList.remove('active');
      nextSlide.classList.add('active');

      // Update caption when slide changes
      this.updateCurrentCaption();

      // Call onSlideChange callback if provided
      if (this.onSlideChange) {
        const index = Array.from(this.querySelectorAll('img')).indexOf(nextSlide as HTMLImageElement);
        this.onSlideChange(index, nextSlide as HTMLImageElement);
      }
    }

    // After updating the active slide, request an update to refresh indicators
    this.requestUpdate();
  };

  /**
   * Goes to the previous slide in the slideshow
   */
  prevSlide = () => {
    // Reset progress
    this.slideProgress = 0;

    const activeSlide = this.querySelector('img.active');
    if (!activeSlide) {
      return;
    }

    const prevSlide = activeSlide.previousElementSibling || this.querySelector('img:last-child');
    if (prevSlide) {
      activeSlide.classList.remove('active');
      prevSlide.classList.add('active');

      // Update caption when slide changes
      this.updateCurrentCaption();

      // Call onSlideChange callback if provided
      if (this.onSlideChange) {
        const index = Array.from(this.querySelectorAll('img')).indexOf(prevSlide as HTMLImageElement);
        this.onSlideChange(index, prevSlide as HTMLImageElement);
      }
    }

    // After updating the active slide, request an update to refresh indicators
    this.requestUpdate();
  };

  /**
   * Pauses the slideshow
   */
  private pauseSlideshow = () => {
    this.isPaused = true;
    const activeImage = this.querySelector('img.active') as HTMLImageElement;
    if (activeImage && this.onSlideshowPause) {
      this.onSlideshowPause(activeImage);
    }
    this.requestUpdate();
  };

  /**
   * Resumes the slideshow
   */
  private resumeSlideshow = () => {
    if (this.isFullSizeActive) {
      return;
    }

    this.isPaused = false;
    const activeImage = this.querySelector('img.active') as HTMLImageElement;
    if (activeImage && this.onSlideshowResume) {
      this.onSlideshowResume(activeImage);
    }
    this.requestUpdate();
  };

  /**
   * Applies cropping to all images based on crop data
   */
  cropImages() {
    const children = Array.from(this.children) as HTMLElement[];

    children.forEach((child, index) => {
      if (!(child instanceof HTMLImageElement)) {
        return;
      }

      const cropData = {
        ...this.globalDataCrop,
        ...this.childDataCrop[index],
      };

      const referenceSize = {
        width: `${this.offsetWidth}px`,
        height: `${this.offsetHeight}px`,
      };

      cropImage(child, cropData, referenceSize);
    });
  }

  /**
   * Renders the indicator dots for the slideshow
   * @returns Array of indicator elements
   */
  renderIndicators() {
    const images = Array.from(this.querySelectorAll('img'));
    return images.map((_, index) => {
      const isActive = index === this.getCurrentSlideIndex();
      return html`
        <div class="indicator-container">
          <div class="indicator ${isActive ? 'active' : ''}" @click=${() => this.goToSlide(index)}>
            ${isActive
              ? html`
                  <div
                    class="progress-bar ${this.isPaused ? 'paused' : ''}"
                    style="width: ${this.slideProgress}%"
                  ></div>
                `
              : ''}
          </div>
        </div>
      `;
    });
  }

  /**
   * Gets the index of the currently active slide
   * @returns The index of the active slide
   */
  getCurrentSlideIndex() {
    const images = Array.from(this.querySelectorAll('img'));
    const activeSlide = this.querySelector('img.active');
    return images.indexOf(activeSlide as HTMLImageElement);
  }

  /**
   * Navigates to a specific slide by index
   * @param index The index of the slide to display
   */
  goToSlide(index: number) {
    // Reset progress
    this.slideProgress = 0;

    const images = Array.from(this.querySelectorAll('img'));
    const activeSlide = this.querySelector('img.active');

    if (activeSlide) {
      activeSlide.classList.remove('active');
    }

    if (images[index]) {
      images[index].classList.add('active');
      this.updateCurrentCaption();
    }

    // Reset interval
    if (this._intervalId !== null) {
      this.clearInterval();
      this.initSlideshowInterval();
    }
  }

  /**
   * Handles touch start events for swipe detection
   * @param e The touch event
   */
  private handleTouchStart(e: TouchEvent) {
    // Don't handle touch events when in fullscreen mode
    if (this.isFullSizeActive) return;

    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  /**
   * Handles touch end events for swipe detection
   * @param e The touch event
   */
  private handleTouchEnd(e: TouchEvent) {
    // Don't handle touch events when in fullscreen mode
    if (this.isFullSizeActive) return;

    // Only proceed if slideshow is enabled
    if (!this.slidesShowConfig.enabled) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const xDiff = this.touchStartX - touchEndX;
    const yDiff = this.touchStartY - touchEndY;

    // Only handle horizontal swipes that are more significant than vertical movement
    // This prevents conflict with page scrolling
    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
      e.preventDefault();
      if (xDiff > 0) {
        // Swipe left, go to next slide
        this.nextSlide();
      } else {
        // Swipe right, go to previous slide
        this.prevSlide();
      }
    }
  }

  /**
   * Handles touch move events for swipe detection
   * @param e The touch event
   */
  private handleTouchMove = (e: TouchEvent) => {
    // Don't handle touch events when in fullscreen mode
    if (this.isFullSizeActive) return;

    if (!this.isSwiping) return;

    this.touchEndX = e.touches[0].clientX;
    this.touchEndY = e.touches[0].clientY;

    const xDiff = this.touchStartX - this.touchEndX;
    const yDiff = this.touchStartY - this.touchEndY;

    // Only handle horizontal swipes
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      e.preventDefault();
      this.swipeDistance = xDiff;

      // Update image position during swipe
      if (this.isFullSizeActive) {
        const fullscreenImg = document.querySelector(
          `.nte-fullsize-image[data-instance="${this._instanceId}"]`,
        ) as HTMLImageElement;
        if (fullscreenImg) {
          fullscreenImg.style.transform = `translateX(${xDiff}px)`;
        }
      }
    }
  };

  /**
   * Handles next slide navigation in fullscreen mode
   */
  private handleFullscreenNext = () => {
    // Check if we have multiple images (slideshow enabled or multiple images present)
    const imageCount = Array.from(this.children).filter(
      (child) => child instanceof HTMLImageElement || child.tagName.toLowerCase() === 'img',
    ).length;

    if (imageCount > 1) {
      this.nextSlide();
      const activeImg = this.querySelector('img.active') as HTMLImageElement;
      if (activeImg) {
        const fullscreenImg = document.querySelector(
          `.nxa-fullsize-image[data-instance="${this._instanceId}"]`,
        ) as HTMLImageElement;
        const fullscreenBg = document.querySelector(
          `.nxa-fullsize-bg[data-instance="${this._instanceId}"]`,
        ) as HTMLDivElement;
        if (fullscreenImg && fullscreenBg) {
          fullscreenImg.style.transition = 'transform 0.3s ease-out';
          fullscreenImg.src = activeImg.src;
          fullscreenBg.style.backgroundImage = `url(${activeImg.src})`;
          setTimeout(() => {
            fullscreenImg.style.transition = '';
          }, 300);
        }
      }
    }
  };

  /**
   * Handles previous slide navigation in fullscreen mode
   */
  private handleFullscreenPrev = () => {
    // Check if we have multiple images (slideshow enabled or multiple images present)
    const imageCount = Array.from(this.children).filter(
      (child) => child instanceof HTMLImageElement || child.tagName.toLowerCase() === 'img',
    ).length;

    if (imageCount > 1) {
      this.prevSlide();
      const activeImg = this.querySelector('img.active') as HTMLImageElement;
      if (activeImg) {
        const fullscreenImg = document.querySelector(
          `.nxa-fullsize-image[data-instance="${this._instanceId}"]`,
        ) as HTMLImageElement;
        const fullscreenBg = document.querySelector(
          `.nxa-fullsize-bg[data-instance="${this._instanceId}"]`,
        ) as HTMLDivElement;
        if (fullscreenImg && fullscreenBg) {
          fullscreenImg.style.transition = 'transform 0.3s ease-out';
          fullscreenImg.src = activeImg.src;
          fullscreenBg.style.backgroundImage = `url(${activeImg.src})`;
          setTimeout(() => {
            fullscreenImg.style.transition = '';
          }, 300);
        }
      }
    }
  };

  /**
   * Handles window resize events to update mobile detection
   */
  private handleResize = () => {
    // Update mobile device detection on resize
    this.isMobileDevice = detectMobileDevice();
  };

  /**
   * Checks if the slideshow needs to be restarted due to rapid reconnection
   */
  private checkAndRestartSlideshow() {
    // If slideshow is enabled but no interval is running, restart it
    if (this.slidesShowConfig.enabled && this._intervalId === null) {
      this.initSlideshowInterval();
    }
  }

  /**
   * Prevents default drag behavior for images
   */
  private preventImageDrag() {
    const images = Array.from(this.querySelectorAll('img'));
    images.forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-image': NteImage;
  }
}
