# Publishing

## Steps

TODO: Put some of this in a script

1. Ensure the version in package.json is updated and correct.

2. Make the final commit and tag it with the semver preceeded by a "v". E.g.
   version 1.2.4 would be tagged as "v1.2.4"

3. Run `npm publish`. This will do a lint check, run tests, do a production
   build and then publish it to npmjs.com
