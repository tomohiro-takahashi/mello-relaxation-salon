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

export function formatXCronResultMessage(results: any[]) {
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const manualCount = results.filter(r => r.status === 'manual_skip').length;
  
  let details = '';
  results.forEach(r => {
    const icon = r.status === 'success' ? '✅' : (r.status === 'error' ? '❌' : '⚠️');
    details += `\n${icon} ${r.account || '不明'}: ${r.status}${r.reason ? ` (${r.reason})` : ''}`;
  });

  return `
**🤖 X自動投稿 実行結果報告 [Mello]**
━━━━━━━━━━━━━━━━━━━━━━━━
✅ 成功: ${successCount}件
⚠️ 手動待ち: ${manualCount}件
❌ エラー: ${errorCount}件

**【実行詳細】**${details}
━━━━━━━━━━━━━━━━━━━━━━━━
※ エラーが発生した場合は、GoogleスプレッドシートやXのデベロッパーポータルを確認してください。
  `.trim();
}
