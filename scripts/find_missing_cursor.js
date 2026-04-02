const fs = require('fs');
const base = 'C:/Nhung/EzyPM/EzyPMUIMockup/';
const files = [
  'src/app/projects/[id]/page.tsx',
  'src/app/projects/page.tsx',
  'src/app/tasks/page.tsx',
  'src/app/tasks/[id]/page.tsx',
  'src/app/team/page.tsx',
  'src/app/team/[id]/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/activities/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/reports/page.tsx',
  'src/components/ui/CreateTaskModal.tsx',
  'src/components/ui/Modal.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/layout/Header.tsx'
];

for (const file of files) {
  const content = fs.readFileSync(base + file, 'utf8');
  const lines = content.split('\n');
  const results = [];

  let i = 0;
  while (i < lines.length) {
    if (lines[i].includes('<button')) {
      const startLine = i + 1;
      const firstLine = lines[i].trim();
      // Accumulate lines until we find the closing > of the opening tag
      let tag = '';
      let j = i;
      while (j < lines.length) {
        tag += lines[j] + '\n';
        // Strip string literals to avoid false > matches inside them
        const stripped = tag
          .replace(/"[^"]*"/g, '""')
          .replace(/`[^`]*`/g, '``')
          .replace(/'[^']*'/g, "''");
        if (/<button[^>]*>/.test(stripped)) break;
        j++;
        if (j - i > 30) break; // safety limit
      }
      if (!tag.includes('cursor-pointer')) {
        // Extract className value - handles both string literals and JSX expressions
        let classDisplay = '(no className)';
        const classStrMatch = tag.match(/className=["'`]([^"'`]*)["'`]/);
        if (classStrMatch) {
          classDisplay = 'className="' + classStrMatch[1].replace(/\s+/g, ' ').trim() + '"';
        } else {
          // Try JSX expression className={...}
          const classExprMatch = tag.match(/className=(\{[^}]*\})/);
          if (classExprMatch) {
            classDisplay = 'className=' + classExprMatch[1].replace(/\s+/g, ' ').trim();
          }
        }
        results.push('  Line ' + startLine + ': <button ... ' + classDisplay);
      }
    }
    i++;
  }

  if (results.length > 0) {
    console.log('\n=== ' + file + ' ===');
    results.forEach(r => console.log(r));
  }
}
