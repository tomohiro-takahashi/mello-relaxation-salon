import { TwitterApi } from 'twitter-api-v2';
import { XAccountType } from '../ai/post-generator';

interface XCredentials {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
}

function getCredentials(accountType: XAccountType): XCredentials {
  if (accountType === 'owner') {
    return {
      appKey: process.env.X_OWNER_API_KEY || '',
      appSecret: process.env.X_OWNER_API_SECRET || '',
      accessToken: process.env.X_OWNER_ACCESS_TOKEN || '',
      accessSecret: process.env.X_OWNER_ACCESS_SECRET || '',
    };
  } else {
    return {
      appKey: process.env.X_ICHINOSE_API_KEY || '',
      appSecret: process.env.X_ICHINOSE_API_SECRET || '',
      accessToken: process.env.X_ICHINOSE_ACCESS_TOKEN || '',
      accessSecret: process.env.X_ICHINOSE_ACCESS_SECRET || '',
    };
  }
}

export async function sendXPost(accountType: XAccountType, content: string) {
  const credentials = getCredentials(accountType);
  
  if (!credentials.appKey || !credentials.accessToken) {
    throw new Error(`Missing X API credentials for account: ${accountType}`);
  }

  const client = new TwitterApi({
    appKey: credentials.appKey,
    appSecret: credentials.appSecret,
    accessToken: credentials.accessToken,
    accessSecret: credentials.accessSecret,
  });

  // V2 API で投稿
  const response = await client.v2.tweet(content);
  return response;
}
