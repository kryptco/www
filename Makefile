clean: 
	rm -r _site/
setup:
	mkdir -p _site

docs-build:
	rm -r static/src/docs/_site
	mkdir -p static/src/docs/_site
	mkdir -p _site/docs/
	jekyll build --source static/src/docs/ --destination static/src/docs/_site/

watch: build
	jekyll build --source static/src/docs/ --destination static/src/docs/_site/ --watch &
	gulp watch &

build: clean setup docs-build
	gulp build

serve: watch
	spark -address localhost -port 8080 _site

deploy: build
	./deploy.sh
