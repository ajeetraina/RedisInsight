import config from 'src/utils/config';

const REDIS_CLI_CONFIG = config.get('redis_cli');

export enum CliToolUnsupportedCommands {
  Monitor = 'monitor',
  Subscribe = 'subscribe',
  PSubscribe = 'psubscribe',
  Sync = 'sync',
  PSync = 'psync',
  ScriptDebug = 'script debug',
}

export const getUnsupportedCommands = (): string[] => [
  ...Object.values(CliToolUnsupportedCommands),
  ...REDIS_CLI_CONFIG.unsupportedCommands,
];
