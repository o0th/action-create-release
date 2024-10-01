## Using it

This is a workflow example

```yaml
name: release

on:
  push:
    branches:
      - master

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - name: Set up source
        uses: actions/checkout@v4

      - name: Release
        uses: {owner}/{repo}@v{version}
```
