# Publishing

## Steps

TODO: Put some of this in a script

1. Ensure the version in package.json is updated and correct.

2. Make the final commit and tag it with the semver preceeded by a "v". E.g.
   version 1.2.4 would be tagged as "v1.2.4"

3. Run `npm publish --access public`. This will do a lint check, run tests, do a production
   build and then publish it to npmjs.com

## Why not yarn publish?

At time of writing, we were primarily using yarn1 rather than yarn2 for most of
our work. The workflow for publishing with yarn1 doesn't fit for us, since it
involves updating the version in the package.json file after your final commit
before publishing. For us it makes more sense to set the version in
package.json, commit it, tag it and then publish it to npm.
