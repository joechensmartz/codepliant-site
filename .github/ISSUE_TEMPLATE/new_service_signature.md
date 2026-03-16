---
name: New Service Signature
about: Propose a new service detection signature
title: "[Signature] "
labels: signature
assignees: ""
---

## Service name

The name of the service or SDK (e.g., "Stripe", "Datadog", "OpenAI").

## Category

Which category does this service belong to?

- [ ] ai
- [ ] payment
- [ ] analytics
- [ ] auth
- [ ] email
- [ ] database
- [ ] storage
- [ ] monitoring
- [ ] advertising
- [ ] social
- [ ] other

## Is this a data processor?

Does this service process end-user data on behalf of the application? (If yes, it will appear in generated compliance documents. If no, it will appear in scan output only.)

- [ ] Yes — third-party data processor
- [ ] No — utility / dev tool only

## Data collected

What personal or user data does this service typically collect or process?

- e.g., email address, IP address, usage analytics, payment info

## Detection patterns

### Package / dependency names

```
e.g., @stripe/stripe-js, stripe
```

### Import patterns

```
e.g., from "stripe", import stripe
```

### Environment variable patterns

```
e.g., STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
```

### Code patterns (optional)

Any other code patterns that indicate usage of this service.

```
e.g., new Stripe(, stripe.customers.create
```

## Ecosystems

Which ecosystems use this service?

- [ ] JavaScript / TypeScript
- [ ] Python
- [ ] Go
- [ ] Ruby
- [ ] Elixir

## Evidence

Link to the service's documentation showing what data it collects, or describe how you know.

## Additional context

Any other relevant details (e.g., multiple SDKs for the same service, related services).
