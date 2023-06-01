#!/bin/sh

# The $1 arg is the path to the temporarty file that contains the commit message

echo -n "Validating commit message..."

# Check #1: ensure jira tag is present
# ! You'll likely want to change this to the exact tag for the project or remove
if !(grep -q -i -E '^\[[A-Z]+-[0-9]+\]|^\[no-jira\] ' $1); then
    echo "Error: commit msg must start with JIRA task ref or \"no-jira\" in square brackets e.g. \"[LIST-123] foobar\" or \"[no-jira] \""
    exit 1
fi

# Check #2: ...

# Check #3: ...

echo "Done"


exit 0
