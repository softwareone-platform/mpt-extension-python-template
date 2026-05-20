## Add repo-specific targets here. Do not modify the shared *.mk files.

run-local:
	$(DC) -f compose.local.yaml up
