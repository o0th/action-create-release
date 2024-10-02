import core from '@actions/core'
import github from '@actions/github'

const token = core.getInput('token');
const octokit = github.getOctokit(token)

const owner = github.context.repo.owner
const repo = github.context.repo.repo
const sha = github.context.sha

const regexes = {
  'package.json': /"version": "(?<version>\d.\d.\d)"/,
  'build.zig.zon': /.version = "(?<version>\d.\d.\d)"/
}

const getFiles = async (octokit, owner, repo, ref) => {
  const request = await octokit.rest.repos.getContent({
    owner, repo, ref
  })

  return request.data.map((item) => item.name)
}

const getFile = async (octokit, owner, repo, ref, path) => {
  const request = await octokit.rest.repos.getContent({
    owner, repo, ref, path
  })

  return atob(request.data.content)
}

const matchFile = (files, regexes) => {
  return files.find((file) => regexes.hasOwnProperty(file))
}

const files = await getFiles(octokit, owner, repo, sha)
const file = matchFile(files, regexes)

if (!file) {
  core.setFailed(`Couldn't find any supported file'`)
  process.exit(1)
}

const content = await getFile(octokit, owner, repo, sha, file)
const [_, version] = getLine(content, regexes[file])

await octokit.rest.git.createRef({
  owner,
  repo,
  sha,
  ref: `refs/tags/v${version}`
}).catch((error) => {
  core.setFailed(error)
  process.exit(1)
})

await octokit.rest.repos.createRelease({
  owner,
  repo,
  tag_name: `v${version}`,
  name: `${repo} v${version}`,
  generate_release_notes: true
}).catch((error) => {
  core.setFailed(error)
  process.exit(1)
})

process.exit(0)
