/**
 * Discord Webhook 通知ユーティリティ
 * チャットセッション開始時などの通知を送信する
 */

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: string;
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
}

/**
 * Discord Webhookにメッセージを送信
 */
export async function sendDiscordNotification(message: DiscordMessage): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_CHAT;
  
  if (!webhookUrl) {
    console.warn('[Discord] DISCORD_WEBHOOK_CHAT is not set. Notification skipped.');
    return false;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!res.ok) {
      console.error(`[Discord] Webhook failed: ${res.status}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Discord] Webhook error:', err);
    return false;
  }
}

/**
 * 新しいチャットセッション開始通知
 */
export async function notifyChatSessionStarted(data: {
  name: string;
  email: string;
  sessionId: string;
}): Promise<void> {
  const now = new Date();
  const timeStr = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  await sendDiscordNotification({
    embeds: [{
      title: '💬 新しいチャットセッション開始',
      color: 0xC5A059, // Melloのプライマリカラー
      fields: [
        { name: '👤 名前', value: data.name, inline: true },
        { name: '📧 メール', value: data.email, inline: true },
        { name: '🕐 開始時刻', value: timeStr, inline: false },
      ],
      footer: { text: `Session: ${data.sessionId}` },
      timestamp: now.toISOString(),
    }],
  });
}

/**
 * チャットセッション終了通知（上限到達時）
 */
export async function notifyChatSessionEnded(data: {
  name: string;
  email: string;
  sessionId: string;
  messageCount: number;
}): Promise<void> {
  const now = new Date();

  await sendDiscordNotification({
    embeds: [{
      title: '✅ チャットセッション終了（上限到達）',
      color: 0x4CAF50,
      fields: [
        { name: '👤 名前', value: data.name, inline: true },
        { name: '📧 メール', value: data.email, inline: true },
        { name: '💬 メッセージ数', value: `${data.messageCount}件`, inline: true },
      ],
      footer: { text: `Session: ${data.sessionId}` },
      timestamp: now.toISOString(),
    }],
  });
}
