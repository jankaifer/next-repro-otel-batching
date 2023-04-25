import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

import { computation } from "./computation";
import { Tracer } from "./tracing";

export async function Component({ batched }: { batched: boolean }) {
  const tracer = new Tracer();

  const processor = batched ? BatchSpanProcessor : SimpleSpanProcessor;

  let sdk;
  tracer.wrap("initialize", async () => {
    sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "next-app",
      }),
      spanProcessor: new processor(new OTLPTraceExporter()),
    });
    sdk.start();
  });

  await computation({ tracer });

  tracer.wrap("shutdown", async () => {
    await sdk.shutdown();
  });

  const traces = tracer.flushTraces();
  return (
    <div>
      Finished: <pre>{JSON.stringify(traces, null, 2)}</pre>
    </div>
  );
}
