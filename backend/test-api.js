const axios = require('axios');

async function checkApi() {
  const apiUrl = 'http://localhost:3001/startups';
  console.log(`Checking API at ${apiUrl}...`);
  try {
    const res = await axios.get(apiUrl);
    console.log('API Status:', res.status);
    console.log('Total Jobs in DB (from meta):', res.data.meta?.total);
    console.log('Sample Job Names:', res.data.data.slice(0, 3).map(j => j.name));
  } catch (err) {
    console.error('API Error:', err.message);
    if (err.response) {
       console.log('Response Status:', err.response.status);
       console.log('Response Data:', err.response.data);
    }
  }
}

checkApi();
