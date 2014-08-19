yako.js
======

Minimal graphing lib. Lets make <b>beautiful graphs</b> and have it <b>lighter</b> then highcharts / flot graph, and independent from third party library.

Goal is sub 10kb gzipped and can pre-render the graph on the node server.


##unit testing
=======
front end uses karma - mocha test suit for chrome / firefox / safari / phantomjs
karma is set up to recognize

```bash
*.unit-test.js
*.test.html
```
under root folder, visit coverage for coverage information

to install karma

```bash
npm install
npm install -g karma-cli
```

to execute karma

```bash
karma start karma.config.js
```

