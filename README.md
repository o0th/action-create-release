<h2 align="center">
o0th/action-create-release
</h2>

This github action check in the current pr if `version` field in `package.json`
or `build.zig.zon` was updated and increased according to sem versioning.

### Usage

```yaml
name: create-release

on:
  push:
    branches:
      - master 

permissions:
  contents: write

jobs:

  check-version:
    runs-on: ubuntu-latest

    steps:
      - uses: o0th/action-create-release@v0.0.3
```
