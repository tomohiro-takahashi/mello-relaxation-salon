export async function sendDiscordNotification(message: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL is not set. Skipping notification.');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Discord notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}

export function formatBookingMessage(data: any) {
  return `
**🔔 新規予約リクエスト通知 [Mello]**
━━━━━━━━━━━━━━━━━━━━━━━━
👤 **お客様名**: ${data.name || '未入力'}
📅 **希望日**: ${data.date}
⏰ **希望時間**: ${data.time}
📧 **メール**: ${data.email || 'なし'}
📞 **電話番号**: ${data.phone || 'なし'}
🆔 **セッションID**: \`${data.sessionId || 'なし'}\`
━━━━━━━━━━━━━━━━━━━━━━━━
※ 管理画面または Firestore から詳細を確認してください。
  `.trim();
}

export function formatInquiryMessage(data: any) {
  return `
**📧 新規お問い合わせ通知 [Mello]**
━━━━━━━━━━━━━━━━━━━━━━━━
👤 **お名前**: ${data.name}
📧 **メール**: ${data.email}
📝 **メッセージ**:
${data.message}
━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}
