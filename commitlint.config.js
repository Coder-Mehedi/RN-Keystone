// Conventional Commits: "feat(auth): add refresh flow", "fix: handle timeout", "docs: ...".
// The type is required; the scope is optional. This keeps the history greppable and lets a
// changelog be generated from it later.
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
