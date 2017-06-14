#!/bin/bash
npm install babel-plugin-transform-es2015-destructuring

npm install babel-plugin-transform-es2015-template-literals
npm install babel-plugin-transform-object-assign
npm install babel-plugin-transform-es2015-arrow-functions
babel --plugins=transform-es2015-template-literals,transform-object-assign,transform-es2015-arrow-functions src/count.js --out-file build/count.js
babel --plugins=transform-es2015-template-literals,transform-object-assign,transform-es2015-arrow-functions src/region.js --out-file build/region.js
babel --plugins=transform-es2015-template-literals,transform-object-assign,transform-es2015-arrow-functions src/world.js --out-file build/world.js
