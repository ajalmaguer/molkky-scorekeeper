#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# uncomment for first time deploy
# git init
# git checkout -b main
git add -A
git commit -m 'deploy'

git push -f git@github.com:ajalmaguer/molkky-scorekeeper.git main:gh-pages

cd -