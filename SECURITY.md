# Security Policy

## Supported versions

| Version / surface | Supported |
| --- | --- |
| Latest `main` (docs, playground, registry source) | ✅ |
| Latest `@intellihelper/cli` on npm | ✅ |
| Older CLI releases | ⚠️ Best-effort only |
| Third-party forks or mirrors | ❌ Report upstream to those maintainers |

This monorepo ships **copy-paste UI components**, a **CLI**, and a **docs/playground** site. Treat installed component source in *your* app as part of your own security surface after install.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

1. Prefer GitHub’s private reporting:
   - [Report a vulnerability](https://github.com/IntelliHelper/IntelliHelper-UI/security/advisories/new)
2. If private reporting is unavailable, open a minimal issue titled
   `Security: private disclosure request` **without** exploit details, and
   maintainers will share a private channel.

Include as much of the following as you can:

- Affected package, path, or URL (e.g. CLI command, playground route, component)
- Version / commit SHA
- Impact (data exposure, RCE, XSS, supply-chain, etc.)
- Steps to reproduce (PoC)
- Any known mitigations

## What to expect

- **Acknowledgement:** within **72 hours** (business days when possible)
- **Status update:** within **7 days** of acknowledgement
- **Fix / advisory:** coordinated when a confirmed issue is in scope

We may ask for more detail or a minimal reproduction. We will credit reporters
who want attribution (unless you request anonymity).

## Scope (examples)

**In scope**

- Remote code execution or arbitrary file write via `@intellihelper/cli`
- XSS or open redirects on `ui.intellihelper.in` (playground / docs)
- Registry or install paths that can serve malicious component payloads from this project’s official hosts
- Secrets leaked in this repository or published packages

**Out of scope**

- Vulnerabilities only present after a consumer heavily modifies installed files
- Issues in third-party dependencies with no practical impact on this project’s usage (report upstream; we will upgrade when fixed)
- Social engineering, physical attacks, or denial-of-service without a security boundary bypass
- Findings that require unrealistic privileges or already-compromised developer machines

## Safe harbor

We support good-faith security research. If you follow this policy, avoid
privacy violations, do not destroy data, and do not degrade our services, we
will not pursue legal action related to your research.

## Hardening tips for consumers

- Pin CLI versions in CI (`npx @intellihelper/cli@x.y.z`) when you need reproducibility
- Review diffs after `add` / `update` before merging component source
- Do not commit secrets; use environment variables for deploy tokens
- Keep Node.js, pnpm, and Next.js on supported releases

Thank you for helping keep Intelli UI and its users safe.
