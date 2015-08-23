#!/bin/sh

npm run dist
git add dist
git commit -m "Generate dist"

git checkout gh-pages
git rebase master

npm run exampleBasic
npm run exampleReact
git add -f examples/basic/app.bundle.js
git add -f examples/react/app.bundle.js
git commit -m "Publish examples"

git checkout master

git push --all
