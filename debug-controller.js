// Script para descobrir exatamente qual service o controller usa
const path = require('path');

// Simular o controller v1
const controllerV1Path = './src/domains/realms/accounts/v1/account.controller.ts';
const controllerLatestPath = './src/domains/realms/accounts/latest/account.controller.ts';

console.log('=== DEBUG: Descobrindo imports do controller ===');

// Ler o arquivo v1
const fs = require('fs');
const controllerV1Content = fs.readFileSync(controllerV1Path, 'utf8');
console.log('Controller v1 content:');
console.log(controllerV1Content);

console.log('\n=== Controller latest content ===');
const controllerLatestContent = fs.readFileSync(controllerLatestPath, 'utf8');
console.log(controllerLatestContent);

// Procurar imports de service
const serviceImportRegex = /import.*from.*service/gi;
const v1Imports = controllerV1Content.match(serviceImportRegex);
const latestImports = controllerLatestContent.match(serviceImportRegex);

console.log('\n=== Imports encontrados ===');
console.log('V1 imports:', v1Imports);
console.log('Latest imports:', latestImports);