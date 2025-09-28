import { AuthConfig, AuthType } from '../typings/manifest';
import { readConfig } from './readYaml';

export interface ServerConfig {
  port: number;
  auth: AuthConfig;
  appUrl: string;
}

export interface RedisConfig {
  url: string;
  prefix: string;
}

export interface WorkflowConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

export interface ConceptDesignConfig {
  baseUrl?: string;
  bearer?: string;
  timeout?: number;
}

export interface Config {
  server: ServerConfig;
  redis: RedisConfig;
  workflow: WorkflowConfig;
  conceptDesign: ConceptDesignConfig;
}

const port = readConfig('server.port', 3000);

export const config: Config = {
  server: {
    port,
    auth: {
      type: readConfig('server.auth.type', AuthType.none),
      authorization_type: 'bearer',
      verification_tokens: {
        monkeys: readConfig('server.auth.bearerToken'),
      },
    },
    appUrl: readConfig('server.appUrl', `http://localhost:${port}`),
  },
  redis: {
    url: readConfig('redis.url'),
    prefix: readConfig('redis.prefix', 'monkeys:'),
  },
  workflow: {
    baseUrl: readConfig('workflow.baseUrl'),
    apiKey: readConfig('workflow.apiKey'),
    timeout: readConfig('workflow.timeout', 900),
  },
  conceptDesign: {
    baseUrl: readConfig('conceptDesign.baseUrl', process.env.CONCEPT_DESIGN_BASE_URL),
    bearer: readConfig('conceptDesign.bearer', process.env.CONCEPT_DESIGN_BEARER),
    timeout: readConfig('conceptDesign.timeout', 900),
  },
};

const validateConfig = () => {
  if (config.server.auth.type === AuthType.service_http) {
    if (!config.server.auth.verification_tokens['monkeys']) {
      throw new Error(
        'Invalid Config: auth.bearerToken must not empty when auth.type is service_http',
      );
    }
  }
};

validateConfig();
