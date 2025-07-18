const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const getUnusedImports = async (filePaths, rootDir) => {
  const results = [];

  for (const relPath of filePaths) {
    const absPath = path.join(rootDir, relPath);
    let code;

    try {
      code = fs.readFileSync(absPath, 'utf-8');
    } catch (err) {
      console.warn(`❌ Failed to read: ${relPath}`);
      continue;
    }

    let ast;

    try {
      ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });
    } catch (err) {
      console.warn(`❌ Failed to parse: ${relPath}`);
      continue;
    }

    const imports = [];
    const used = new Set();

    traverse(ast, {
      ImportDeclaration(path) {
        imports.push(...path.node.specifiers.map(spec => spec.local.name));
      },
      Identifier(path) {
        used.add(path.node.name);
      },
    });

    const unused = imports.filter(name => !used.has(name));

    if (unused.length > 0) {
      results.push({
        file: relPath,
        unusedImports: unused,
      });
    }
  }

  return results;
};

module.exports = getUnusedImports;
