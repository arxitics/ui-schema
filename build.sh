#!/bin/bash

# change to project directory
cd "$(dirname $0)/"

# copyright Information
version="0.4.1"
copyright="/*! UI Schema v$version | (c) 2016 Arxitics | MIT license */"
echo "current version: v$version"

# Minify CSS files
echo "minifying ui-schema.css ..."
cd css
rm ../dist/ui-schema*.min.css
cssfile="../dist/ui-schema-$version.min.css"
cleancss --s0 import.css --skip-advanced --output $cssfile
echo "$copyright" | cat - $cssfile > tmp.css && mv tmp.css $cssfile
echo "done"

# Minify JS files
echo "minifying ui-schema.js ..."
cd ../js
rm ../dist/ui-schema*.min.js
jsfile="../dist/ui-schema-$version.min.js"
find ui-schema.js -delete
cat setup.js core.js forms.js utilities.js icons.js >> ui-schema.js
uglifyjs --mangle --output $jsfile ui-schema.js
echo "$copyright" | cat - $jsfile > tmp.js && mv tmp.js $jsfile
echo "done"
