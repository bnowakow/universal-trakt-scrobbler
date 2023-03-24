#!/bin/bash

# for trakt oauth error: https://github.com/trakt-tools/universal-trakt-scrobbler/issues/167

#echo strict-peer-dependencies=false > .npmrc
npm install --global web-ext
npm install -g pnpm
npx browserslist@latest --update-db

rm -rf build
# https://github.com/pugjs/pug-loader/issues/126#issuecomment-796517327
npm install --legacy-peer-deps
npm run build-dev
cd build/firefox/
web-ext build
cd ../../
