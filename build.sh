#!/bin/bash

# change to project directory
cd "$(dirname $0)/"

# copyright Information
version="0.4.2"
copyright="/*! UI Schema v$version | (c) 2016 Arxitics | MIT license */"
echo "current version: v$version"

# Minify CSS files
echo "minifying ui-schema.css ..."
cd css
rm ../dist/ui-schema*.css
cssdist="../dist/ui-schema-$version.css"
cssfile="../dist/ui-schema-$version.min.css"
cat base.css core.css grid.css navigation.css menus.css typography.css forms.css tables.css images.css icons.css colors.css effects.css shapes.css events.css mobile.css print.css pages.css utilities.css variables.css >> $cssdist
cleancss --s0 import.css --skip-advanced --output $cssfile
echo "$copyright" | cat - $cssfile > tmp.css && mv tmp.css $cssfile
echo cat $cssfile | openssl dgst -sha384 -binary | openssl enc -base64 -A
echo "\ndone"

# Minify JS files
echo "minifying ui-schema.js ..."
cd ../js
rm ../dist/ui-schema*.js
jsdist="../dist/ui-schema-$version.js"
jsfile="../dist/ui-schema-$version.min.js"
cat setup.js core.js forms.js utilities.js icons.js >> $jsdist
uglifyjs --compress --mangle --output $jsfile $jsdist
echo "$copyright" | cat - $jsfile > tmp.js && mv tmp.js $jsfile
echo cat $jsfile | openssl dgst -sha384 -binary | openssl enc -base64 -A
echo "\ndone"
