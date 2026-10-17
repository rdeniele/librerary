export type AppEntry = { id: string; name: string; description: string; category: string; available: boolean; shortcut: string };
export const catalog: AppEntry[] = [
  { id: 'writer', name: 'Writer', description: 'A quiet place for your words. Plain text foundation.', category: 'Office', available: true, shortcut: 'W' },
  { id: 'sheets', name: 'Sheets', description: 'Organize numbers, formulas, and ideas.', category: 'Office', available: false, shortcut: 'S' },
  { id: 'slides', name: 'Slides', description: 'Turn your ideas into presentations.', category: 'Office', available: false, shortcut: 'L' },
  { id: 'pdf', name: 'PDF', description: 'Read, annotate, and organize documents.', category: 'Office', available: false, shortcut: 'P' },
  { id: 'design', name: 'Design', description: 'Compose layouts and everyday graphics.', category: 'Creative', available: false, shortcut: 'D' },
  { id: 'photo', name: 'Photo', description: 'Work with images, layers, and color.', category: 'Creative', available: false, shortcut: 'H' },
  { id: 'vector', name: 'Vector', description: 'Draw precise paths and illustrations.', category: 'Creative', available: false, shortcut: 'V' },
  { id: 'studio', name: 'Studio', description: 'Make beats, arrange, and mix music.', category: 'Sound', available: false, shortcut: 'M' },
  { id: 'audio', name: 'Audio', description: 'Record and edit audio waveforms.', category: 'Sound', available: false, shortcut: 'A' },
  { id: 'video', name: 'Video', description: 'Cut footage and tell your story.', category: 'Creative', available: false, shortcut: 'I' },
  { id: 'motion', name: 'Motion', description: 'Bring compositions to life.', category: 'Creative', available: false, shortcut: 'O' },
  { id: 'publish', name: 'Publish', description: 'Lay out multipage publications.', category: 'Creative', available: false, shortcut: 'B' },
  { id: '3d', name: '3D', description: 'Explore scenes, materials, and space.', category: 'Creative', available: false, shortcut: 'T' },
];
