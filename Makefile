TESTS = test/*.js
test:
	mocha $(TESTS)

.PHONY: test