#!/bin/sh

view_list="01NYU_AD-AD 01NYU_AD-AD_DEV \
01NYU_INST-NYU 01NYU_INST-NYU_DEV 01NYU_INST-TESTWS01 \
01NYU_NYHS-NYHS 01NYU_NYHS-NYHS_DEV \
01NYU_US-SH 01NYU_US-SH_DEV"

for view in $view_list
do
  if ! test -e primo-customization/$view/css/custom.css; then
    echo "Missing custom.css for view '$view'; aborting!"
    exit 1
  fi
  echo "Verified existence of custom.css for view '$view'"
done
