const url = 'http://localhost:3000/api/products';

async function wait() {
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(url);

      if (res.ok) {
        console.log('✅ API pronta');
        process.exit(0);
      }

      throw new Error('API não respondeu OK');

    } catch (e) {
      console.log('⏳ Aguardando API...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.error('❌ API não subiu');
  process.exit(1);
}

wait();