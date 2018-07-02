verify-versions:
	./check_jekyll.sh
	
clean: 
	rm -rf _site/
	rm -rf static/src/docs/_site
	rm -rf static/src/blog/_site
	
setup:
	mkdir -p _site

jekyll-build:
	mkdir -p static/src/docs/_site
	mkdir -p _site/docs/
	jekyll build --source static/src/docs/ --destination static/src/docs/_site/ --incremental

	mkdir -p static/src/blog/_site
	mkdir -p _site/blog/
	jekyll build --source static/src/blog/ --destination static/src/blog/_site/ --incremental

watch: clean setup jekyll-build
	jekyll build --source static/src/docs/ --destination static/src/docs/_site/ --incremental --watch &
	jekyll build --source static/src/blog/ --destination static/src/blog/_site/ --incremental --watch &
	gulp watch --stripe_public_key=pk_test_tzn5fi8nBXyoUxADinXwZ0pM &

build-shared: clean verify-versions setup jekyll-build

build-dev: build-shared
	gulp build --stripe_public_key=pk_test_tzn5fi8nBXyoUxADinXwZ0pM

build: build-shared
	gulp build --stripe_public_key=pk_live_yCL9ECfmHrdkm7gZqaf4sKWr

serve: watch
	spark -address localhost -port 1234 _site

deploy-dev: build-dev
	s3cmd sync "./_site/." s3://www-dev.krypt.co

deploy: build
	s3cmd sync "./_site/." s3://www.krypt.co
