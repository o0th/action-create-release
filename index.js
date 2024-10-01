const fs = require('node:fs');
const path = require('node:path');
const core = require('@actions/core');
const github = require('@actions/github');

const regexes = {
  'package.json': /"version": "(?<version>\d.\d.\d)"/,
  'build.zig.zon': /.version = "(?<version>\d.\d.\d)"/
}

const files = fs.readdirSync(path.join(__dirname));
const file = files.find((file) => regexes.hasOwnProperty(file))

if (!file) {
  core.error(`Couldn't find any version file'`)
  process.exit(1)
}

const content = fs.readFileSync(path.join(__dirname, file), 'utf8')
const matches = content.match(regexes[file])

if (!matches.groups.version) {
  core.error(`Couldn't find version in ${file}`)
}

const token = core.getInput('token');
const [owner, repo] = core.getInput('repository').split('/');
const sha = core.getInput('sha');

const result = github.rest.git.getRef({
  owner, repo, ref: `v${version}`
})

core.notice(result);
