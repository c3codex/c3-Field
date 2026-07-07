# unDrifted Issue Registry — Index

Index of all unDrifted editorial issues. Full metadata for each issue lives in its own `issueNN.meta.md` file under `Assets/Issues/unDrifted/IssueNN/`. This index tracks status only.

| issue_id | issue_number | title | status | is_active | current_route | archive_route | meta_path |
|---|---|---|---|---|---|---|---|
| `undrifted_issue01` | 01 | Issue 01 — AI Isn't Broken. Systems Are. | active | true | /undrifted | /undrifted/issue-01 | Assets/Issues/unDrifted/Issue01/issue01.meta.md |

## Rule

Exactly one row should have `is_active: true` at any time. When a new issue opens:
1. Add its row here with `is_active: true`.
2. Flip the previous active issue's row to `status: archived`, `is_active: false`.
3. Update the corresponding `issueNN.meta.md` files to match.
