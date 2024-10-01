const fs = require('node:fs');
const path = require('node:path');
const core = require('@actions/core');
const github = require('@actions/github');

core.notice(fs.readdirSync(path.join(__dirname)));
