import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

import { computation } from "./computation";
import { Tracer } from "./tracing";

export const Component: (props: { batched: boolean }) => JSX.Element = (async ({
  batched,
}) => {
  const tracer = new Tracer();

  const processor = batched ? BatchSpanProcessor : SimpleSpanProcessor;
  // const exporter = new ConsoleSpanExporter();
  const exporter = new OTLPTraceExporter();

  let provider: NodeTracerProvider;
  await tracer.wrap("initialize", async () => {
    provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "next-app",
      }),
    });
    provider.addSpanProcessor(new processor(exporter));

    provider.register();
  });

  await computation({ tracer });

  await tracer.wrap("shutdown", async () => {
    provider.shutdown();
  });

  const traces = tracer.flushTraces();
  return (
    <div>
      Finished: <pre>{JSON.stringify(traces, null, 2)}</pre>
    </div>
  );
}) as any;
