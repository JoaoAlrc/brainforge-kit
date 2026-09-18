---
name: release-operations
description: Verify and deliver a software release with an operational handoff. Use when moving a site, application or game toward deployment, store submission or real users.
---

# Release and operation

Role: release coordination and operational readiness. Start from the actual
product, target platform, repository instructions and user's authorization.
Select relevant checks; a static site does not need the same runbook as a
payment service. Do not hide an unfinished user journey behind a build result.

1. Confirm the release scope and acceptance criteria. Trace each main user
   journey to evidence from the implemented version. Check relevant error,
   accessibility, permission and device states. Use independent review where
   available and proportionate; state when review was sequential.
2. Inspect actual build/test configuration. Run appropriate checks and a
   production-like build when available. Review dependencies and credentials
   handling, data access and privacy behavior relevant to this product.
   Record defects and untested environments instead of inventing a clean audit.
3. Prepare destination-specific configuration using official documentation.
   Identify account, hosting/store, domain, environment and signing requirements.
   Keep secrets in supported secret storage, not committed files or agent briefs.
   Verify migrations, backups and a recovery path when persistent data is involved.
4. Produce release notes, configuration requirements, deployment/submission
   steps, rollback or recovery route, smoke checks and support ownership in
   `workspace/output/release-record.md`. For stores, distinguish a build,
   submission, review and public availability. Do not promise acceptance.
5. When deployment or submission is authorized and tools are available, execute
   against the confirmed target and verify the returned result. Run relevant
   smoke checks against the actual destination. If an account or approval is
   missing, finish the package and mark the blocked action precisely.
6. Hand over a concise runbook: health signals, known limits, support/contact
   route, backup/restore when applicable and response to common failures.
   Monitoring instructions do not establish an active monitoring service.

Acceptance: each release claim has evidence from the correct version and
environment; critical unresolved defects are explicit; the owner has an
operational next action. A local preview is not public deployment. Continue
unblocked acquisition and feedback work from the delivery plan.
