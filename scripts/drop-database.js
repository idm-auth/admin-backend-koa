// Script para remover banco de dados
// Execute com: node scripts/drop-database.js

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env.development.local' });

const MONGO_HOST = 'mongo';
const MONGO_PORT = 27017;
const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME || 'root';
const MONGO_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD || 'root_pass';
const DB_NAME = process.env.MONGODB_CORE_DBNAME || 'idm-core-db';

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`;

const PROTECTED_DBS = ['admin', 'config', 'local', 'idm-core-db'];

async function listDatabases(client) {
  console.log('\n=== DATABASES DISPONÍVEIS ===');
  const { databases } = await client.db().admin().listDatabases();
  databases.forEach((db) => {
    const isProtected = PROTECTED_DBS.includes(db.name) ? '(protegido)' : '';
    console.log(`  ${db.name} ${isProtected}`);
  });
  console.log(`\nTotal: ${databases.length} databases\n`);
}

async function dropTestDatabases(client, dryRun = true) {
  const { databases } = await client.db().admin().listDatabases();
  const testDbs = databases
    .map(db => db.name)
    .filter(name => !PROTECTED_DBS.includes(name));

  console.log(dryRun ? '\n=== DRY RUN (simulação) ===' : '\n=== REMOVENDO DATABASES ===');
  console.log(`\nDatabases protegidos: ${PROTECTED_DBS.join(', ')}`);
  console.log(`\nDatabases de teste (${testDbs.length}):`);
  testDbs.forEach(name => console.log(`  - ${name}`));

  if (testDbs.length === 0) {
    console.log('\n✓ Nenhum database de teste para remover');
    return;
  }

  if (dryRun) {
    console.log(`\n✓ Removeria ${testDbs.length} databases`);
  } else {
    for (const name of testDbs) {
      await client.db(name).dropDatabase();
      console.log(`✅ ${name} removido`);
    }
    console.log(`\n✅ ${testDbs.length} databases removidos com sucesso!`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!MONGO_URI || !DB_NAME) {
    console.error('❌ Configure MONGO_URI e DB_NAME');
    process.exit(1);
  }

  console.log(`Conectando em: mongodb://${MONGO_USER}:****@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`);
  console.log(`Database: ${DB_NAME}`);

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');

    if (command === 'list') {
      await listDatabases(client);
    } else if (command === 'dry-run') {
      await dropTestDatabases(client, true);
    } else if (command === 'drop') {
      console.log('\n⚠️  ATENÇÃO: Isso vai REALMENTE remover os databases de teste!');
      console.log('Aguardando 5 segundos... (Ctrl+C para cancelar)\n');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await dropTestDatabases(client, false);
      await listDatabases(client);
    } else {
      console.log(`
Uso:
  node scripts/drop-database.js list      # Lista databases
  node scripts/drop-database.js dry-run   # Simula remoção dos databases de teste
  node scripts/drop-database.js drop      # Remove databases de teste

Databases protegidos: admin, config, local, idm-core-db
      `);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Conexão fechada');
  }
}

main();
