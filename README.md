# krypt.co web
A simple static site to serve the krypt.co website. Built with `gulp` as the build system and `jekyll` for the krypt.co docs sub-site.

# Build the project
## Dependencies
- Jekyll: `sudo gem install jekyll`
- Gulp: `npm install gulp-cli -g`
- node_modules: `npm install`

## Build the site
`make build`

## Run the site locally
`make serve`

Depends on simple web server: `go get github.com/rif/spark`

# Development
## Main Site
Edit files in `static/src/*`

## Docs
Edit files in `static/src/docs/*`
See the [Docs ReadMe](https://github.com/kryptco/krwww/static/src/docs/README.md).

# Deployment
`make deploy`