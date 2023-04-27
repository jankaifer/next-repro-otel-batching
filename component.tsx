import { OTLPTraceExporter as HttpOTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPTraceExporter as GrpcOTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";

import { computation } from "./computation";
import { Tracer } from "./tracing";

type ProcessorType = "batched" | "simple";
type ExporterType = "console" | "http" | "grpc";

export const Component: (props: {
  processorType: ProcessorType;
  exporterType: ExporterType;
}) => JSX.Element = (async ({ processorType, exporterType }) => {
  const tracer = new Tracer();

  const processorClass = {
    batched: BatchSpanProcessor,
    simple: SimpleSpanProcessor,
  }[processorType];
  const exporterClass = {
    console: ConsoleSpanExporter,
    http: HttpOTLPTraceExporter,
    grpc: GrpcOTLPTraceExporter,
  }[exporterType];

  let provider: NodeTracerProvider;
  await tracer.wrap("initialize", async () => {
    provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: `next-app-${processorType}-${exporterType}`,
      }),
    });
    provider.addSpanProcessor(new processorClass(new exporterClass()));
  });

  await computation({ tracer, provider });

  await tracer.wrap("shutdown", async () => {
    await provider.forceFlush();
    await provider.shutdown();
  });

  const traces = tracer.flushTraces();
  return (
    <div>
      <div>
        This demo created 10k spans with the following configuration:{" "}
        {JSON.stringify({ processorType, exporterType }, null, 2)}
      </div>
      Finished: <pre>{JSON.stringify(traces, null, 2)}</pre>
    </div>
  );
}) as any;
