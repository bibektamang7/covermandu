import * as Sentry from "@sentry/bun";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1.0,
	enabled: true,
	sendDefaultPii: true,
	denyUrls: [/^\/health/, /.*\/healthcheck/],
});

export default Sentry;
