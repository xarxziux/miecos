#!/bin/bash

# Stop on error
set -e

# Declare the basic files
base_file="./src/0_base/miecos.js"
bf_file="./src/2_browserified/miecos.by.js"
out_file="./bin/miecos.js"
test_file="./src/test/test.js"

# Declare all the modules used
modules=( \
    "./src/0_base/canvas.js" \
    "./src/0_base/config.js" \
    "./src/0_base/entities.js" \
    "./src/0_base/utils.js" \
)

# Variable for detecting file updates
file_change=0

# First test the main source file and all
# modules to see if they've been updated
if test "${base_file}" -nt "${out_file}"
then
    file_change=1
else
    for x in "${modules[@]}"
    do
        if test "${x}" -nt "${out_file}"
        then
            file_change=1
            break
        fi
    done
fi

# If they have, display a message and exit the script
if test "${file_change}" -eq 0
then
    echo Source files all up-to-date.
    echo
    exit 0
fi

# If not increment the build number
build_num="$(<build_number)"
build_num=$((build_num + 1))
echo -n "${build_num}" > build_number

# Run JSHint on the modules
for x in "${modules[@]}"
do
    jshint "${x}"
done

# Then run the main build process
jshint "${base_file}"
jshint "${test_file}"
node "${test_file}" | tap-dot
browserify "${base_file}" --standalone miecos -o "${bf_file}"
cp -v "${bf_file}" "${out_file}"

# Ask for a commit message
echo 
echo Compilation successful.  Please enter a commit message.
echo An empty string skips this step.
echo Have you updated the Change Log?
read -p "> " commit_msg

# If no commit message, run "git add -A" and exit
if test -z "${commit_msg}"
then
    git add -A
    exit 0
fi

# If there is a commit message, update
# the version number and commit
version_num="$(cat package.json | \
        grep version | \
        grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
commit_str="${version_num}.${build_num}: ${commit_msg}"
npm --no-git-tag-version version patch
git add -A
git commit -m "${commit_str}"
exit 0

