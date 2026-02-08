import { pool } from './src/config/db.js';

async function test() {
  try {
    console.log('=== CHECKING DATABASE FOR TEAM REGISTRATIONS ===\n');
    
    // Check if team_registration_id column exists
    console.log('1. Checking if team columns exist...');
    const { rows: columns } = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'arcade_registrations' 
      AND column_name LIKE '%team%';
    `);
    
    if (columns.length === 0) {
      console.log('❌ NO team_registration_id column found in arcade_registrations table!');
      console.log('   You need to add this column:\n');
      console.log('   ALTER TABLE arcade_registrations ADD COLUMN team_registration_id UUID;');
    } else {
      console.log('✓ Team columns found:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
      });
    }
    
    console.log('\n2. Checking all registrations...');
    const { rows } = await pool.query(`
      SELECT 
        r.id,
        r.name,
        r.category,
        r.team_registration_id,
        w.wallet_code
      FROM arcade_registrations r
      LEFT JOIN arcade_wallets w ON w.registration_id = r.id AND w.event_key = 'advitya'
      WHERE r.event_key = 'advitya'
      ORDER BY r.category, r.name
      LIMIT 20;
    `);
    
    console.log(`Found ${rows.length} registrations:\n`);
    
    let teamCount = 0;
    let memberCount = 0;
    
    rows.forEach(r => {
      const isTeamLead = r.category === 'TEAM' && !r.team_registration_id;
      const isMember = r.team_registration_id !== null;
      
      if (isTeamLead) teamCount++;
      if (isMember) memberCount++;
      
      console.log(`${isTeamLead ? '👥 TEAM LEAD' : isMember ? '  └─ Member' : '👤'} ${r.name}`);
      console.log(`   Category: ${r.category}`);
      console.log(`   Wallet: ${r.wallet_code || 'NO WALLET'}`);
      console.log(`   Team ID: ${r.team_registration_id || 'NULL'}`);
      console.log('');
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total registrations: ${rows.length}`);
    console.log(`Team leads: ${teamCount}`);
    console.log(`Team members: ${memberCount}`);
    
    if (teamCount === 0 && memberCount === 0) {
      console.log('\n❌ NO TEAM REGISTRATIONS FOUND!');
      console.log('   The wallet you\'re testing is not part of a team.');
      console.log('   To test team features, you need to create team registrations in the database.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

test();
