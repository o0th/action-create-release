import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import child_process from 'node:child_process'

import core from '@actions/core'
import github from '@actions/github'

const exec = util.promisify(child_process.exec)

const regexes = {
  // 'package.json': /"version": "(?<version>\d.\d.\d)"/,
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

await octokit.rest.git.createRef({
  owner, repo, sha, ref: `refs/tags/v${version}`
}).catch((error) => {
  core.error(error)
  process.exit(1)
})

if (file === 'build.zig.zon') {
  const { stdout, stderr } = await exec(
    `zig fetch https://github.com` +
    `/${owner}/${repo}/archive/refs/tags/v${version}.tar.gz`
  )

  if (stderr) {
    core.error(error)
    process.exit(1)
  }

  const hash = stdout.replace(/(\r\n|\n|\r)/gm, '')
  const body = fs.readFileSync(path.join('.', 'zig-template.md'), 'utf8')
    .replaceAll('{owner}', owner)
    .replaceAll('{repo}', repo)
    .replaceAll('{version}', version)
    .replaceAll('{hash}', hash)

  await octokit.rest.repos.createRelease({
    owner, repo, tag_name: `v${version}`, name: `${repo} v${version}`, body
  }).catch((error) => {
    core.error(error)
    process.exit(1)
  })

  process.exit(0)
}


await octokit.rest.repos.createRelease({
  owner, repo, tag_name: `v${version}`, name: `${repo} v${version}`
}).catch((error) => {
  core.error(error)
  process.exit(1)
})

