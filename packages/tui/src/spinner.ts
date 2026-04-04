const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export class Spinner {
  private frameIndex = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private message: string;

  constructor(message = 'Thinking...') {
    this.message = message;
  }

  start(): void {
    if (this.interval) return;
    this.frameIndex = 0;
    process.stderr.write('\x1B[?25l'); // hide cursor
    this.interval = setInterval(() => {
      const frame = FRAMES[this.frameIndex % FRAMES.length];
      process.stderr.write(`\r${frame} ${this.message}`);
      this.frameIndex++;
    }, 80);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    process.stderr.write('\r\x1B[K'); // clear line
    process.stderr.write('\x1B[?25h'); // show cursor
  }

  update(message: string): void {
    this.message = message;
  }
}
