// Script para renomear collections do plural para singular
// Execute com: node scripts/rename-collections.js

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env.development.local' });

const MONGO_HOST = 'mongo';
const MONGO_PORT = 27017;
const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME || 'root';
const MONGO_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD || 'root_pass';
const DB_NAME = process.env.MONGODB_CORE_DBNAME || 'idm-core-db';

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`;

// Mapeamento: nome atual (plural) -> nome novo (singular)
const RENAMES = {
  accounts: 'account',
  roles: 'role',
  policies: 'policy',
  groups: 'group',
  applications: 'application',
  realms: 'realm',
  'account-roles': 'account-role',
  'account-groups': 'account-group',
  'account-policies': 'account-policy',
  'role-policies': 'role-policy',
  'group-roles': 'group-role',
  'group-policies': 'group-policy',
  'application-configurations': 'application-configuration',
};

async function listCollections(db) {
  console.log('\n=== COLLECTIONS ATUAIS ===');
  const collections = await db.listCollections().toArray();
  collections.forEach((col) => {
    const willRename = RENAMES[col.name] ? `-> ${RENAMES[col.name]}` : '';
    console.log(`  ${col.name} ${willRename}`);
  });
  console.log(`\nTotal: ${collections.length} collections\n`);
  return collections;
}

async function mergeRealms(db, dryRun = true) {
  console.log('\n=== MESCLANDO realms -> realm ===');
  
  const realmCount = await db.collection('realm').countDocuments();
  const realmsCount = await db.collection('realms').countDocuments();
  
  console.log(`realm (singular): ${realmCount} documentos`);
  console.log(`realms (plural): ${realmsCount} documentos`);
  
  if (realmsCount === 0) {
    console.log('✓ realms está vazia, apenas deletando...');
    if (!dryRun) {
      await db.collection('realms').drop();
      console.log('✅ realms deletada');
    }
    return;
  }
  
  if (dryRun) {
    console.log(`✓ Copiaria ${realmsCount} documentos de realms para realm`);
    console.log('✓ Deletaria collection realms');
  } else {
    const docs = await db.collection('realms').find({}).toArray();
    if (docs.length > 0) {
      await db.collection('realm').insertMany(docs);
      console.log(`✅ ${docs.length} documentos copiados para realm`);
    }
    await db.collection('realms').drop();
    console.log('✅ realms deletada');
  }
}

async function renameCollections(db, dryRun = true) {
  const collections = await db.listCollections().toArray();
  const existingNames = collections.map((c) => c.name);

  console.log(
    dryRun ? '\n=== DRY RUN (simulação) ===' : '\n=== RENOMEANDO ==='
  );

  for (const [oldName, newName] of Object.entries(RENAMES)) {
    if (!existingNames.includes(oldName)) {
      console.log(`⏭️  SKIP: ${oldName} não existe`);
      continue;
    }

    if (existingNames.includes(newName)) {
      console.log(`⚠️  AVISO: ${newName} já existe! Pulando ${oldName}`);
      continue;
    }

    if (dryRun) {
      console.log(`✓ Renomearia: ${oldName} -> ${newName}`);
    } else {
      try {
        await db.collection(oldName).rename(newName);
        console.log(`✅ Renomeado: ${oldName} -> ${newName}`);
      } catch (error) {
        console.error(`❌ ERRO ao renomear ${oldName}:`, error.message);
      }
    }
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

    const db = client.db(DB_NAME);

    if (command === 'list') {
      await listCollections(db);
    } else if (command === 'dry-run') {
      await listCollections(db);
      await renameCollections(db, true);
    } else if (command === 'merge-realms') {
      await mergeRealms(db, false);
    } else if (command === 'rename') {
      await listCollections(db);
      console.log('\n⚠️  ATENÇÃO: Isso vai REALMENTE renomear as collections!');
      console.log('Aguardando 5 segundos... (Ctrl+C para cancelar)\n');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await renameCollections(db, false);
      console.log('\n✅ Concluído!');
      await listCollections(db);
    } else {
      console.log(`
Uso:
  node scripts/rename-collections.js list           # Lista collections
  node scripts/rename-collections.js dry-run        # Simula renomeação
  node scripts/rename-collections.js merge-realms   # Mescla realms -> realm
  node scripts/rename-collections.js rename         # Renomeia de verdade

Exemplo:
  MONGO_URI="mongodb://localhost:27017" DB_NAME="mydb" node scripts/rename-collections.js list
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
