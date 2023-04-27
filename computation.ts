import { trace, context } from "@opentelemetry/api";
import type { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { Tracer } from "./tracing";

export async function computation({
  tracer,
  provider,
}: {
  tracer: Tracer;
  provider: NodeTracerProvider;
}) {
  const otelTracer = provider.getTracer("tracer");
  await tracer.wrap("computation", async () => {
    const parentSpan = otelTracer.startSpan(`computation`);
    const ctx = trace.setSpan(context.active(), parentSpan);
    for (let i = 0; i < 10000; i++) {
      const innerSpan = await otelTracer.startSpan(
        `function ${i}`,
        undefined,
        ctx
      );
      innerSpan.end();
      if (i % 1000 === 0) {
        await provider.forceFlush();
      }
    }
    parentSpan.end();
  });
}
