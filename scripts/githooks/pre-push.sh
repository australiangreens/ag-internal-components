#!/bin/sh

verbose() {
  test "$VERBOSE" = "1"
}

# 4. RUN TESTS
if verbose; then
  echo "<test:coverage>"
  pnpm test:coverage || { echo "Error: tests failed"; exit 1; }
  echo "</test:coverage>"
else
  echo "Running test:coverage..."
  pnpm test:coverage || { echo "Error: tests failed"; exit 1; }

  # Echoing done here is not needed
  # echo "Done"
fi