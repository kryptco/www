setup:
	mkdir -p _site

docs-build:
	cd static/src/docs/ && jekyll build

docs-watch:
	cd static/src/docs/ && jekyll build --watch &

watch: docs-watch
	gulp watch

build: setup docs-build
	gulp build

serve:
	cd _site && gost 

deploy: build
	./deploy.sh
