SRC = $(wildcard Perform/*/*.js)
SRC := $(filter-out Perform/*/lib/*.js, $(SRC))

build: components $(SRC)
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
