# Domain Vocabulary Format

The domain model lives in a `## Domain Vocabulary` section of `.pipeline/REQUIREMENTS.md`.

## Structure

```md
## Domain Vocabulary

{One or two sentences on what this domain is and why it exists.}

**Order**:
A customer's request for goods, accepted but not yet fulfilled.
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight.** One or two sentences max. Define what it IS, not what it does.
- **Only include terms specific to this project's domain.** General programming concepts (timeouts, error types, utility patterns) don't belong even if the project uses them extensively. Before adding a term, ask: is this a concept unique to this domain, or a general programming concept? Only the former belongs.
- **No implementation details.** Table names, class names, transport choices, and library names belong elsewhere in `REQUIREMENTS.md` or in an ADR.
- **Group terms under subheadings** when natural clusters emerge. If all terms belong to a single cohesive area, a flat list is fine.

## Multiple contexts

Most projects have one cohesive domain and need only a flat list. When a project spans several distinct contexts that use the same words differently, group terms under a `###` subheading per context and add a short relationships block so the seams between them are explicit:

```md
## Domain Vocabulary

### Ordering
Receives and tracks customer orders.

**Order**: ...

### Billing
Generates invoices and processes payments.

**Invoice**: ...

### Context relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced`; Fulfillment consumes it to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched`; Billing consumes it to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

When several contexts exist, infer which one the current topic relates to before adding a term. If unclear, ask. The same word appearing under two contexts with two definitions is legitimate — that is the point of separating them — but it must be deliberate, not accidental drift.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
