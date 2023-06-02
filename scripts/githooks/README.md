# Git Hooks

These are scripts called by yarn scripts which are called by husky scripts.

E.g. `/husky/pre-push` => `yarn prepush` => `/githooks/pre-push.sh`

We could have just put them in .husky directly, but this way you can manually
run them from a yarn context like `yarn prepush`, which is sometimes useful to
check things before doing the actual push.
