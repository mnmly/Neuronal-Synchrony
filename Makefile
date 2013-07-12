SRC = $(wildcard Perform/*/*.js)
SRC := $(filter-out Perform/*/lib/*.js, $(SRC))
COMPONENTS = $(wildcard Perform/*/component.json)

build: components $(SRC)
	@component build --dev

components: $(COMPONENTS)
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean
