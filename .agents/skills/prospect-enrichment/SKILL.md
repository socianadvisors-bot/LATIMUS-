---
name: prospect-enrichment
description: Enrich imported LATIMUS prospects with company resolution, public company research, provider adapters, evidence, identity matching, company-first caching and explainable contact confidence.
---

- Resolve company before person/contact matching.
- Research each company once per cache window, not once per CSV row.
- Public professional/business data only.
- Do not scrape authenticated LinkedIn, bypass CAPTCHA/anti-bot controls, discover private phone numbers, or probe SMTP mailboxes.
- Separate observed, candidate and inferred emails.
- Generic company emails never become verified individual work emails.
- Retain source URL/type/context/date/confidence.
- Use cancellable, rate-controlled, bounded concurrency.
- Fail closed: false verification is worse than not_found.
