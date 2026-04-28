import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { Registry, type ResourceEntry } from '../registry.ts';

const SpaceSchema = z.enum(['ENG', 'PRODUCT', 'SEC']);

const EntrySchema = z.object({
  uri: z.string().min(1),
  adapterId: z.string().min(1),
  backingId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  owner: z.string().optional(),
  product: z.string().optional(),
  space: SpaceSchema.optional(),
  aliases: z.array(z.string().min(1)).optional(),
  supersedes: z.array(z.string().min(1)).optional(),
  priority: z.number().min(0).max(1).optional(),
  topics: z.array(z.string().min(1)).optional(),
  mimeType: z.string().optional(),
});

const ConfigSchema = z.object({
  entries: z.array(EntrySchema).min(1),
});

export type RegistryConfig = z.infer<typeof ConfigSchema>;

export const DEFAULT_REGISTRY_CONFIG_PATH = 'config/registry.dev.json';

export function resolveRegistryConfigPath(env: NodeJS.ProcessEnv = process.env): string {
  return env['REGISTRY_CONFIG'] ?? DEFAULT_REGISTRY_CONFIG_PATH;
}

export async function loadRegistryConfig(registry: Registry, path: string): Promise<void> {
  let text: string;
  try {
    text = await readFile(path, 'utf-8');
  } catch (err) {
    throw new Error(`Cannot read registry config at '${path}': ${(err as Error).message}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`Registry config at '${path}' is not valid JSON: ${(err as Error).message}`);
  }
  const result = ConfigSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid registry config at '${path}':\n${issues}`);
  }
  for (const entry of result.data.entries) {
    registry.register(entry as ResourceEntry);
  }
}
