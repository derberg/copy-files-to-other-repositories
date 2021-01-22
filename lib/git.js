const core = require('@actions/core');

module.exports = {createBranch, clone, push};

async function createBranch(branchName, git) {
  return await git
    .checkout(`-b${branchName}`);
}

async function clone(remote, dir, git) {
  return await git
    .clone(remote, dir, {'--depth': 1});
}

async function push(token, url, branchName, message, committerUsername, committerEmail, git) {
  const authanticatedUrl = (token, url, user) => {
    const arr = url.split('//');
    return `https://${user}:${token}@${arr[arr.length - 1]}`;
  };

  if (core.isDebug()) require('debug').enable('simple-git');

  await git.add('./*');
  await git.addConfig('user.name', committerUsername);
  await git.addConfig('user.email', committerEmail);
  await git.commit(message);
  await git.addRemote('auth', authanticatedUrl(token, url, committerUsername));
  await git.push(['-u', 'auth', branchName]);
}
  