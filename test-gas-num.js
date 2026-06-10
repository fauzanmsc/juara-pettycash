const gasUrl = "https://script.google.com/macros/s/AKfycbzBeocLucscWJF0ZpYvS2PqEHJAACmx4CwX0V8XpJybYHiS2cgbujliw9rgC_kixHwn/exec";

async function test() {
  try {
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email: 'finance@jefgroup.id',
        password: 1234
      }),
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.substring(0, 200));
  } catch (err) {
    console.error(err);
  }
}
test();
