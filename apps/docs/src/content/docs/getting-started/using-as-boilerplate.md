---
title: Using as a Living Boilerplate
description: Learn how to use this repository as a living base for your projects and keep receiving updates.
---

This repository is designed to function as a **living boilerplate**, not as a one-time use template. A project can be created from this repository (for example, using "Use this template" or cloning it and uploading it to a new repo) without preserving the complete Git history of the boilerplate. However, it's still possible to continue receiving future improvements (auth, i18n, layout, global configuration, tooling, etc.) by adding this repository as an additional remote (`boilerplate`).

## Recommended Workflow

### 1. Add the Boilerplate as a Remote

After creating your project from this boilerplate, add it as a remote to keep receiving updates:

```bash
git remote add boilerplate <url-of-this-repo>
git fetch boilerplate
```

Replace `<url-of-this-repo>` with the actual URL of this repository (e.g., `https://github.com/sisques-labs/saas-boilerplate.git`).

### 2. First Merge (Initial Integration)

The first time you integrate changes from the boilerplate, you need to use the `--allow-unrelated-histories` flag because both repositories don't share history:

```bash
git merge boilerplate/main --allow-unrelated-histories
```

This flag is necessary only for the first merge. After this initial merge, subsequent merges work in a standard way.

### 3. Future Updates

To receive future updates from the boilerplate:

```bash
git fetch boilerplate
git merge boilerplate/main
```

You can also create a branch to review changes before merging:

```bash
git fetch boilerplate
git checkout -b update-from-boilerplate
git merge boilerplate/main
# Review changes, test, then merge to your main branch
```

## Best Practices

To avoid conflicts and maintain a clean integration with the boilerplate, follow these guidelines:

### ✅ Do

- **Develop only new functionality** within domain folders or `features/`
- **Keep core and cross-cutting layers** (auth, i18n, layout, configuration, and shared packages) as **exclusive property of the boilerplate**
- **Use Git for all updates** - all updates should be done via Git to maintain structural coherence and traceability
- **Review changes** before merging updates from the boilerplate
- **Test thoroughly** after merging updates to ensure compatibility

### ❌ Don't

- **Avoid copying and pasting code manually** - this breaks the connection with the boilerplate
- **Don't modify core layers** - changes to auth, i18n, layout, or configuration should come from the boilerplate
- **Don't remove boilerplate remotes** - keep the connection to receive updates

## Conflict Resolution

If you encounter conflicts when merging updates from the boilerplate:

1. **Review the conflicts carefully** - understand what changed in both repositories
2. **Prioritize boilerplate changes** for core layers (auth, i18n, layout, configuration)
3. **Preserve your custom functionality** in domain/feature folders
4. **Test thoroughly** after resolving conflicts
5. **Document any custom modifications** that deviate from the boilerplate

## Example: Updating Authentication

If the boilerplate receives an authentication update:

```bash
# Fetch latest changes
git fetch boilerplate

# Create a branch to review
git checkout -b update-auth
git merge boilerplate/main

# If conflicts occur, resolve them prioritizing boilerplate changes
# Test the authentication flow
# Merge to main when ready
git checkout main
git merge update-auth
```

## Troubleshooting

### Merge conflicts in core files

If you have conflicts in core files (auth, i18n, etc.), it's likely because you've modified them. Consider:

- Reverting your changes and using the boilerplate version
- Documenting why you need custom modifications
- Creating feature flags or configuration options instead of modifying core files directly

### Unrelated histories error

If you see "fatal: refusing to merge unrelated histories" after the first merge, you may have removed the boilerplate remote. Re-add it:

```bash
git remote add boilerplate <url-of-this-repo>
git fetch boilerplate
```

## Summary

Using this boilerplate as a living base allows you to:

- ✅ Start your project quickly
- ✅ Keep receiving improvements and updates
- ✅ Maintain structural coherence
- ✅ Focus on your business logic while the boilerplate handles infrastructure

Remember: the boilerplate is designed to evolve, and your project can evolve with it through proper Git integration.
