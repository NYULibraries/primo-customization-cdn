#!/bin/bash

base_dir="primo-customization"
regexImportString="@import (url\()?['\"]?([^'\"\)]+)['\"]?\)?;"

# The regex pattern covers the following:
#   @import 'path/to/file';
#   @import "path/to/file";
#   @import url('path/to/file');
#   @import url("path/to/file");
#   @import url(path/to/file);

unresolved_errors=()

resolve_import_path() {
    local import_path=$1
    local file_dir=$2
    
    local import_status
    import_status="$import_path in $file_dir/$(basename "$file")"

    # Skip external URLs
    if [[ "$import_path" =~ ^https?:// ]]; then
        return 0
    fi

    local full_path
    full_path=$(realpath -- "$file_dir/$import_path" 2>/dev/null)

    if [[ ! -f "$full_path" ]]; then
        echo "Unresolved @import '$import_status'"
        unresolved_errors+=("$import_status")
        return 0
    fi

    echo "Resolved @import '$import_status'"
    return 0
}

while IFS= read -r file; do
    if grep --quiet --extended-regexp "$regexImportString" "$file"; then
        file_dir=$(dirname "$file")
        while IFS= read -r import_line; do
            import_path=$(echo "$import_line" | sed -E "s/$regexImportString/\2/")
            resolve_import_path "$import_path" "$file_dir"
        done < <(grep --only-matching --extended-regexp "$regexImportString" "$file")
    fi
done < <(find "$base_dir" -type f -path "*/css/*.css")

# Check if there are any unresolved paths
if [[ ${#unresolved_errors[@]} -gt 0 ]]; then
    echo "The following @import paths are unresolved:"
    for unresolved in "${unresolved_errors[@]}"; do
        echo "$unresolved"
    done
    echo "Aborting..."
    exit 1
fi

exit 0
