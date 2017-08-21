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
	spark -address localhost -port 8080 _site

deploy: build
	./deploy.sh
