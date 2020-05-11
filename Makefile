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
	git rev-parse HEAD > "./_site/.well-known/dev-git-commit.hash"

build: build-shared
	gulp build --stripe_public_key=pk_live_yCL9ECfmHrdkm7gZqaf4sKWr
	git rev-parse HEAD > "./_site/.well-known/git-commit.hash"

serve: watch
	cd ./_site/ && python -m SimpleHTTPServer

deploy-dev: build-dev
	netlify deploy -d ./_site/ -s 5230beee-1833-4822-bd0a-65c811df8185

deploy: build
	netlify deploy -d ./_site/ -s 5230beee-1833-4822-bd0a-65c811df8185 --prod
