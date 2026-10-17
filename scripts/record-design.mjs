import { readFileSync, writeFileSync } from 'node:fs';
const css = readFileSync(new URL('../apps/launcher/src/apple.css', import.meta.url), 'utf8');
const root = css.split(':root[data-theme')[0];
const colorMeta = Object.fromEntries([...root.matchAll(/--([a-z-]+):\s*([^;]+);/g)].filter(([,key])=>key!=='shadow').map(([,key])=>[key,{role:key==='accent'?'primary':'neutral',displayName:key.replaceAll('-',' ')}]));
for (const [,key,value] of root.matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
  if (key !== 'shadow') colorMeta[key].tonalRamp = Array.from({length:8},(_,i)=>`oklch(from ${value} ${15+i*80/7}% c h)`);
}
const dark = css.split(":root[data-theme='dark'] {")[1].split('}')[0];
for (const [,key,value] of dark.matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
  if (key !== 'shadow') colorMeta[`dark-${key}`] = {role:key==='accent'?'primary':'neutral',displayName:`dark ${key}`,tonalRamp:Array.from({length:8},(_,i)=>`oklch(from ${value} ${15+i*80/7}% c h)`)};
}
const record = {
  schemaVersion: 2, generatedAt: new Date().toISOString(), title: 'Design System: Librerary',
  extensions: {
    colorMeta,
    typographyMeta: { headline: { displayName: 'Native headline', purpose: 'Page hierarchy with system optical sizing.' }, 'editor-body': { displayName: 'Writer text', purpose: 'Comfortable editable text, no font redistribution.' } },
    shadows: [{name:'working-surface',value:'0 2px 8px rgba(30, 40, 65, .035), 0 12px 32px rgba(30, 40, 65, .025)',purpose:'Quiet separation of working surfaces.'},{name:'notification',value:'0 5px 22px rgba(0, 0, 0, .14)',purpose:'Floating status message above content.'}],
    motion:[{name:'control-feedback',value:'120ms ease-out',purpose:'Hover and focus-related surface feedback.'},{name:'press-feedback',value:'100ms ease-out',purpose:'Small press scale, disabled under reduced motion.'}],
    breakpoints:[{name:'compact-desktop',value:'1050px'},{name:'narrow',value:'650px'}],
    materials:[{name:'navigation-glass',value:'blur(24px) saturate(1.25)',purpose:'Sidebar hierarchy; opaque when reduced transparency requested.'},{name:'toolbar-glass',value:'blur(20px) saturate(1.25)',purpose:'Sticky navigation layer.'}],
  },
  components:[{name:'Primary button',kind:'button',refersTo:'button-primary',description:'Clear blue action with immediate press feedback.',html:'<button class="ds-primary">New text project</button>',css:'.ds-primary{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;font-weight:550;background:#0067d8;color:#fff;border:1px solid #0067d8;border-radius:11px;padding:9px 15px;min-height:36px;cursor:pointer;transition:background 120ms ease-out,transform 100ms ease-out}.ds-primary:hover{background:#005bbd}.ds-primary:focus-visible{outline:3px solid #0067d8;outline-offset:3px}.ds-primary:active{transform:scale(.985)}@media(prefers-reduced-motion:reduce){.ds-primary{transition:none}.ds-primary:active{transform:none}}'}],
  narrative:{northStar:'A calm, native workspace',overview:'User-approved Apple-inspired replacement world. The glass document-stack identity carries expression; the workspace preserves every workflow on readable neutral surfaces.',keyCharacteristics:['Native system typography','Blue actions on neutral surfaces','Functional translucent navigation','Solid reading and editing surfaces','Responsive rows and controls'],rules:[{name:'Quiet Color',body:'Reserve saturation for actions, focus and the original logo.',section:'colors'},{name:'Native Type',body:'Use host system typography; do not redistribute Apple fonts.',section:'typography'},{name:'Functional Glass',body:'Use translucent navigation with solid readable content.',section:'elevation'}],dos:['Preserve every action and project.','Keep status and focus visible in both themes.'],donts:['Do not fake macOS window controls on Windows.','Do not imply planned modules work.']},
};
record.extensions.rampNote = 'Tonal ramps are synthesized preview strips, not normative CSS scales.';
const font='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;';
record.components.push(
  {name:'Secondary button',kind:'button',refersTo:'button-secondary',description:'Quiet bordered action.',html:'<button class="ds-secondary">Open Writer</button>',css:`.ds-secondary{${font}background:var(--surface,#fff);color:var(--text,#1d1d1f);border:1px solid var(--line,#e5e5ea);border-radius:10px;padding:9px 15px;cursor:pointer}.ds-secondary:hover{background:var(--hover,#f0f3f9)}.ds-secondary:focus-visible{outline:3px solid #0067d8;outline-offset:3px}`},
  {name:'Search field',kind:'input',refersTo:'search',description:'Inset native search with visible focus.',html:'<input class="ds-search" aria-label="Search" placeholder="Search apps and documents" />',css:`.ds-search{${font}background:var(--canvas,#f5f5f7);color:var(--text,#1d1d1f);border:1px solid var(--line,#e5e5ea);border-radius:9px;padding:7px 10px;min-height:35px;width:260px}.ds-search:focus-visible{outline:3px solid #0067d8;outline-offset:2px}`},
  {name:'Selected navigation',kind:'nav',refersTo:'navigation-selected',description:'Pale selected navigation surface.',html:'<button class="ds-nav">Workspace</button>',css:`.ds-nav{${font}background:var(--surface,#fff);color:var(--text,#1d1d1f);border:1px solid var(--line,#e5e5ea);border-radius:10px;padding:10px 13px;min-width:160px;text-align:left;box-shadow:0 1px 3px rgba(30,40,65,.045);cursor:pointer}.ds-nav:hover{background:var(--hover,#f0f3f9)}.ds-nav:focus-visible{outline:3px solid #0067d8;outline-offset:3px}`},
  {name:'Availability label',kind:'chip',description:'Explicit working-module state.',html:'<span class="ds-chip">Text foundation</span>',css:'.ds-chip{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:11px;color:var(--accent,#0067d8);background:var(--tint,#eaf2ff);border-radius:5px;padding:4px 7px}'},
  {name:'Working surface',kind:'card',refersTo:'quick-launch',description:'Solid readable surface with restrained depth.',html:'<div class="ds-surface"><strong>Writer</strong><p>Start with a blank page.</p></div>',css:`.ds-surface{${font}padding:26px;border:1px solid var(--line,#e5e5ea);border-radius:18px;background:var(--surface,#fff);color:var(--text,#1d1d1f);box-shadow:0 2px 8px rgba(30,40,65,.035),0 12px 32px rgba(30,40,65,.025)}.ds-surface p{color:var(--muted,#63636b);line-height:1.65}`},
);
// Keep the panel narrative verbatim with the canonical Markdown record.
const design = readFileSync(new URL('../DESIGN.md', import.meta.url), 'utf8');
const sections = Object.fromEntries([...design.matchAll(/^## ([^\r\n]+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(([,name,body])=>[name,body.trim()]));
const overview = sections.Overview;
record.narrative = {
  northStar: overview.match(/\*\*Creative North Star: "([^"]+)"\*\*/)[1],
  overview: overview.split('**Key Characteristics:**')[0].replace(/^\*\*Creative North Star:[^\r\n]+\r?\n+/, '').trim(),
  keyCharacteristics: [...overview.split('**Key Characteristics:**')[1].matchAll(/^- (.+)$/gm)].map(([,value])=>value.trim()),
  rules: ['Colors', 'Typography', 'Elevation & Depth'].flatMap(section=>[...sections[section].matchAll(/\*\*The (.+?) Rule\.\*\* (.+)/g)].map(([,name,body])=>({name:`The ${name} Rule`,body:body.trim(),section:section==='Elevation & Depth'?'elevation':section.toLowerCase()}))),
  dos: [...sections["Do's and Don'ts"].matchAll(/^- (Do .+)$/gm)].map(([,value])=>value.trim()),
  donts: [...sections["Do's and Don'ts"].matchAll(/^- (Don't .+)$/gm)].map(([,value])=>value.trim()),
};
// Metadata keys follow frontmatter names, including literal component/error colors.
const colorBlock = design.split('colors:')[1].split('typography:')[0];
record.extensions.colorMeta = Object.fromEntries([...colorBlock.matchAll(/^  ([a-z-]+): "([^"]+)"/gm)].map(([,key,value])=>[key,{
  role:key==='accent'||key==='dark-accent'||key==='primary-hover'?'primary':'neutral',
  displayName:key.replaceAll('-',' '),
  tonalRamp:Array.from({length:8},(_,i)=>`oklch(from ${value} ${15+i*80/7}% c h)`),
}]));
for (const component of record.components) {
  component.css = component.css.replaceAll('"Segoe UI",sans-serif', '"Segoe UI Variable","Segoe UI",sans-serif').replaceAll('outline:3px solid #0067d8', 'outline:3px solid var(--accent,#0067d8)');
  if (component.kind === 'button' || component.kind === 'nav') {
    const selector = component.html.match(/class="([^"]+)"/)[1];
    component.css += `.${selector}{font-weight:${component.kind==='nav'?500:550};min-height:${component.kind==='nav'?42:36}px;transition:background-color 120ms ease-out,border-color 120ms ease-out,box-shadow 120ms ease-out,transform 100ms ease-out}.${selector}:active:not(:disabled){transform:scale(.985)}.${selector}:disabled{cursor:default;opacity:.5}@media(prefers-reduced-motion:reduce){.${selector}{transition:none}.${selector}:active:not(:disabled){transform:none}}`;
  }
}
const searchPreview = record.components.find(component=>component.refersTo==='search');
searchPreview.html = '<label class="ds-search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><input aria-label="Search" placeholder="Search apps and documents"/><kbd>Ctrl K</kbd></label>';
searchPreview.css = '.ds-search{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI Variable","Segoe UI",sans-serif;display:flex;align-items:center;gap:9px;width:324px;max-width:100%;min-height:35px;padding:7px 10px;border:1px solid var(--line,#e5e5ea);border-radius:9px;background:var(--canvas,#f5f5f7);color:var(--muted,#63636b)}.ds-search svg{flex-shrink:0}.ds-search input{font:400 12px -apple-system,BlinkMacSystemFont,"Segoe UI Variable","Segoe UI",sans-serif;width:100%;min-width:0;border:0;outline:none;background:none;color:var(--text,#1d1d1f);caret-color:var(--accent,#0067d8)}.ds-search input::placeholder{color:var(--muted,#63636b);opacity:1}.ds-search:focus-within{outline:3px solid var(--accent,#0067d8);outline-offset:2px}.ds-search kbd{font:500 10px -apple-system,BlinkMacSystemFont,"Segoe UI Variable","Segoe UI",sans-serif;padding:2px 5px;border-radius:4px;border:1px solid var(--line,#e5e5ea);background:var(--surface,#fff);white-space:nowrap}';
writeFileSync(new URL('../.impeccable/design.json', import.meta.url), JSON.stringify(record,null,2)+'\n');
