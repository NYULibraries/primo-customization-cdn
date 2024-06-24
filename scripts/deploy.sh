#!/bin/bash -e

DEV_S3_URI='s3://cdn-dev.library.nyu.edu'
PROD_S3_URI='s3://cdn.library.nyu.edu'

if [ -z "$1" ]
then
  echo "Usage: "
  echo "To deploy primo-customization-cdn resources to a given cdn environment"
  echo " $0 <environment>"
  exit
fi

# get env from argument and set s3 uri
env=$1
if [[ "$env" == "dev" || "$env" == "test" ]]
then
  s3_uri=$DEV_S3_URI
elif [[ "$env" == "prod" ]]
then
  s3_uri=$PROD_S3_URI
else
  echo "Error: Invalid environment \"$env\""
  exit 1
fi

# get subdirs (views) to copy
view_dir='primo-customization'
common_subdir='00_common'
test_subdir='01NYU_INST-TESTWS01'
if [[ "$env" == "dev" ]]
then
  subdirs=`ls "$view_dir" | grep -v "$common_subdir" | grep -v "$test_subdir" | grep '_DEV$'`
elif [[ "$env" == "prod" ]]
then
  subdirs=`ls "$view_dir" | grep -v "$common_subdir" | grep -v "$test_subdir" | grep -v '_DEV$'`
elif [[ "$env" == "test" ]]
then
  subdirs=$test_subdir
fi
subdirs="$common_subdir $subdirs"

# sync files, deleting any removed
for dir in $subdirs
do
  echo "Deploying primo-customization/$dir => $s3_uri/primo-customization/$dir"
  # Note that `aws s3 sync ... --exact-timestamps` only works for downloads from S3,
  # not uploads: https://github.com/aws/aws-cli/issues/4460.  The only safe way
  # to update is to upload absolutely everything using `cp` and then deleting
  # removed files using `sync --delete`.  There are many other open GitHub issues
  # related to this behavior.  Here's another: https://github.com/aws/aws-cli/issues/3273.
  aws s3 cp --recursive primo-customization/$dir $s3_uri/primo-customization/$dir
  aws s3 sync --delete primo-customization/$dir $s3_uri/primo-customization/$dir
done
