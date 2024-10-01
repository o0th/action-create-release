import fs from 'node:fs'
import path from 'node:path'
import core from '@actions/core'
import github from '@actions/github'

const regexes = {
  'package.json': /"version": "(?<version>\d.\d.\d)"/,
  'build.zig.zon': /.version = "(?<version>\d.\d.\d)"/
}

const files = fs.readdirSync(path.join('.'));
const file = files.find((file) => regexes.hasOwnProperty(file))

if (!file) {
  core.error(`Couldn't find any version file'`)
  process.exit(1)
}

const content = fs.readFileSync(path.join('.', file), 'utf8')
const matches = content.match(regexes[file])

if (!matches.groups.version) {
  core.error(`Couldn't find version in ${file}`)
}

const version = matches.groups.version
const token = core.getInput('token');
const [owner, repo] = core.getInput('repository').split('/');
const sha = core.getInput('sha');

const octokit = github.getOctokit(token)
const response = await octokit.rest.git.createRef({
  owner, repo, ref: `ref/tags/v${version}`
})
