Put markdown articles in `static/src/docs/_posts`.

Generate a new article by running:
```ruby 
ruby static/src/docs/bin/jekyll-page "The Page Title" category
```

where `category` is one of these: 
```
sections: [
    ['start', 'Get Started'],
    ['tut', 'Tutorials'],
    ['conf', 'Configure']
]
```

