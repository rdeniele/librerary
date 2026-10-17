import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowUpRight, Box, Check, ChevronRight, FileText, Grid2X2, Library, Moon, Pin, Plus, Search, Settings2, Sun, X, LayoutTemplate, Download, Upload, Trash2, Table2, Presentation, FileSearch, Shapes, Image, PenTool, Music2, AudioLines, Clapperboard, Orbit, BookOpen } from 'lucide-react';
import { catalog, type AppEntry } from './catalog';
import { defaults, desktop, exportText, load, save, type Document, type Workspace } from './storage';
import './apple.css';
import { SaveQueue } from './save-queue';
import { listPackages, installBuiltin, installBrowserPackage, installFromFile, removePackage, type ContentPackage, type Template } from './templates';

type View = 'home' | 'apps' | 'settings' | 'writer' | 'templates';

function AppGlyph({ id, size = 20 }: { id: string; size?: number }) {
  const icons = { writer: FileText, sheets: Table2, slides: Presentation, pdf: FileSearch, design: Shapes, photo: Image, vector: PenTool, studio: Music2, audio: AudioLines, video: Clapperboard, motion: Orbit, publish: BookOpen, '3d': Box };
  const Icon = icons[id as keyof typeof icons] ?? Box;
  return <Icon size={size} aria-hidden="true" />;
}

