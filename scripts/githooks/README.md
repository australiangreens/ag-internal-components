# Git Hooks

These are scripts called by pnpm scripts which are called by husky scripts.

E.g. `/husky/pre-push` => `pnpm prepush` => `/githooks/pre-push.sh`

We could have just put them in .husky directly, but this way you can manually
run them from a pnpm context like `pnpm prepush`, which is sometimes useful to
check things before doing the actual push.
