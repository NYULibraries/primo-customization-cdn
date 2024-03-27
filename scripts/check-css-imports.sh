#!/bin/bash -e

base_dir="primo-customization"

resolve_import_path() {
    local import_path=$1
    local file_dir=$2

    # Skip external URLs
    if [[ "$import_path" =~ ^https?:// ]]; then
        return 0
    fi

    local full_path=$(realpath -- "$file_dir/$import_path" 2>/dev/null)

    if [[ ! -f "$full_path" ]]; then
        echo "Error: Unresolved @import '$import_path' in $file_dir" >&2
        return 1
    fi
    return 0
}

# First, find all CSS files in css subdirectories
# Then, check if they contain @import or @import url() statements before processing further
find "$base_dir" -type f -path "*/css/*.css" -print0 | while IFS= read -r -d '' file; do
    if grep -qE "@import (url\()?['\"]?([^'\"\)]+)['\"]?\)?;" "$file"; then
        # File contains @import, process it
        file_dir=$(dirname "$file")

        grep -oE "@import (url\()?['\"]?([^'\"\)]+)['\"]?\)?;" "$file" | while read -r import_line; do
            # Extract the actual path
            import_path=$(echo "$import_line" | sed -E "s/@import (url\()?['\"]?([^'\"\);]+)['\"]?\)?;?/\2/")
            # Check if the extracted path resolves
            if ! resolve_import_path "$import_path" "$file_dir"; then
                exit 1
            else
                echo "Resolved @import '$import_path' in $file_dir"
            fi
        done
    fi
done


