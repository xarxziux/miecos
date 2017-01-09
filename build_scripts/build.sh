#!/bin/bash

function action {
    "$@"
    local status=$?
    if [ $status -ne 0 ]
    then
        echo "Error with $1" >&2
    fi
    return $status
}

baseFile=".src/0_base/miecos.ts"
tscFile=".src/1_tsc/miecos.js"
bfFile=".src/2_browserified/miecos.by.js"
ugFile=".src/3_uglified/miecos.uy.js"
outFile="./bin/miecos.js"

buildNum="$(<build_number)"
((buildNum++))
echo -n $buildNum > build_number

while true
do
    
    if [ $baseFile -ot $outFile ]
    then
        echo Source file is up-to-date.
        echo
        break
    fi
    
    tsc
    
    if [ $? -ne 0 ]
    then
        break;
    fi
    
    jshint $tscFile
    
    if [ $? -ne 0 ]
    then
        break;
    fi
    
    browserify $tscFile -o $bfFile
    
    if [ $? -ne 0 ]
    then
        break;
    fi
    
    uglifyjs $bfFile -c -m -o $ugFile
    
    if [ $? -ne 0 ]
    then
        break;
    fi
    
    cp -v $ugFile $outFile
    
    echo 
    echo Compilation successful.  Please enter a commit message.
    echo An empty string skips this step:
    read -p "> " commitMsg
    
    if [ $? -ne 0 ] || [ -z "$commitMsg" ]
    then
        break;
    fi
    
    versionNum="$(npm list --depth=0 | \
            grep miecos | \
            grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
    commitStr="$versionNum.$buildNum: $commitMsg"
    npm --no-git-tag-version version patch
    git add -A
    git commit -m "$commitStr"
    break
    
done

# Empty echo to avoid NPM having fits if the last action returned an error
echo 
