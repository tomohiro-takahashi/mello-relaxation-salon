import { ensureAutonomousPosts, getDoc } from './src/lib/google/sheets';

const SHEET_ID = '1_XUKkQljJr2zaVj1tn8RbZiB7ACAzcs4LuXDqh2490A';
const CLIENT_EMAIL = 'mello-x-bot@gen-lang-client-0328700901.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1Fd+rpmZN7oO9\ndtzQuX4Bfi6bIOwMRA/4J1Kn7oib92CbNRmVCYsSdjTsSyMHrXTq4gRkRdjLowPT\nZPOAL40hGe6J8Fj12STQdVYRJ0yny6fm6JR87RS/FDAYR3RAhfYMAdsGn9/DAw3i\neMQ0RPtREG2enbtSQrhrAC07S5mflRrT9IFZXsw8xZkgWOhCXyZzD/QqEL1ElaHv\nfBg66b+51SytT0+E1xAyqXYOr/YGLkMGUjCPFS7PfViTOyQGuyE1fFxJNphob+zu\nXRbUcE30dDsgxCGp3AJ5rsDaN7K/BdEEPIJGxz9vTdLi7UHFWvha5fJnNsivW6Je\ne2TeQUjHAgMBAAECggEATi0sS8lhn0FaRIA9IisCWBimfDhBT6ZOkp4/U9ppxZON\ndFP/QFVHYegAPwbND7J1qDV9GeEBkCBHNYr+iJd+wQyV650EetaMyyXsyykBMet9\nB/XerPQZIcjQXpryeCydJV/js79vdZwq8VubsMkbCksiV/jWdtPxE9iWrmOb5cVa\nTaREF6ZjGfQFuaWdR3PeHOXgVHR6QMUrDm4E8539Qyc3F5iotVX3avG9jYm7xrbP\nJqInyiVlUYJ2v+kgdGfsbZVzg/KYnPzrZBBQMYaVuq6kpa8bEUS0R0VQMk8ZFDVI\nEFfLa70gcbXWASR7StY1iBuAh5bpyN91m+jKy1pOAQKBgQDZ4nlUuaC11M+FaWjh\nkua2spJKAoIIrgfXQmY6Zc6NifapnRER3HDHajDP9LKrwtK/jargChOdkeYddDwL\nVSypPeE9duYAbWQ2LAuy1gW0Bb84/XtFtLnhXWq0qSDDTnJxmTrvfXYGdD1m7n6s\n8xI2hoQ6FoiBmGhIV33hf3UJxwKBgQDUw2u48Z/JlYI1gOPI29BxaOw45UEQ0Fvd\njeL55OVVVn3Uewp92Hm2hSkVb9FbvXmzEdq/5AvlaqcSa0PALfTZp9/gZ1QEklE+\n5eXlXba69wTbArRRTMj5BKddfjasPHbHLUM/RqXLUX1h5LhNSu/kRe1M50ib6L+X\nfPvgzOnJAQKBgB9+de1CO7GsxiZRm0Bn3INyAmVCQYuBpE6AIYi1aIra81WHB42e\nYIrilZWpmB3ttkrL7nQd4MH48ds2DuvQbvkzoZgh1JMhPMf7y+EYwJBJ+F8DfMsR\nmYCy4RamD79LWo2DCZrOdr3uFWYIeTUEmZBaF0jSMv8QiZpTUzXCF6fHAoGATylm\nqyk7ioVWLRIHrnQa2hdvzLt/ugHMLGLeUJwZt+a2aphdDvW8U2y4HIG+I6Qb48SA\n32S6CGHmR7QhQR/YOiN76MKJQCowkHZ5Ux3LH0VJSTN4Y8dt/zj8DI0pSmw0xWbR\n3nkqtrtbK1EuQZPgLc7WvAZRvbCbmIGoNbwIQAECgYA/mNwrN9HlzIXNQoq7X1sC\nsnLfMAbosa1ORlpiQHNH8BkFsxrCsRK34jhEIgMNcXbPUlspFRSXuVxuPlmUAlMK\nYIQPKbuOxyYVOESBAJwNcOTi77RUBjjbYnxETKbpzu/w8goTZuvsuXArQhxi+qK4\nwH5TeE/67ohYJYhNz39qKg==\n-----END PRIVATE KEY-----\n`;

process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = CLIENT_EMAIL;
process.env.GOOGLE_PRIVATE_KEY = PRIVATE_KEY;
process.env.GOOGLE_SHEET_ID_X_POSTS = SHEET_ID;
process.env.GEMINI_API_KEY = 'AIzaSyCvTmiGu6Ttjz1Z2uY0G5wsag7O0-bZkbg';

async function run() {
  const { ensureAutonomousPosts, getDoc } = await import('./src/lib/google/sheets');
  
  console.log('--- Clearing sheet rows ---');
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  for (const row of rows) {
    await row.delete();
  }

  // ヘッダーを更新するために一度初期化プロセスを経由させる
  console.log('--- Updating Headers ---');
  await sheet.setHeaderRow(['ScheduleTime', 'DisplayTimeJST', 'Account', 'Content', 'Status', 'Topic', 'Log']);

  console.log('--- Generating new schedule with LOCAL latest logic ---');
  await ensureAutonomousPosts();
  console.log('--- Done ---');
}

run().catch(console.error);
