import test from 'ava';
import getAuthUrl from '../lib/get-git-auth-url';
import {gitRepo} from './helpers/git-utils';

const env = {GIT_ASKPASS: 'echo', GIT_TERMINAL_PROMPT: 0};

test('Return the same "git" formatted URL if "gitCredentials" is not defined', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({cwd, env, options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'}}),
    'git@host.null:owner/repo.git'
  );
});

test('Return the same "https" formatted URL if "gitCredentials" is not defined', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({cwd, env, options: {branch: 'master', repositoryUrl: 'https://host.null/owner/repo.git'}}),
    'https://host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is not defined and repositoryUrl is a "git+https" URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({cwd, env, options: {branch: 'master', repositoryUrl: 'git+https://host.null/owner/repo.git'}}),
    'https://host.null/owner/repo.git'
  );
});

test('Do not add trailing ".git" if not present in the origian URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({cwd, env, options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo'}}),
    'git@host.null:owner/repo'
  );
});

test('Handle "https" URL with group and subgroup', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env,
      options: {branch: 'master', repositoryUrl: 'https://host.null/group/subgroup/owner/repo.git'},
    }),
    'https://host.null/group/subgroup/owner/repo.git'
  );
});

test('Handle "git" URL with group and subgroup', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env,
      options: {branch: 'master', repositoryUrl: 'git@host.null:group/subgroup/owner/repo.git'},
    }),
    'git@host.null:group/subgroup/owner/repo.git'
  );
});

test('Convert shorthand URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({cwd, env, options: {repositoryUrl: 'semanitc-release/semanitc-release'}}),
    'https://github.com/semanitc-release/semanitc-release.git'
  );
});

test('Convert GitLab shorthand URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env,
      options: {branch: 'master', repositoryUrl: 'gitlab:semanitc-release/semanitc-release'},
    }),
    'https://gitlab.com/semanitc-release/semanitc-release.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined and repositoryUrl is a "git" URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GIT_CREDENTIALS: 'user:pass'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'},
    }),
    'https://user:pass@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined and repositoryUrl is a "https" URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GIT_CREDENTIALS: 'user:pass'},
      options: {branch: 'master', repositoryUrl: 'https://host.null/owner/repo.git'},
    }),
    'https://user:pass@host.null/owner/repo.git'
  );
});

test('Return the "http" formatted URL if "gitCredentials" is defined and repositoryUrl is a "http" URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GIT_CREDENTIALS: 'user:pass'},
      options: {branch: 'master', repositoryUrl: 'http://host.null/owner/repo.git'},
    }),
    'http://user:pass@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined and repositoryUrl is a "git+https" URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GIT_CREDENTIALS: 'user:pass'},
      options: {branch: 'master', repositoryUrl: 'git+https://host.null/owner/repo.git'},
    }),
    'https://user:pass@host.null/owner/repo.git'
  );
});

test('Return the "http" formatted URL if "gitCredentials" is defined and repositoryUrl is a "git+http" URL', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GIT_CREDENTIALS: 'user:pass'},
      options: {branch: 'master', repositoryUrl: 'git+http://host.null/owner/repo.git'},
    }),
    'http://user:pass@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined with "GH_TOKEN"', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GH_TOKEN: 'token'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'},
    }),
    'https://token@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined with "GITHUB_TOKEN"', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GITHUB_TOKEN: 'token'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'},
    }),
    'https://token@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined with "GL_TOKEN"', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GL_TOKEN: 'token'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'},
    }),
    'https://gitlab-ci-token:token@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined with "GITLAB_TOKEN"', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GITLAB_TOKEN: 'token'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'},
    }),
    'https://gitlab-ci-token:token@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined with "BB_TOKEN"', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, BB_TOKEN: 'token'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'},
    }),
    'https://x-token-auth:token@host.null/owner/repo.git'
  );
});

test('Return the "https" formatted URL if "gitCredentials" is defined with "BITBUCKET_TOKEN"', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, BITBUCKET_TOKEN: 'token'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:owner/repo.git'},
    }),
    'https://x-token-auth:token@host.null/owner/repo.git'
  );
});

test('Handle "https" URL with group and subgroup, with "GIT_CREDENTIALS"', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GIT_CREDENTIALS: 'user:pass'},
      options: {branch: 'master', repositoryUrl: 'https://host.null/group/subgroup/owner/repo.git'},
    }),
    'https://user:pass@host.null/group/subgroup/owner/repo.git'
  );
});

test('Handle "git" URL with group and subgroup, with "GIT_CREDENTIALS', async t => {
  const {cwd} = await gitRepo();

  t.is(
    await getAuthUrl({
      cwd,
      env: {...env, GIT_CREDENTIALS: 'user:pass'},
      options: {branch: 'master', repositoryUrl: 'git@host.null:group/subgroup/owner/repo.git'},
    }),
    'https://user:pass@host.null/group/subgroup/owner/repo.git'
  );
});

test('Do not add git credential to repositoryUrl if push is allowed', async t => {
  const {cwd, repositoryUrl} = await gitRepo(true);

  t.is(
    await getAuthUrl({cwd, env: {...env, GIT_CREDENTIALS: 'user:pass'}, options: {branch: 'master', repositoryUrl}}),
    repositoryUrl
  );
});
