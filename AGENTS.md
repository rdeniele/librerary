# Librerary project memory

At the start of every task in this repository:
1. Read `knowledge/INDEX.md` and `knowledge/STATE.md` before planning or editing.
2. Read `knowledge/PRODUCT.md` for product, architecture, research, or scope decisions.
3. Read only the relevant detailed notes and source files. Use `knowledge/MASTER_PROMPT.md` for exact requirements; do not reload it routinely.
4. Verify facts against the current checkout. Notes are navigation aids, not proof that code works. Follow the user's latest instructions when they supersede older requirements.

Before finishing meaningful work:
- Update `knowledge/STATE.md` with actual implementation status, validation results, blockers, and the next actionable step.
- Add durable decisions and their reasons to `knowledge/DECISIONS.md`; distinguish proposals from accepted decisions.
- Append a brief dated entry to `knowledge/LOG.md` with changes, checks, and unresolved issues. Keep STATE concise; move historical detail into LOG.
- Add new topic notes to INDEX only when needed. Link to source files rather than duplicating code or tool output.
- Never record secrets, credentials, private document contents, or unsupported claims. Mark unverified findings explicitly.

This is project-local memory. It works when an agent opens this repository and follows these instructions; it does not provide automatic synchronization across unrelated chats. If instructions cannot be edited, report any stale notes that need updating.
