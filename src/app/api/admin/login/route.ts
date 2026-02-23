import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'mello_admin';

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      // 簡易的な認証のためにクッキーをセット（本番ではもっと堅牢にするべきですが、今回はスピード優先の要望に合わせて実装）
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24時間
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
