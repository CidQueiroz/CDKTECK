// debug-linking.js
const fs = require('fs');
const path = require('path');

console.log('=== DEPURAÇÃO DE LINKING ===\n');

// 1. Verificar se o pacote existe em node_modules
const packagePath = path.join(__dirname, 'node_modules', '@cidqueiroz', 'cdkteck-ui');
console.log('1. Pacote em node_modules:', fs.existsSync(packagePath));
if (fs.existsSync(packagePath)) {
  console.log('   Conteúdo:', fs.readdirSync(packagePath));
  console.log('   É link simbólico?', fs.lstatSync(packagePath).isSymbolicLink());
}

// 2. Verificar package.json do pacote linked
try {
  const linkedPackageJson = require(packagePath + '/package.json');
  console.log('\n2. Package.json do pacote linked:');
  console.log('   main:', linkedPackageJson.main);
  console.log('   types:', linkedPackageJson.types);
  console.log('   exports:', JSON.stringify(linkedPackageJson.exports, null, 2));
} catch (e) {
  console.log('\n2. ERRO ao ler package.json:', e.message);
}

// 3. Tentar resolver o módulo
console.log('\n3. Tentativa de resolução:');
try {
  const resolved = require.resolve('@cidqueiroz/cdkteck-ui');
  console.log('   Resolvido para:', resolved);
  
  // Verificar se o arquivo resolvido existe
  console.log('   Arquivo existe:', fs.existsSync(resolved));
  
  // Verificar conteúdo do diretório
  const dir = path.dirname(resolved);
  console.log('   Diretório:', dir);
  console.log('   Conteúdo do diretório:', fs.readdirSync(dir));
} catch (e) {
  console.log('   ERRO na resolução:', e.message);
}

// 4. Verificar estrutura do source do pacote linked
console.log('\n4. Estrutura do pacote source:');
const sourcePath = path.join(__dirname, '..', 'cdkteck-ui');
if (fs.existsSync(sourcePath)) {
  console.log('   Source existe em:', sourcePath);
  
  // Verificar se tem dist
  const distPath = path.join(sourcePath, 'dist');
  console.log('   Pasta dist existe:', fs.existsSync(distPath));
  if (fs.existsSync(distPath)) {
    console.log('   Conteúdo de dist:', fs.readdirSync(distPath));
  }
  
  // Verificar se tem src/index.ts
  const srcIndexPath = path.join(sourcePath, 'src', 'index.ts');
  console.log('   src/index.ts existe:', fs.existsSync(srcIndexPath));
  if (fs.existsSync(srcIndexPath)) {
    console.log('   Conteúdo de src/index.ts:');
    console.log(fs.readFileSync(srcIndexPath, 'utf8').substring(0, 500));
  }
}

console.log('\n=== FIM DA DEPURAÇÃO ===');