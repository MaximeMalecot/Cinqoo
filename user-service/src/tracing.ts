import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import {
  NodeTracerProvider,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrismaInstrumentation } from '@prisma/instrumentation';

/* OpenTelemetry Service Base config */
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.npm_package_name,
  [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
});

/* OpenTelemetry Instrumentations */
const provider = new NodeTracerProvider({
  resource,
});

const exporter = new OTLPTraceExporter({
  url: process.env.TRACER_ENDPOINT,
});

const processor = new SimpleSpanProcessor(exporter);

provider.addSpanProcessor(processor);
provider.register();

registerInstrumentations({
  instrumentations: [
    new NestInstrumentation(),
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-express': {
        requestHook: (span, reqInfo) => {
          console.log(reqInfo, span);
          span.setAttribute(
            'request-headers',
            JSON.stringify(reqInfo.request.headers),
          );
        },
      },
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
    new PrismaInstrumentation(),
  ],
});

/* OpenTelemetry Tracing */
// // gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  provider
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
