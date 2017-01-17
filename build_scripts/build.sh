#!/bin/bash

set -e

base_file="./src/0_base/miecos.ts"
tsc_file="./src/1_tsc/miecos.js"
bf_file="./src/2_browserified/miecos.by.js"
ug_file="./src/3_uglified/miecos.uy.js"
out_file="./bin/miecos.js"

build_num="$(<build_number)"
build_num=$((buildNum + 1))
echo -n "${build_num}" > build_number

if test "${base_file}" -ot "${out_file}"
then
    echo Source file is up-to-date.
    echo
    break
fi

tsc
jshint "${tsc_file}"
browserify "${tsc_file}" -o "${bf_file}"
uglifyjs "${bf_file}" -c -m -o "${ug_file}"
cp -v "${ug_file} "${out_file}

echo 
echo Compilation successful.  Please enter a commit message.
echo An empty string skips this step:
read -p "> " commit_msg

if test -z "${commit_msg}"
then
    exit
fi

version_num="$(npm list --depth=0 | \
        grep miecos | \
        grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
commit_str="${version_num}.${build_num}: $commit_msg"
npm --no-git-tag-version version patch
git add -A
git commit -m "${commitStr}"
