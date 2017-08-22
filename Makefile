clean: 
	rm -r _site/
setup:
	mkdir -p _site

docs-build:
	mkdir -p _site/docs/
	jekyll build --source static/src/docs/ --destination _site/docs/

build: clean setup docs-build
	gulp build

serve: build
	spark -address localhost -port 8080 _site

deploy: build
	./deploy.sh
