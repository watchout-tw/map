#!/bin/bash
npm install babel-plugin-transform-es2015-destructuring

npm install babel-plugin-transform-es2015-template-literals
babel --plugins transform-es2015-template-literals src/count.js --out-file build/count.js
babel --plugins transform-es2015-template-literals src/region.js --out-file build/region.js
babel --plugins transform-es2015-template-literals src/world.js --out-file build/world.js
