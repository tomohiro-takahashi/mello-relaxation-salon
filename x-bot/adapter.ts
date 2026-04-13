import { chromium, BrowserContext, Page } from 'playwright';
import { BrandConfig, CONFIG, randomDelay, sleep, log, logError, randomPick } from './config';

// ─────────────────────────────────────────────
// TwitterAdapter — Playwright ブラウザ操作
// 専用プロファイル（chrome-profile-x-ichinose）を使用するため
// 他のPlaywrightインスタンス（Spoonボット等）と同時起動可能
// ─────────────────────────────────────────────

export class TwitterAdapter {
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private brand: BrandConfig;

  constructor(brand: BrandConfig = CONFIG.brand) {
    this.brand = brand;
  }

  // ── 初期化 & ログイン確認 ──────────────────

  async initialize(): Promise<boolean> {
    // SingletonLock 対策（前回クラッシュ時の残骸を削除）
    try {
      const { execSync } = require('child_process');
      execSync(`rm -rf ${this.brand.profileDir}/Singleton* 2>/dev/null || true`);
    } catch {}

    log(`🚀 ブラウザ起動中... (${this.brand.handle})`);

    try {
      this.context = await chromium.launchPersistentContext(this.brand.profileDir, {
        headless: false,
        channel: 'chrome',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 900 },
        args: [
          '--disable-blink-features=AutomationControlled',
          '--no-first-run',
          '--no-default-browser-check',
        ],
      });

      this.page = this.context.pages()[0] || await this.context.newPage();

      await this.page.goto('https://x.com/home', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(5000);

      const url = this.page.url();
      const loggedIn = url.includes('/home') && !url.includes('/login');

      if (loggedIn) {
        log(`✅ ログイン確認OK: ${this.brand.handle}`);
      } else {
        logError(`ログインが必要です: ${this.brand.handle} — 現在のURL: ${url}`);
      }

      return loggedIn;
    } catch (err) {
      logError('ブラウザ初期化失敗', err);
      return false;
    }
  }

  // ── ツイート投稿 ──────────────────────────

