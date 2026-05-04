import { Resend } from 'resend';

const apiKey = 're_2b5Z4Y6p_DRFnwRj3b6XP1Zs33Biix8Lw';

if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
  console.error('Missing API key. Replace YOUR_API_KEY_HERE first.');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function run() {
  console.log('Sending test email...');

  const result = await resend.emails.send({
    from: 'Measures Registry <connect@measuresregistry.com>',
    to: 'contribute2c3communitypartners@gmail.com',
    subject: 'Measures Registry test email',
    text: 'This is a test email from Measures Registry.',
  });

  console.log('Resend result:');
  console.log(JSON.stringify(result, null, 2));
}

run().catch((error) => {
  console.error('Send failed:');
  console.error(error);
  process.exit(1);
});