#!/bin/bash

# change to the jade directory
cd "$(dirname $0)/jade"

# generate compiled html
jade index.jade --pretty --out ../html
jade css.jade --pretty --out ../html
jade javascript.jade --pretty --out ../html
jade examples.jade --pretty --out ../html
jade download.jade --pretty --out ../html
jade structure.jade --pretty --out ../html
jade template.jade --pretty --out ../html
jade notes.jade --pretty --out ../html
jade ./css --pretty --out ../html/css
jade ./javascript --pretty --out ../html/javascript
jade ./examples --pretty --out ../html/examples
cd ../html
rm css/modules.html
rm javascript/components.html
rm examples/contents.html
