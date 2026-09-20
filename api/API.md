# REST API contract

## Current demo endpoint

`GET https://open.er-api.com/v6/latest/INR`

The response is JSON with a `rates` object. The app uses INR as its display currency and shows USD, EUR, and GBP conversions, with loading and explicit unavailable states.

## Production adapter

```text
getLatestRates(base: string): Promise<{ rates: Record<string, number> }>
```

Keep API keys out of the client. If a paid provider is selected, call it from a serverless function, validate the upstream response, set a short cache, and return only supported currencies.
