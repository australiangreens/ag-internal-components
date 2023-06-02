#!/bin/sh

echo -n "Running eslint on staged files..."
if !(yarn lint-staged); then
    echo "Error: eslint failed"
    exit 1
fi
echo "Done"


# Using ideas from here, but adapted to Jest.
# https://helloacm.com/the-git-pre-commit-hook-to-avoid-pushing-only-unit-tests-in-nodejs/
echo -n "Confirming no '.only' tests..."
if test $(git diff --cached | grep -E "\b(it|describe|test|concurrent).only\(|\b(fit|fdescribe)\("  | wc -l) != 0; then
    echo "Error: no 'only' tests can be committed to source."
    exit 1
fi
echo "Done"

exit 0
