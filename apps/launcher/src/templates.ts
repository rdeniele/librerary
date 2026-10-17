import { invoke } from '@tauri-apps/api/core';
import { desktop } from './storage.ts';
import trust from '../../../packages/offline/trusted.json' with { type: 'json' };

export type Template = { id: string; title: string; description: string; content: string };
export type ContentPackage = { schema: number; id: string; name: string; version: string; kind: string; host_api: number; platform: string; dependencies: {id: string; requirement: string}[]; templates: Template[] };
const key = 'librerary.content-packages.v1';

async function verified(raw: string): Promise<ContentPackage> {
  const bytes = new TextEncoder().encode(raw);
  if (bytes.byteLength > 256 * 1024) throw new Error('Package exceeds 256 KB.');
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
  const release = trust.find(r => r.sha256 === hash);
  if (!release) throw new Error('Package is unknown or modified. This build only accepts its trusted Writer starters release.');
  const pack = JSON.parse(raw) as ContentPackage;
  if (pack.id !== release.id || pack.version !== release.version || pack.schema !== 1 || pack.host_api !== 1 || pack.kind !== 'writer-templates' || pack.platform !== 'any') throw new Error('Unsupported package.');
  // Only build-pinned bytes pass above. Arbitrary templates cannot reach the renderer.
  return pack;
}

export async function listPackages(): Promise<ContentPackage[]> {
  if (desktop) return invoke('list_content_packages');
  const raw = localStorage.getItem(key);
  return raw === null ? [] : [await verified(raw)];
}
export async function installBuiltin(): Promise<ContentPackage[]> {
  if (desktop) return invoke('install_starter_package');
  const { default: raw } = await import('../../../packages/offline/writer-starters.librerary.json?raw');
  return installBrowserPackage(raw);
}
export async function installBrowserPackage(raw: string): Promise<ContentPackage[]> {
  const pack = await verified(raw);
  localStorage.setItem(key, raw);
  return [pack];
}
export async function installFromFile(): Promise<ContentPackage[] | null> {
  if (!desktop) throw new Error('Use the browser file input.');
  return invoke('install_package_file');
}
export async function removePackage(id: string): Promise<ContentPackage[]> {
  if (desktop) return invoke('remove_content_package', { id });
  if (!trust.some(r => r.id === id)) throw new Error('Unknown package.');
  localStorage.removeItem(key);
  return [];
}
