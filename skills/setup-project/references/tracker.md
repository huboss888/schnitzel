# Tracker operations

Shared dependency for `write-prd`, `pr`, and `review`. Resolve the installed `setup-project` skill by name if it is not a sibling directory. Read project coding guidance for the selected provider, host, repository, remote, and branch. An explicit task target wins only when its relationship to the project is clear; resolve conflicting targets before any write.

Use the selected host's authenticated CLI and inspect its installed `--help` before relying on flags. Do not replace a GitLab issue with a GitHub issue merely because `gh` is present. CLI readiness and repository read access are checked by `setup-project/scripts/check-project.mjs`; writes still depend on the account's actual permissions.

## Read and resolve

| Operation | GitHub | GitLab |
| --- | --- | --- |
| Authentication | `gh auth status --hostname <host>` | `glab auth status --hostname <host>` |
| Project metadata | `gh api --hostname <host> --method GET repos/<owner>/<repo>` | `glab api --hostname <host> --method GET projects/<URL-encoded-project-path>` |
| Issue | `gh issue view <number> --repo <host/owner/repo>` | `glab issue view <iid> --repo <project-URL>` |
| Search issues | `gh issue list --repo <host/owner/repo> --search <terms> --state all` | `glab issue list --repo <project-URL> --search <terms> --all` |
| Labels | `gh label list --repo <host/owner/repo>` | `glab label list --repo <project-URL>` |
| Request metadata | `gh pr view <number> --repo <host/owner/repo>` | `glab mr view <iid> --repo <project-URL>` |
| Request diff | `gh pr diff <number> --repo <host/owner/repo>` | `glab mr diff <iid> --repo <project-URL>` |

For GitLab APIs, encode the entire namespace/project path as one segment, including every slash. Preserve subgroup paths. On self-hosted servers, select the confirmed API host explicitly. For an issue/MR IID, always pair it with its project; a bare number is not globally unique. Check pagination when searching existing objects.

## Multiline writes

Prepare the exact Markdown in a temporary UTF-8 file outside tracked source. Pass argument arrays or properly quoted shell arguments, never an interpolated body. Current CLIs support these shapes; check local help first:

```text
gh issue create --repo <host/owner/repo> --title <title> --body-file <file>
glab issue create --repo <project-URL> --title <title> --description-file <file> --yes

gh pr create --repo <host/owner/repo> --head <source-branch> --base <base> --title <title> --body-file <file>
glab mr create --repo <project-URL> --source-branch <source> --target-branch <base> --title <title> --description-file <file> --yes

gh pr edit <number> --repo <host/owner/repo> --title <title> --body-file <file>
glab mr update <iid> --repo <project-URL> --title <title> --description-file <file>
```

For fork publication, resolve the actual head project and use the host's supported head selector; do not infer it from the branch name. Commit and push explicitly before creating the request. Avoid convenience flags that silently push or fill prose from commits.

If the installed CLI lacks a body-file flag, use its documented structured API with a serializer and input file, after confirming that API's fields. Do not replace a missing flag with fragile multiline shell interpolation. For review posting, use `gh pr review` for a requested GitHub review or `glab mr note create` (or the installed version's equivalent) for a requested GitLab discussion comment, with the supported body/input option. Preserve the requested comment/review scope and approval state.

Before creation, check for duplicates or a prior result. After creation/update, read back the URL, project, content, state, and revision. On a timeout or ambiguous response, reconcile remote state before another write. Retry once only when absence and a correctable cause are established; report uncertainty when they are not. Do not automatically create labels, assign people, merge, or enable auto-merge.

Use `Closes #<issue-number>` only for a fully resolved issue in the same project; otherwise use a normal issue link. Cross-project references, target-branch behavior, and GitLab closing patterns are host/project-specific. Verify the actual configuration before promising automatic closure.

Official command references: [GitHub CLI](https://cli.github.com/manual/), [GitLab CLI](https://docs.gitlab.com/cli/).
