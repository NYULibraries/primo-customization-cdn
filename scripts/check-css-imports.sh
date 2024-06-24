#!/bin/bash -e

base_dir="primo-customization"
regexImportString="@import (url\()?['\"]?([^'\"\)]+)['\"]?\)?;"

# The regex pattern covers the following:
#   @import 'path/to/file';
#   @import "path/to/file";
#   @import url('path/to/file');
#   @import url("path/to/file");
#   @import url(path/to/file);

resolve_import_path() {
    local import_path=$1
    local file_dir=$2

    # Skip external URLs
    # Bash regex =~ operator
    # https://stackoverflow.com/questions/19441521/bash-regex-operator
    if [[ "$import_path" =~ ^https?:// ]]; then
        return 0
    fi
    # realpath to obtain the absolute path of a file via Shell
    # https://stackoverflow.com/questions/3915040/how-to-obtain-the-absolute-path-of-a-file-via-shell-bash-zsh-sh
    local full_path=$(realpath -- "$file_dir/$import_path" 2>/dev/null)

    # https://www.gnu.org/software/bash/manual/html_node/Redirections.html
    if [[ ! -f "$full_path" ]]; then
        echo "Error: Unresolved @import '$import_path' in $file_dir" >&2
        return 1
    fi
    return 0
}

# First, find all CSS files in css subdirectories
# Then, check if they contain @import or @import url() statements before processing further
# meaning of -print0:
# https://stackoverflow.com/questions/56221518/whats-meaning-of-print0-in-following-command
# while IFS= read -r -d $'' file ... explanation:
# https://stackoverflow.com/questions/18217930/while-ifs-read-r-d-0-file-explanation#comment26704801_18217930
# read -r -d '' file flags: https://linuxcommand.org/lc3_man_pages/readh.html
find "$base_dir" -type f -path "*/css/*.css" -print0 | while IFS= read -r -d '' file; do
    if grep -qE "$regexImportString" "$file"; then
        # File contains @import, process it
        file_dir=$(dirname "$file")

        grep -oE "$regexImportString" "$file" | while read -r import_line; do
            # Extract the actual path
            import_path=$(echo "$import_line" | sed -E "s/$regexImportString/\2/")
            # Check if the extracted path resolves
            if ! resolve_import_path "$import_path" "$file_dir"; then
                exit 1
            else
                echo "Resolved @import '$import_path' in $file_dir"
            fi
        done
    fi
done


