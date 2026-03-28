import { env, exit, version } from 'node:process';

console.log(`current node version is ${version}`);

const numVer = Number(version.toLowerCase().replaceAll('v', '').split('.')[0]);

if (numVer < 24) {
  console.log('this project requires node version 24 or higher');
  exit(1);
}

const userAgent = env?.npm_config_user_agent || '';

if (!userAgent.includes('pnpm')) {
  console.log('this project requires pnpm to be installed');
  exit(1);
}
