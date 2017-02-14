#!/bin/bash

set -e

base_file="./src/0_base/miecos.js"
# tsc_file="./src/1_tsc/miecos.js"
bf_file="./src/2_browserified/miecos.by.js"
# ug_file="./src/3_uglified/miecos.uy.js"
out_file="./bin/miecos.js"

modules=( \
    "./src/0_base/canvas.js" \
    "./src/0_base/config.js" \
    "./src/0_base/entities.js" \
    "./src/0_base/utils.js" \
)

build_num="$(<build_number)"
build_num=$((buildNum + 1))
echo -n "${build_num}" > build_number

if test "${base_file}" -ot "${out_file}"
then
    echo Source file is up-to-date.
    echo
    exit
fi

# tsc
for x in ${modules[@]}
do
    jshint ${x}
done
jshint "${base_file}"
browserify "${base_file}" --standalone miecos -o "${bf_file}"
# uglifyjs "${bf_file}" -c -m -o "${ug_file}"
cp -v "${bf_file}" "${out_file}"

echo 
echo Compilation successful.  Please enter a commit message.
echo An empty string skips this step:
read -p "> " commit_msg

if test -z "${commit_msg}"
then
    git add -A
    exit 0
fi

version_num="$(cat package.json | \
        grep version | \
        grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
commit_str="${version_num}.${build_num}: ${commit_msg}"
npm --no-git-tag-version version patch
git add -A
git commit -m "${commit_str}"
exit 0

