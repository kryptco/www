# krypt.co's website
A simple static site to serve the krypt.co website. Built with `gulp` as the build system and `jekyll` for the krypt.co docs/blog sub-sites.

# Build the project
## Dependencies
- Jekyll: `sudo gem install jekyll`
- Gulp: `npm install gulp-cli -g`
- node_modules: `npm install`
- Local webserver: `go get github.com/rif/spark`

## Build the site
`make build`

## Run the site locally
`make serve`

# Development
## Main Site
Edit files in `static/src/*`

## Docs
Edit files in `static/src/docs/*`
See the [Docs ReadMe](static/src/docs/README.md).

## Blog
Edit files in `static/src/blog/*`
See the [Blog ReadMe](static/src/blog/README.md).

# Deployment
`make deploy`