function App() {
  const [workspace, setWorkspace] = useState<Workspace>(defaults);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Loading workspace…');
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All apps');
  const [active, setActive] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const queue = useRef<SaveQueue<Workspace> | null>(null);
  const latest = useRef(workspace);
  const [contentPackages, setContentPackages] = useState<ContentPackage[]>([]);
  const [packageBusy, setPackageBusy] = useState(false);
  const [packageReady, setPackageReady] = useState(false);
  const [packageError, setPackageError] = useState('');
  const packageFile = useRef<HTMLInputElement>(null);
  if (!queue.current) queue.current = new SaveQueue(save, (nextStatus, cause) => {
    setStatus(nextStatus === 'saved' ? 'All changes saved' : nextStatus === 'saving' ? 'Saving…' : 'Changes not saved');
    if (nextStatus === 'failed') setError(`Save failed: ${String(cause)}. Keep this window open and retry.`);
    else if (nextStatus === 'saved') setError('');
  });

  useEffect(() => {
    load().then(s => { latest.current = s; setWorkspace(s); setReady(true); setStatus('All changes saved'); }).catch(e => { setError(String(e)); setStatus('Workspace could not be loaded'); });
    listPackages().then(setContentPackages).catch(e => setPackageError(String(e))).finally(() => setPackageReady(true));
  }, []);

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => { document.documentElement.dataset.theme = workspace.settings.theme === 'system' ? (media.matches ? 'dark' : 'light') : workspace.settings.theme; };
    apply(); media.addEventListener('change', apply); return () => media.removeEventListener('change', apply);
  }, [workspace.settings.theme]);

  function persist(next: Workspace) {
    latest.current = next; setWorkspace(next); queue.current!.update(next);
  }

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (queue.current!.pending) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    let cleanup: (() => void) | undefined;
    let disposed = false;
    if (desktop) import('@tauri-apps/api/window').then(async ({ getCurrentWindow }) => {
      const off = await getCurrentWindow().onCloseRequested(async event => {
        if (queue.current!.pending) {
          event.preventDefault();
          try { await queue.current!.flush(); if (!queue.current!.pending) await getCurrentWindow().close(); }
          catch { /* SaveQueue already shows the error and retains newest unsaved edits. */ }
        }
      });
      if (disposed) off(); else cleanup = off;
    });
    return () => { disposed = true; cleanup?.(); window.removeEventListener('beforeunload', beforeUnload); };
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.current?.focus(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); if (ready) void queue.current!.flush().catch(() => {}); }
      if (event.key === 'Escape') { setQuery(''); search.current?.blur(); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [ready]);

  function newDocument(template?: Template) {
    if (!ready) return;
    if (latest.current.documents.length >= 1000) { setError('This workspace has reached the current 1,000-project storage limit.'); return; }
    const doc: Document = { id: crypto.randomUUID(), title: template?.title ?? 'Untitled', content: template?.content ?? '', updated_at: Date.now() };
    persist({ ...latest.current, documents: [doc, ...latest.current.documents] }); setActive(doc.id); setView('writer');
  }
  function editDocument(patch: Partial<Document>) {
    persist({ ...latest.current, documents: latest.current.documents.map(d => d.id === active ? { ...d, ...patch, updated_at: Date.now() } : d) });
  }
  function pin(id: string) {
    const current = latest.current;
    persist({ ...current, settings: { ...current.settings, pinned: current.settings.pinned.includes(id) ? current.settings.pinned.filter(p => p !== id) : [...current.settings.pinned, id] } });
  }
  function launch(app: AppEntry) { if (app.available) newDocument(); }
  const doc = workspace.documents.find(d => d.id === active);
  const visibleApps = catalog.filter(a => (view !== 'apps' || category === 'All apps' || a.category === category) && `${a.name} ${a.description}`.toLowerCase().includes(query.toLowerCase()));
  const documents = [...workspace.documents].sort((a, b) => b.updated_at - a.updated_at).filter(d => d.title.toLowerCase().includes(query.toLowerCase()));
  const pinned = catalog.filter(a => workspace.settings.pinned.includes(a.id));
  const words = doc?.content.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const templates = contentPackages.flatMap(pack => pack.templates.map(template => ({ ...template, packageName: pack.name, packageId: pack.id })));
  const startersInstalled = contentPackages.some(pack => pack.id === 'writer-starters');
  async function packageAction(action: () => Promise<ContentPackage[] | null>, success: string) {
    setPackageBusy(true); setPackageError('');
    try { const installed = await action(); if (installed !== null) { setContentPackages(installed); setMessage(success); } }
    catch (e) { setPackageError(String(e)); }
    finally { setPackageBusy(false); }
  }
  function choosePackage() {
    if (desktop) void packageAction(installFromFile, 'Verified template package installed.');
    else packageFile.current?.click();
  }

  function appRow(app: AppEntry) {
    return <div className="app-row" key={app.id}>
      <span className={`app-letter ${app.available ? 'available' : ''}`} aria-hidden="true"><AppGlyph id={app.id} /></span>
      <button className="app-info" disabled={!app.available || !ready} onClick={() => launch(app)}><strong>{app.name}</strong><span>{app.description}</span></button>
      <span className={`availability ${app.available ? 'ready' : ''}`}>{app.available ? 'Text foundation' : 'Planned'}</span>
      <button className={`icon-button pin ${workspace.settings.pinned.includes(app.id) ? 'is-pinned' : ''}`} disabled={!ready} aria-label={`${workspace.settings.pinned.includes(app.id) ? 'Unpin' : 'Pin'} ${app.name}`} aria-pressed={workspace.settings.pinned.includes(app.id)} onClick={() => pin(app.id)}><Pin size={16} /></button>
      <button className="icon-button" disabled={!app.available || !ready} aria-label={`Open ${app.name}`} onClick={() => launch(app)}><ArrowUpRight size={17} /></button>
    </div>;
  }

  return <div className="shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setView('home')} aria-label="Librerary home"><img className="brand-icon" src="/brand/librerary-icon.png" alt="" /><span>Librerary<span className="version">0.1</span></span></button>
      <nav aria-label="Main navigation">
        <button className={view === 'home' ? 'selected' : ''} onClick={() => setView('home')}><Library size={18} />Workspace</button>
        <button className={view === 'apps' ? 'selected' : ''} onClick={() => setView('apps')}><Grid2X2 size={18} />All apps<span className="count">13</span></button>
        <button className={view === 'templates' ? 'selected' : ''} onClick={() => setView('templates')}><LayoutTemplate size={18} />Templates</button>
      </nav>
      <div className="pinned-label">Pinned apps</div>
      <div className="pinned-list">{pinned.length ? pinned.map(app => <button key={app.id} disabled={!app.available || !ready} onClick={() => launch(app)}><span className="small-letter"><AppGlyph id={app.id} size={14} /></span>{app.name}{!app.available && <span className="planned-dot" title="Planned" />}</button>) : <p className="hint">Pin apps from the catalog.</p>}</div>
      <div className="sidebar-bottom"><button className={view === 'settings' ? 'selected' : ''} onClick={() => setView('settings')}><Settings2 size={18} />Settings</button><div className="local-label"><span />Local workspace</div></div>
    </aside>

    <div className="main-shell">
      <header className="topbar"><span>{view === 'writer' ? 'Writer / Plain text' : view === 'apps' ? 'App library' : view === 'settings' ? 'Preferences' : view === 'templates' ? 'Template library' : 'Your workspace'}</span><label className="search"><Search size={16} /><input ref={search} aria-label="Search apps and documents" placeholder="Search apps and documents" value={query} onChange={e => { setQuery(e.target.value); if (view === 'writer' || view === 'settings' || view === 'templates') setView('home'); }} /><kbd>Ctrl K</kbd></label></header>
      <main>
        {error && <div className="error" role="alert"><span>{error}</span>{ready && <button onClick={() => { void queue.current!.flush().catch(() => {}); }}>Retry save</button>}</div>}
        {!ready && !error && <p role="status">Loading your local workspace…</p>}
        {view === 'home' && <>
          <div className="page-heading"><div><h1>Pick up where you left off.</h1><p>Your tools and projects, in one quiet place.</p></div><button className="primary" disabled={!ready} onClick={() => newDocument()}><Plus size={17} />New text project</button></div>
          <section aria-labelledby="quick-title"><div className="section-heading"><h2 id="quick-title">Quick launch</h2><button className="text-button" onClick={() => setView('apps')}>Browse all apps<ChevronRight size={15} /></button></div><div className="quick-launch"><div className="writer-symbol"><FileText size={30} /></div><div><h3>Writer</h3><p>Start with a blank page. Save your words locally.</p><span className="caption">Plain text foundation · TXT export</span></div><button disabled={!ready} onClick={() => newDocument()}>Open Writer<ArrowUpRight size={17} /></button></div></section>
          <section aria-labelledby="recent-title"><div className="section-heading"><h2 id="recent-title">Recent projects<span className="inline-count">{workspace.documents.length}</span></h2><span className="caption">Stored on this device</span></div>
            {documents.length ? <div className="document-list">{documents.map(d => <button className="document-row" key={d.id} onClick={() => { setActive(d.id); setView('writer'); }}><FileText size={19} /><span><strong>{d.title}</strong><small>Writer · Plain text</small></span><time dateTime={new Date(d.updated_at).toISOString()}>{new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(d.updated_at)}</time><ChevronRight size={16} /></button>)}</div> : <div className="empty"><FileText size={27} /><h3>{query ? 'No matching projects' : 'A fresh workspace.'}</h3><p>{query ? 'Try a different name, or browse the apps below.' : 'Create your first text project. It will be waiting here when you return.'}</p>{!query && <button className="text-button" onClick={() => newDocument()} disabled={!ready}>Create a text project<Plus size={16} /></button>}</div>}
          </section>
          {query && <section><div className="section-heading"><h2>Matching apps</h2></div>{visibleApps.length ? visibleApps.map(appRow) : <p className="hint">No apps match your search.</p>}</section>}
          <div className="foundation-note"><Box size={18} /><p>Building the essentials.<span>Writer is available for plain text. More tools will arrive as working modules.</span></p><button className="text-button" onClick={() => setView('apps')}>View catalog<ChevronRight size={15} /></button></div>
        </>}

        {view === 'apps' && <><div className="page-heading"><div><h1>Your tools, together.</h1><p>Open what is ready. Pin what you want to keep close.</p></div></div><div className="filters" aria-label="App category">{['All apps', 'Office', 'Creative', 'Sound'].map(c => <button key={c} className={category === c ? 'active' : ''} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="catalog">{visibleApps.map(appRow)}{!visibleApps.length && <p className="empty">No apps match this search.</p>}</div><p className="catalog-note">Planned apps cannot be installed yet. Package installation and updates are still in development.</p></>}

        {view === 'settings' && <><div className="page-heading"><div><h1>Make yourself at home.</h1><p>A few preferences. No account required.</p></div></div><section className="setting-row"><div><h2>Appearance</h2><p>Choose a theme for your workspace.</p></div><select aria-label="Appearance" value={workspace.settings.theme} disabled={!ready} onChange={e => persist({ ...latest.current, settings: { ...latest.current.settings, theme: e.target.value } })}><option value="system">Follow system</option><option value="light">Light</option><option value="dark">Dark</option></select></section><section className="setting-row"><div><h2>Workspace storage</h2><p>{desktop ? 'Projects are saved in Librerary’s local application data folder.' : 'Browser preview: projects stay in this browser’s local storage.'}</p><p>{desktop ? 'A previous valid save is kept as a recovery backup.' : 'Browser storage can be cleared by your browser. Export important work.'}</p></div></section><section className="setting-row"><div><h2>Keyboard shortcuts</h2><p><kbd>Ctrl K</kbd> Search apps and projects</p><p><kbd>Ctrl S</kbd> Save workspace</p><p><kbd>Esc</kbd> Clear search</p></div></section><p className="catalog-note">Librerary 0.1 · Create freely. Work professionally.</p></>}

        {view === 'writer' && doc && <div className="editor"><div className="editor-toolbar"><button className="text-button" onClick={() => setView('home')}><ArrowLeft size={16} />Workspace</button><span className="caption">Plain text</span><button onClick={async () => { try { if (await exportText(doc)) setMessage('Text export completed.'); } catch (e) { setError(`Export failed: ${String(e)}`); } }}>Export TXT<ArrowUpRight size={16} /></button></div><label className="sr-only" htmlFor="doc-title">Project title</label><input id="doc-title" className="document-title" title={doc.title} value={doc.title} maxLength={200} onChange={e => editDocument({ title: e.target.value || 'Untitled' })} /><label className="sr-only" htmlFor="doc-content">Document text</label><textarea id="doc-content" className="document-content" autoFocus placeholder="Start writing…" value={doc.content} onChange={e => editDocument({ content: e.target.value })} spellCheck /><div className="editor-bottom"><span>{words} {words === 1 ? 'word' : 'words'}</span><span>{doc.content.length} characters</span><span>Plain text · Formatting and DOCX are not available yet</span></div></div>}
        {view === 'templates' && <>
          <div className="page-heading"><div><h1>A little help getting started.</h1><p>Useful starting points for your next text project.</p></div><button disabled={!ready || packageBusy || !packageReady} onClick={choosePackage}><Upload size={16} />Install from file</button></div>
          <input ref={packageFile} className="sr-only" type="file" accept=".json" aria-label="Offline template package" tabIndex={-1} onChange={event => {
            const file = event.target.files?.[0]; event.target.value = '';
            if (file) void packageAction(async () => { if (file.size > 256 * 1024) throw new Error('Package exceeds 256 KB.'); return installBrowserPackage(await file.text()); }, 'Verified template package installed.');
          }} />
          {packageError && <div className="error" role="alert">{packageError}</div>}
          <section aria-labelledby="package-title">
            <div className="section-heading"><h2 id="package-title">Template package</h2><span className="caption" role="status">{packageBusy ? 'Updating package…' : !packageReady ? 'Checking installed packages…' : startersInstalled ? 'Installed' : 'Available offline'}</span></div>
            <div className="package-summary"><LayoutTemplate size={26} /><div><h3>Writer starters</h3><p>Meeting notes, a project brief, and a daily plan.</p><span className="caption">Version 1.0.0 · 3 plain-text templates · Verified release</span></div><div className="package-actions">
              {startersInstalled ? <button disabled={packageBusy || !ready} onClick={() => { void packageAction(() => removePackage('writer-starters'), 'Template package removed. Your projects are kept.'); }}><Trash2 size={15} />Remove package</button> : <button className="primary" disabled={packageBusy || !ready || !packageReady} onClick={() => { void packageAction(installBuiltin, 'Writer starters installed.'); }}><Download size={15} />Install templates</button>}
            </div></div>
            <p className="catalog-note">{desktop ? 'Packages are stored separately from your projects.' : 'Browser preview stores installed packages in this browser.'} Removing a package keeps every project you created from it. This build accepts only its verified Writer starters release.</p>
          </section>
          <section aria-labelledby="templates-title"><div className="section-heading"><h2 id="templates-title">Start a project</h2><span className="caption">{templates.length} templates installed</span></div>
            {templates.length ? <div className="document-list">{templates.map(template => <button className="document-row template-row" key={`${template.packageId}-${template.id}`} disabled={!ready || packageBusy} onClick={() => newDocument(template)}><FileText size={19} /><span><strong>{template.title}</strong><small>{template.description}</small></span><span className="template-action">Use template</span><ChevronRight size={16} /></button>)}</div> : <div className="empty"><LayoutTemplate size={27} /><h3>No templates installed yet.</h3><p>Install Writer starters above, or keep writing from a blank page.</p><button className="text-button" disabled={!ready} onClick={() => newDocument()}>Start a blank project<Plus size={16} /></button></div>}
          </section>
        </>}
      </main>
      <footer><span className="save-status" role="status">{status === 'All changes saved' && <Check size={13} />}{status}</span><span>{desktop ? 'Desktop' : 'Browser preview'} · Offline workspace</span><button className="icon-button" aria-label="Toggle light and dark theme" disabled={!ready} onClick={() => persist({ ...latest.current, settings: { ...latest.current.settings, theme: document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark' } })}>{workspace.settings.theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}</button></footer>
    </div>
    {message && <div className="toast" role="status">{message}<button className="icon-button" aria-label="Dismiss notification" onClick={() => setMessage('')}><X size={15} /></button></div>}
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
