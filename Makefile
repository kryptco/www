clean: 
	rm -rf _site/
	rm -rf static/src/docs/_site
	rm -rf static/src/jobs/_site

setup:
	mkdir -p _site

docs-build:
	mkdir -p static/src/docs/_site
	mkdir -p _site/docs/
	jekyll build --source static/src/docs/ --destination static/src/docs/_site/ --incremental

jobs-build:
	mkdir -p static/src/jobs/_site
	mkdir -p _site/jobs/
	jekyll build --source static/src/jobs/ --destination static/src/jobs/_site/ --incremental

watch: clean setup docs-build jobs-build
	jekyll build --source static/src/docs/ --destination static/src/docs/_site/ --incremental --watch &
	jekyll build --source static/src/jobs/ --destination static/src/jobs/_site/ --incremental --watch &
	gulp watch &

build: clean setup docs-build jobs-build
	gulp build

serve: watch
	spark -address localhost -port 8080 _site

deploy: build
	./deploy.sh
