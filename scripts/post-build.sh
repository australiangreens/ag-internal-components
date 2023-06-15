#!/bin/sh

AUG_OUT="dist/index.d.ts"


# Copy contents of all augmentation declaration files to the build directory.
# For example, AgThemeProvider adds a variant to Typography and uses this in its
# custom theme. Consumers of the library need a copy of the augmentation.
echo "Prepending augmentations to $AUG_OUT"
mv $AUG_OUT "$AUG_OUT.bak"
echo "// --- BEGIN AUGMENTATIONS SECTION ---" > $AUG_OUT
i=0
find src -type f -name "augmentations.d.ts" | while read file
do
  echo -n "  $file"
  if [ $i -gt 0 ]; then echo "\n" >> $AUG_OUT; fi
  echo -n "// From $i: $file" >> $AUG_OUT
  # Remove comments before including file
  sed '/^[[:blank:]]*\/\//d;s/\/\/.*//' $file >> $AUG_OUT
  echo "Done"
  i=$(($i+1))
done
echo "// --- END AUGMENTATIONS SECTION ---\n" >> $AUG_OUT

cat "$AUG_OUT.bak" >> $AUG_OUT