#!/bin/sh

QUERY_STRING="query=any,contains,qieuwrueqwpRuewpqoewPpqop%3D%3D%3D%3DPppPp@%23$$%25&tab=Unified_Slot&search_scope=DN_and_CI&vid=01NYU_INST:NYU_DEV&offset=0"

while ! curl -f $PLAYWRIGHT_BASE_URL -o /dev/null; do sleep 3; done

# Debug: verbose curl request
# echo "Making verbose curl request to $PLAYWRIGHT_BASE_URL:"
# curl -v $PLAYWRIGHT_BASE_URL 2>&1


exec "$@"

