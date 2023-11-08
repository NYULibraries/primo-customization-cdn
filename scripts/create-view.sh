#!/bin/sh -e

: "${CANONICAL_VID?Must specify CANONICAL_VID}"
: "${NEW_VID?Must specify NEW_VID}"

# ensure canonical dir exists
base_dir="primo-customization"
canonical_dir="$base_dir/${CANONICAL_VID/:/-}"
if [ ! -d "$canonical_dir" ]; then
  echo "$canonical_dir does not exist, so CANONICAL_VID=\"$CANONICAL_VID\" is not a pre-existing vid; aborting!"
  exit 1
fi

# ensure new dir doesn't exist
new_hyphenated_vid="${NEW_VID/:/-}"
new_dir="$base_dir/$new_hyphenated_vid"
if [ -d "$new_dir" ]; then
  echo "$new_dir already exists, so NEW_VID=\"$NEW_VID\" cannot be created; aborting!"
  exit 1
fi

# copy all the files, preserving symlinks; don't copy assets, just create empty dir
rsync --archive --exclude assets $canonical_dir/* $new_dir/
mkdir $new_dir/assets
# blank them all out; thanks to https://stackoverflow.com/a/14565002
find $new_dir/ -type f -exec sh -c '> "{}"' \;

# make e2e dirs
mkdir -p "e2e/tests/actual/$new_hyphenated_vid"
mkdir -p "e2e/tests/diffs/$new_hyphenated_vid"
touch "e2e/tests/actual/$new_hyphenated_vid/.gitkeep"
touch "e2e/tests/diffs/$new_hyphenated_vid/.gitkeep"
printf "\n!tests/actual/$new_hyphenated_vid/
tests/actual/$new_hyphenated_vid/*
!tests/actual/$new_hyphenated_vid/.gitkeep
!tests/diffs/$new_hyphenated_vid/
tests/diffs/$new_hyphenated_vid/*
!tests/diffs/$new_hyphenated_vid/.gitkeep\n" >> e2e/.gitignore
printf "\n!tests/actual/$new_hyphenated_vid/
tests/actual/$new_hyphenated_vid/*
!tests/actual/$new_hyphenated_vid/.gitkeep
!tests/diffs/$new_hyphenated_vid/
tests/diffs/$new_hyphenated_vid/*
!tests/diffs/$new_hyphenated_vid/.gitkeep\n" >> e2e/.dockerignore

echo "Success! Created $new_dir based on file structure in $canonical_dir"
