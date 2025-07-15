export class Debouncer {
  private timeout: NodeJS.Timeout | null = null;
  private startTimeWithMs = 0;

  /**
   *
   * @param delay     Debounce delay in milliseconds
   * @param max_delay Maximum delay in milliseconds, if false then no maximum delay is applied
   */
  constructor(
    private delay: number,
    private max_delay: number | false = false,
  ) {}

  public async wait() {
    if (this.startTimeWithMs === 0) {
      this.startTimeWithMs = Date.now();
    }
    if (this.timeout) {
      if (this.max_delay === false || this.startTimeWithMs + this.max_delay > Date.now()) {
        clearTimeout(this.timeout);
      }
    }
    return new Promise((resolve) => {
      this.timeout = setTimeout(() => {
        this.startTimeWithMs = 0; // Reset start time after the wait is complete
        resolve(true);
      }, this.delay);
    });
  }

  public debounce(callback: () => void) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      callback();
    }, this.delay);
  }
}
