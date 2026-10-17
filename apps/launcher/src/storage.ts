import { invoke, isTauri } from '@tauri-apps/api/core';
import { catalog } from './catalog.ts';

export type Document = { id: string; title: string; content: string; updated_at: number };
export type Workspace = { settings: { theme: string; pinned: string[] }; documents: Document[] };
const key = 'librerary.workspace.v1';
export const desktop = isTauri();
export const defaults = (): Workspace => ({ settings: { theme: 'system', pinned: ['writer'] }, documents: [] });
export function validate(value: unknown): Workspace {
  const s = value as Workspace;
  if (!s || !s.settings || !['system', 'light', 'dark'].includes(s.settings.theme) || !Array.isArray(s.settings.pinned) || !s.settings.pinned.every(x => typeof x === 'string') || !Array.isArray(s.documents) || s.documents.length > 1000) throw new Error('Invalid workspace data. Original data was kept.');
  const ids = new Set<string>();
  if (new Set(s.settings.pinned).size !== s.settings.pinned.length || s.settings.pinned.some(id => !catalog.some(app => app.id === id))) throw new Error('Invalid pinned apps. Original data was kept.');
  for (const d of s.documents) {
    if (!d || typeof d.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(d.id) || ids.has(d.id) || typeof d.title !== 'string' || !d.title.trim() || new TextEncoder().encode(d.title).length > 512 || /[\u0000-\u001f\u007f]/.test(d.title) || typeof d.content !== 'string' || new TextEncoder().encode(d.content).length > 2 * 1024 * 1024 || !Number.isSafeInteger(d.updated_at) || d.updated_at < 0) throw new Error('Invalid document data. Original data was kept.');
    ids.add(d.id);
  }
  return s;
}
export async function load(): Promise<Workspace> {
  if (desktop) return validate(await invoke('load_workspace'));
  const raw = localStorage.getItem(key);
  if (raw === null) return defaults();
  const envelope = JSON.parse(raw);
  if (envelope.version !== 1) throw new Error('Unsupported workspace version. Original data was kept.');
  return validate(envelope.state);
}
export async function save(state: Workspace): Promise<void> {
  validate(state);
  if (desktop) return invoke('save_workspace', { state });
  const serialized = JSON.stringify({ version: 1, state });
  if (new TextEncoder().encode(serialized).length > 32 * 1024 * 1024) throw new Error('Workspace exceeds the 32 MB foundation limit.');
  localStorage.setItem(key, serialized);
}
export async function exportText(doc: Document): Promise<boolean> {
  if (desktop) return invoke('export_text', { content: doc.content });
  const url = URL.createObjectURL(new Blob([doc.content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = `${doc.title.replace(/[<>:"/\\|?*]/g, '_')}.txt`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
