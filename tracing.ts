export type Trace = {
  name: string;
  // startTimeMs: number;
  // endTimeMs: number;
  durationMs: number;
};

export class Tracer {
  private traces: Trace[] = [];

  public flushTraces() {
    const traces = this.traces;
    this.traces = [];
    return traces;
  }

  private currentTimeMs() {
    return performance.now();
  }

  public wrap<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTimeMs = this.currentTimeMs();
    return fn().finally(() => {
      const endTimeMs = this.currentTimeMs();
      const durationMs = endTimeMs - startTimeMs;
      this.traces.push({
        name,
        // startTimeMs,
        // endTimeMs,
        durationMs,
      });
    });
  }
}
