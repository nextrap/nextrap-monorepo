export type SlideShowConfig = {
  enabled?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  transition?: string;
  showThumbnails?: boolean;
  showArrows?: boolean;
  showIndicators?: boolean;
  showCaptions?: boolean;
};

export const SlideShowTransitions = ['fade', 'slide', 'blend'];

export const defaultSlideshowInterval = 5000;
