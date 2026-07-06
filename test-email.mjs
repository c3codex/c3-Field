import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('Missing API key. Set RESEND_API_KEY in the environment before running this script.');
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