export type SaveStatus = 'saving' | 'saved' | 'failed';

/** At most one in-flight save and one newest pending snapshot. */
export class SaveQueue<T> {
  private write: (value: T) => Promise<void>;
  private notify: (status: SaveStatus, error?: unknown) => void;
  private delay: number;
  private next?: T;
  private hasNext = false;
  private running?: Promise<void>;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(write: (value: T) => Promise<void>, notify: (status: SaveStatus, error?: unknown) => void, delay = 300) {
    this.write = write; this.notify = notify; this.delay = delay;
  }
  get pending(): boolean { return this.hasNext || !!this.running; }
  update(value: T): void {
    this.next = value; this.hasNext = true; this.notify('saving');
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { void this.flush().catch(() => {}); }, this.delay);
  }
  async flush(): Promise<void> {
    if (this.timer) { clearTimeout(this.timer); this.timer = undefined; }
    if (this.running) {
      await this.running;
      if (this.hasNext) return this.flush();
      return;
    }
    if (!this.hasNext) return;
    const value = this.next as T;
    this.next = undefined; this.hasNext = false;
    this.running = (async () => {
      try {
        // Yield before invoking the adapter, including adapters that throw synchronously.
        await Promise.resolve().then(() => this.write(value));
        if (!this.hasNext) this.notify('saved');
      } catch (error) {
        // Keep the newest edits on failure, rather than restoring an older snapshot.
        if (!this.hasNext) { this.next = value; this.hasNext = true; }
        this.notify('failed', error); throw error;
      } finally { this.running = undefined; }
    })();
    await this.running;
    if (this.hasNext) return this.flush();
  }
}
