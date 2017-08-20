docs-build:
	cd static/src/docs/ && jekyll build

build: docs-build
	gulp build
