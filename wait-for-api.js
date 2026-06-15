const url = 'http://localhost:3000/api/products';

async function wait() {
  for (let i = 0; i < 30; i++) { // mais tempo
    try {
      const res = await fetch(url);

      if (res.status === 200) {
        console.log('✅ API pronta');
        process.exit(0);
      }

    } catch (e) {}

    console.log('⏳ Aguardando API...');
    await new Promise(r => setTimeout(r, 3000));
  }

  console.error('❌ API não subiu');
  process.exit(1);
}

wait();