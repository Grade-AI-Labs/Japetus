/**
 * Thin re-export over the registry config loader. The MVP corpus that used to
 * live here is now `config/registry.dev.json`. Tests and `main()` reach the
 * loader via `src/config/registry_config.ts` directly; this file exists for
 * call sites that want a no-arg seed function for the dev config.
 */
import {
  DEFAULT_REGISTRY_CONFIG_PATH,
  loadRegistryConfig,
  resolveRegistryConfigPath,
} from './config/registry_config.ts';
import type { Registry } from './registry.ts';

export async function seedRegistry(registry: Registry, configPath?: string): Promise<void> {
  await loadRegistryConfig(registry, configPath ?? resolveRegistryConfigPath());
}

export { DEFAULT_REGISTRY_CONFIG_PATH };
