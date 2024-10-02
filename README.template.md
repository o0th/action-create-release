<h2 align="center">
o0th/action-create-release
</h2>

This github action extract the `version` field in `package.json`
or `build.zig.zon` and create a tag and a release

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
      - uses: o0th/action-create-release@{{verison}}
```
