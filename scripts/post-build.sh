#!/bin/sh

AUGMENTATIONS_OUT="dist/augmentations.d.ts"

# Copy contents of all augmentation declaration files to the build directory.
# For example, AgThemeProvider adds a variant to Typography and uses this in its
# custom theme. Consumers of the library need a copy of the augmentation.
rm -f $AUGMENTATIONS_OUT
echo "// This file is a combination of all module augumentations across the library" > $AUGMENTATIONS_OUT
echo "// See https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation" >> $AUGMENTATIONS_OUT
echo "" >> $AUGMENTATIONS_OUT
i=0
find src -type f -name "augmentations.d.ts" | while read file
do
  echo "Adding $file to $AUGMENTATIONS_OUT"
  if [ $i -gt 0 ]; then echo "\n" >> $AUGMENTATIONS_OUT; fi
  echo "// FILE $i: $file" >> $AUGMENTATIONS_OUT
  # Remove comments before including file
  sed '/^[[:blank:]]*\/\//d;s/\/\/.*//' $file >> $AUGMENTATIONS_OUT

  i=$(($i+1))
done


