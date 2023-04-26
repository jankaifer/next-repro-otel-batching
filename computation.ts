import { trace } from "@opentelemetry/api";
import { Tracer } from "./tracing";
const tracer = trace.getTracer("otel-batching-component");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const tracesFunction = async (arg: number) => {
  await tracer.startActiveSpan(`function ${arg}`, async (span) => {
    try {
      // Do nothing
    } finally {
      span.end();
    }
  });
};

export async function computation({ tracer }: { tracer: Tracer }) {
  await tracer.wrap("component", async () => {
    for (let i = 0; i < 10000; i++) {
      await tracesFunction(i);
    }
  });
}
