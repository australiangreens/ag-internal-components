#!/bin/sh

AUG_OUT="dist/index.d.ts"
INDEX_TMP="$AUG_OUT.orig.tmp"

# Copy contents of all augmentation declaration files to the build directory.
# For example, AgThemeProvider adds a variant to Typography and uses this in its
# custom theme. Consumers of the library need a copy of the augmentation.
echo "Prepending augmentations to $AUG_OUT"
mv $AUG_OUT "$INDEX_TMP"
echo "// --- BEGIN AUGMENTATIONS SECTION ---" > $AUG_OUT
i=0
find src -type f -name "augmentations.d.ts" | while read file
do
  echo -n "  $file"
  if [ $i -gt 0 ]; then echo "\n" >> $AUG_OUT; fi
  echo -n "// From $i: $file" >> $AUG_OUT
  # Remove comments before including file
  sed '/^[[:blank:]]*\/\//d;s/\/\/.*//' $file >> $AUG_OUT
  i=$(($i+1))
  echo " ✓"
done
echo "// --- END AUGMENTATIONS SECTION ---\n" >> $AUG_OUT

cat "$INDEX_TMP" >> $AUG_OUT
rm "$INDEX_TMP"

echo ""