  async postTweet(content: string): Promise<{ success: boolean; error?: string }> {
    if (!this.page) return { success: false, error: 'Page not initialized' };

    try {
      log(`📝 投稿準備中...`);

      // ホームに移動
      await this.page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(3000);

      // テキストエリアをクリック
      const textarea = await this.page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
      if (!textarea) return { success: false, error: 'テキストエリアが見つかりません' };

      await textarea.click();
      await sleep(1000);

      // テキスト入力（タイピング遅延付き）
      await this.page.keyboard.type(content, { delay: CONFIG.delays.typingDelay });
      await sleep(2000);

      // 二重ペースト検証
      const inputText = await this.page.$eval('[data-testid="tweetTextarea_0"]', el => el.textContent || '');
      const snippet = content.substring(0, 15);
      const occurrences = (inputText.match(new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

      if (occurrences > 1) {
        log(`⚠️ 二重入力を検出。テキストエリアをクリアして再入力...`);
        await this.page.keyboard.press('Meta+a');
        await sleep(300);
        await this.page.keyboard.press('Backspace');
        await sleep(500);
        await this.page.keyboard.type(content, { delay: CONFIG.delays.typingDelay });
        await sleep(2000);
      }

      // 投稿ボタンを探してクリック
      const posted = await this.clickPostButton();

      if (posted) {
        log(`✅ 投稿完了: "${content.substring(0, 40)}..."`);
        return { success: true };
      } else {
        return { success: false, error: '投稿ボタンのクリックに失敗' };
      }
    } catch (err: any) {
      logError('投稿失敗', err);
      return { success: false, error: err.message };
    }
  }

  private async clickPostButton(): Promise<boolean> {
    if (!this.page) return false;

    // 複数セレクタでフォールバック
    const selectors = [
      '[data-testid="tweetButtonInline"]',
      '[data-testid="tweetButton"]',
      'button[type="button"]:has-text("Post")',
      'button[type="button"]:has-text("ポスト")',
    ];

    for (const selector of selectors) {
      try {
        const btn = await this.page.$(selector);
        if (btn) {
          const isDisabled = await btn.getAttribute('aria-disabled');
          if (isDisabled === 'true') continue;
          await btn.click();
          await sleep(3000);
          return true;
        }
      } catch {}
    }

    // 最終手段: Ctrl+Enter
    try {
      await this.page.keyboard.press('Control+Enter');
      await sleep(3000);
      return true;
    } catch {
      return false;
    }
  }

  // ── 検索 → いいね ──────────────────────────

  async searchAndLike(keyword: string, maxLikes: number): Promise<number> {
    if (!this.page) return 0;

    let totalLikes = 0;

    try {
      log(`❤️ いいね開始: "${keyword}" (最大${maxLikes}件)`);

      // 日本語ツイートを最新順で検索
      const query = encodeURIComponent(`${keyword} lang:ja`);
      await this.page.goto(`https://x.com/search?q=${query}&f=live`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(4000);

      // 3ラウンドのスクロールでいいねを実行
      for (let round = 0; round < 3 && totalLikes < maxLikes; round++) {
        const likeButtons = await this.page.$$('[data-testid="like"]');

        for (const btn of likeButtons) {
          if (totalLikes >= maxLikes) break;

          try {
            // ボタンが画面内にあるかチェック
            const isVisible = await btn.isVisible();
            if (!isVisible) continue;

            await btn.scrollIntoViewIfNeeded();
            await sleep(500);
            await btn.click();
            totalLikes++;
            log(`  ❤️ いいね ${totalLikes}/${maxLikes}`);

            // いいね間隔: 15-45秒
            await sleep(randomDelay(15000, 45000));
          } catch {
            // 個別のいいねが失敗しても続行
          }
        }

        // スクロールして新しいツイートを読み込む
        await this.page.evaluate(() => window.scrollBy(0, 800));
        await sleep(randomDelay(CONFIG.delays.scrollPauseMin, CONFIG.delays.scrollPauseMax));
      }

      log(`❤️ いいね完了: ${totalLikes}件 ("${keyword}")`);
    } catch (err) {
      logError(`いいね処理でエラー ("${keyword}")`, err);
    }

    return totalLikes;
  }

  // ── 検索 → フォロー ────────────────────────

  async searchAndFollow(keyword: string, maxFollows: number): Promise<number> {
    if (!this.page) return 0;

    let totalFollows = 0;

    try {
      log(`👤 フォロー開始: "${keyword}" (最大${maxFollows}件)`);

      // ユーザー検索
      const query = encodeURIComponent(`${keyword}`);
      await this.page.goto(`https://x.com/search?q=${query}&f=user`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(4000);

      // 3ラウンドのスクロールで候補を増やす
      for (let round = 0; round < 3 && totalFollows < maxFollows; round++) {
        const userCells = await this.page.$$('[data-testid="UserCell"]');

        for (const cell of userCells) {
          if (totalFollows >= maxFollows) break;

          try {
            // フォローボタンを探す（「フォロー中」「Following」は除外）
            const followBtn = await cell.$('button');
            if (!followBtn) continue;

            const btnText = await followBtn.textContent();
            if (!btnText) continue;

            // 既にフォロー中のユーザーはスキップ
            if (btnText.includes('フォロー中') || btnText.includes('Following')) continue;
            // 「フォロー」または「Follow」ボタンのみクリック
            if (!btnText.includes('フォロー') && !btnText.includes('Follow')) continue;

            await followBtn.scrollIntoViewIfNeeded();
            await sleep(500);
            await followBtn.click();
            totalFollows++;
            log(`  👤 フォロー ${totalFollows}/${maxFollows}`);

            // フォロー間隔: 15-45秒
            await sleep(randomDelay(15000, 45000));
          } catch {
            // 個別のフォローが失敗しても続行
          }
        }

        // スクロール
        await this.page.evaluate(() => window.scrollBy(0, 600));
        await sleep(randomDelay(CONFIG.delays.scrollPauseMin, CONFIG.delays.scrollPauseMax));
      }

      log(`👤 フォロー完了: ${totalFollows}件 ("${keyword}")`);
    } catch (err) {
      logError(`フォロー処理でエラー ("${keyword}")`, err);
    }

    return totalFollows;
  }

  // ── ターゲットアカウントのフォロワーにいいね ──

  async likeFromFollowers(targetHandle: string, maxLikes: number): Promise<number> {
    if (!this.page) return 0;

    let totalLikes = 0;

    try {
      log(`❤️ フォロワーいいね開始: @${targetHandle} のフォロワー (最大${maxLikes}件)`);

      // ターゲットアカウントのフォロワーページに移動
      await this.page.goto(`https://x.com/${targetHandle}/followers`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(4000);

      // フォロワーリストからユーザーを取得
      const userCells = await this.page.$$('[data-testid="UserCell"]');
      const userHandles: string[] = [];

      for (const cell of userCells.slice(0, 20)) {
        try {
          const link = await cell.$('a[role="link"]');
          if (link) {
            const href = await link.getAttribute('href');
            if (href && href.startsWith('/')) {
              userHandles.push(href.replace('/', ''));
            }
          }
        } catch {}
      }

      // ランダムに選んだフォロワーのプロフィールを訪問 → 最新ツイートにいいね
      const shuffled = userHandles.sort(() => Math.random() - 0.5).slice(0, maxLikes * 2);

      for (const handle of shuffled) {
        if (totalLikes >= maxLikes) break;

        try {
          await this.page.goto(`https://x.com/${handle}`, {
            waitUntil: 'domcontentloaded',
            timeout: 15000,
          });
          await sleep(3000);

          // 最新のツイートのいいねボタンをクリック
          const likeBtn = await this.page.$('article [data-testid="like"]');
          if (likeBtn) {
            const isVisible = await likeBtn.isVisible();
            if (isVisible) {
              await likeBtn.click();
              totalLikes++;
              log(`  ❤️ @${handle} のツイートにいいね ${totalLikes}/${maxLikes}`);
            }
          }

          // いいね間隔: 20-50秒
          await sleep(randomDelay(20000, 50000));
        } catch {
          // 個別失敗は続行
        }
      }

      log(`❤️ フォロワーいいね完了: ${totalLikes}件 (@${targetHandle})`);
    } catch (err) {
      logError(`フォロワーいいね処理でエラー (@${targetHandle})`, err);
    }

    return totalLikes;
  }

  // ── ターゲットアカウントのフォロワーをフォロー ──

  async followFromFollowers(targetHandle: string, maxFollows: number): Promise<number> {
    if (!this.page) return 0;

    let totalFollows = 0;

    try {
      log(`👤 フォロワーフォロー開始: @${targetHandle} のフォロワー (最大${maxFollows}件)`);

      // ターゲットアカウントのフォロワーページに移動
      await this.page.goto(`https://x.com/${targetHandle}/followers`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(4000);

      // スクロールでフォロワーを読み込む
      for (let round = 0; round < 3 && totalFollows < maxFollows; round++) {
        const userCells = await this.page.$$('[data-testid="UserCell"]');

        for (const cell of userCells) {
          if (totalFollows >= maxFollows) break;

          try {
            // フォローボタンを探す
            const buttons = await cell.$$('button');
            for (const btn of buttons) {
              const btnText = await btn.textContent();
              if (!btnText) continue;

              // 既にフォロー中はスキップ
              if (btnText.includes('フォロー中') || btnText.includes('Following')) continue;
              // 「フォロー」ボタンのみ
              if (!btnText.match(/^フォロー$/) && !btnText.match(/^Follow$/)) continue;

              await btn.scrollIntoViewIfNeeded();
              await sleep(500);
              await btn.click();
              totalFollows++;
              log(`  👤 フォロー ${totalFollows}/${maxFollows} (@${targetHandle}のフォロワー)`);

              // フォロー間隔: 20-50秒
              await sleep(randomDelay(20000, 50000));
              break;
            }
          } catch {
            // 個別のフォローが失敗しても続行
          }
        }

        // スクロール
        await this.page.evaluate(() => window.scrollBy(0, 600));
        await sleep(randomDelay(CONFIG.delays.scrollPauseMin, CONFIG.delays.scrollPauseMax));
      }

      log(`👤 フォロワーフォロー完了: ${totalFollows}件 (@${targetHandle})`);
    } catch (err) {
      logError(`フォロワーフォロー処理でエラー (@${targetHandle})`, err);
    }

    return totalFollows;
  }

  // ── 引用RT ─────────────────────────────────

  async searchAndQuote(keyword: string, comment: string): Promise<{ success: boolean }> {
    if (!this.page) return { success: false };

    try {
      log(`🔄 引用RT開始: "${keyword}"`);

      // 日本語・最低10いいねのツイートを検索
      const query = encodeURIComponent(`${keyword} lang:ja min_faves:10`);
      await this.page.goto(`https://x.com/search?q=${query}&f=live`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(4000);

      // リツイートボタンを探す
      const rtButtons = await this.page.$$('[data-testid="retweet"]');

      if (rtButtons.length === 0) {
        log('⚠️ 引用RT候補が見つかりません');
        return { success: false };
      }

      // 上位3ツイートからランダムに1つ選択
      const targetIndex = Math.floor(Math.random() * Math.min(3, rtButtons.length));
      const targetBtn = rtButtons[targetIndex];

      await targetBtn.scrollIntoViewIfNeeded();
      await sleep(1000);
      await targetBtn.click();
      await sleep(2000);

      // 「引用」メニューをクリック
      const quoteMenuItem = await this.page.$('a[href*="compose/post"]');
      if (!quoteMenuItem) {
        // 代替: テキストで探す
        const menuItems = await this.page.$$('[role="menuitem"]');
        for (const item of menuItems) {
          const text = await item.textContent();
          if (text && (text.includes('引用') || text.includes('Quote'))) {
            await item.click();
            break;
          }
        }
      } else {
        await quoteMenuItem.click();
      }

      await sleep(3000);

      // コメント入力
      const textarea = await this.page.$('[data-testid="tweetTextarea_0"]');
      if (textarea) {
        await textarea.click();
        await sleep(500);
        await this.page.keyboard.type(comment, { delay: CONFIG.delays.typingDelay });
        await sleep(2000);

        // 投稿
        const posted = await this.clickPostButton();
        if (posted) {
          log(`✅ 引用RT完了: "${comment.substring(0, 30)}..."`);
          return { success: true };
        }
      }

      return { success: false };
    } catch (err) {
      logError('引用RT失敗', err);
      return { success: false };
    }
  }

  // ── タイムライン閲覧 ──────────────────────

  async browseTimeline(durationMs: number): Promise<void> {
    if (!this.page) return;

    log(`📖 タイムライン閲覧開始 (${Math.round(durationMs / 60000)}分間)`);

    try {
      await this.page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(3000);

      const startTime = Date.now();
      let likesGiven = 0;

      while (Date.now() - startTime < durationMs) {
        // ランダムスクロール
        const scrollAmount = randomDelay(200, 600);
        await this.page.evaluate((amount) => window.scrollBy(0, amount), scrollAmount);
        await sleep(randomDelay(CONFIG.delays.scrollPauseMin, CONFIG.delays.scrollPauseMax));

        // 30%の確率で日本語ツイートにいいね
        if (Math.random() < 0.3 && likesGiven < 5) {
          try {
            const tweetTexts = await this.page.$$('[data-testid="tweetText"]');
            for (const tweet of tweetTexts.slice(0, 3)) {
              const text = await tweet.textContent();
              if (text && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
                // この要素の親記事内のいいねボタンを探す
                const article = await tweet.evaluateHandle(el => el.closest('article'));
                if (article) {
                  const likeBtn = await (article as any).$('[data-testid="like"]');
                  if (likeBtn) {
                    await likeBtn.click();
                    likesGiven++;
                    log(`  📖 TL閲覧中いいね ${likesGiven}`);
                    break;
                  }
                }
              }
            }
          } catch {
            // 閲覧中のいいねは失敗しても問題なし
          }
        }
      }

      log(`📖 タイムライン閲覧完了 (いいね ${likesGiven}件)`);
    } catch (err) {
      logError('タイムライン閲覧でエラー', err);
    }
  }

  // ── 自分のツイートのエンゲージメント取得 ───

  async getMyTweetStats(): Promise<TweetStats[]> {
    if (!this.page) return [];

    const stats: TweetStats[] = [];

    try {
      log(`📊 エンゲージメント取得開始...`);

      // 自分のプロフィールページに移動
      const handle = this.brand.handle.replace('@', '');
      await this.page.goto(`https://x.com/${handle}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(4000);

      // ツイートを取得（最新20件程度）
      for (let scroll = 0; scroll < 3; scroll++) {
        const articles = await this.page.$$('article[data-testid="tweet"]');

        for (const article of articles) {
          try {
            // ツイートテキスト取得
            const textEl = await article.$('[data-testid="tweetText"]');
            const content = textEl ? (await textEl.textContent()) || '' : '';

            if (!content) continue;

            // タイムスタンプ取得
            const timeEl = await article.$('time');
            const datetime = timeEl ? await timeEl.getAttribute('datetime') : '';

            // メトリクス取得
            const likeEl = await article.$('[data-testid="like"] span, [data-testid="unlike"] span');
            const rtEl = await article.$('[data-testid="retweet"] span');
            const replyEl = await article.$('[data-testid="reply"] span');

            const likes = likeEl ? parseInt(await likeEl.textContent() || '0') || 0 : 0;
            const retweets = rtEl ? parseInt(await rtEl.textContent() || '0') || 0 : 0;
            const replies = replyEl ? parseInt(await replyEl.textContent() || '0') || 0 : 0;

            // 重複チェック
            const id = content.substring(0, 50);
            if (stats.some(s => s.id === id)) continue;

            stats.push({
              id,
              content: content.substring(0, 200),
              postedAt: datetime || '',
              metrics: { likes, retweets, replies, impressions: 0 },
            });
          } catch {
            // 個別ツイートの取得失敗は無視
          }
        }

        await this.page.evaluate(() => window.scrollBy(0, 800));
        await sleep(2000);
      }

      log(`📊 エンゲージメント取得完了: ${stats.length}件`);
    } catch (err) {
      logError('エンゲージメント取得失敗', err);
    }

    return stats;
  }

  // ── フォロワー数取得 ──────────────────────

  async getFollowerCount(): Promise<number> {
    if (!this.page) return 0;

    try {
      const handle = this.brand.handle.replace('@', '');
      await this.page.goto(`https://x.com/${handle}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await sleep(3000);

      // フォロワー数を取得
      const followerLink = await this.page.$(`a[href="/${handle}/verified_followers"], a[href="/${handle}/followers"]`);
      if (followerLink) {
        const text = await followerLink.textContent();
        if (text) {
          const num = text.replace(/[^0-9.KMkm万]/g, '');
          if (num.includes('万')) return parseFloat(num) * 10000;
          if (num.toLowerCase().includes('k')) return parseFloat(num) * 1000;
          if (num.toLowerCase().includes('m')) return parseFloat(num) * 1000000;
          return parseInt(num) || 0;
        }
      }
    } catch (err) {
      logError('フォロワー数取得失敗', err);
    }

    return 0;
  }

  // ── クローズ ──────────────────────────────

  async close(): Promise<void> {
    if (this.context) {
      log(`🔒 ブラウザ閉じ中...`);
      await this.context.close();
      this.context = null;
      this.page = null;
    }
  }
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface TweetStats {
  id: string;
  content: string;
  postedAt: string;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
  };
}
