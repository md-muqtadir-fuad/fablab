import type { Client } from "@libsql/client";

export declare const migrations: { id: number; name: string; statements: string[] }[];
export declare function migrate(client: Client): Promise<void>;
export declare function databaseConfig(env?: Record<string, string | undefined>): {
  url: string;
  authToken: string | undefined;
  local: boolean;
  file?: string;
};
