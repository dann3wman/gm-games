# target: all - Default target. Compile templates, minify JavaScript.
all: clean build-templates build-requirejs

# target: check - Run tests.
check:
	@echo "Tests can only be run from the browser because there is no IndexedDB support elsewhere. To run tests, go to http://BASKETBALL-GM-URL/test in your web browser."

# target: docs - Regenerate documentation from source code using jsdoc-toolkit.
docs:
	rm -rf docs
	jsdoc -d=docs -s js js/core js/util

# target: lint - Run jslint on all source files except third-party libraries.
lint:
	jslint --nomen --plusplus --predef requirejs --predef require --predef define --predef mocha --predef describe --predef it --predef window --predef document --predef console --predef alert --predef location --predef setTimeout --predef localStorage --predef indexedDB --predef IDBKeyRange --predef IDBTransaction --predef IDBObjectStore --predef bbgm --predef before --predef beforeEach --predef after --predef afterEach --predef Raphael js/core/*.js js/test/*.js js/test/core/*.js js/util/*.js js/*.js js/templates/helpers.js js/lib/IndexedDB-getAll-shim.js js/lib/boxPlot.js js/lib/faces.js js/lib/jquery.dataTables.bbgmSorting.js



### Targets below here are generally just called from the targets above.

# target: clean - Run the RequireJS optimizer to merge and minify all JavaScript files.
build-requirejs:
	r.js -o baseUrl=js name=app mainConfigFile=js/app.js out=js/app-built.js

# target: build-templates - Precompile Handlebars templates.
build-templates:
	handlebars templates -f js/templates/compiled.js

# target: clean - Delete files generated by `make all`.
clean:
	rm -f js/templates/compiled.js
	rm -f js/app-built.js



###

.PHONY: all check clean docs help compile-templates