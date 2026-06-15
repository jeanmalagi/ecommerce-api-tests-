import fetch from 'node-fetch';

const url = 'http://localhost:3000/api/health';

async function wait() {
  for (let i = 0; i < 15; i++) {
    try {
      await fetch(url);
      console.log('✅ API pronta');
      process.exit(0);
    } catch (e) {
      console.log('⏳ Aguardando API...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.error('❌ API não subiu');
  process.exit(1);
}

wait();