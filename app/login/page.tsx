'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// ① コンポーネント外でクライアントを初期化（レンダリングごとの再生成を防止）
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ③ マウント時にSupabase接続確認
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        console.log('[Login] Supabase URL:', url);
        console.log('[Login] Anon key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Login] Session check error:', error.message);
        } else {
          console.log('[Login] Session check OK. Active session:', !!data.session);
          // 既にログイン済みならリダイレクト
          if (data.session) {
            router.push('/chat');
          }
        }
      } catch (e) {
        console.error('[Login] Connection test failed:', e);
      }
    };
    checkConnection();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo('');

    try {
      // ② 詳細なエラーログ出力
      console.log('[Login] Attempting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('[Login] Auth error:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });

        // エラー種別に応じたメッセージ
        let userMessage = 'ログインに失敗しました';
        let debug = `[${error.status}] ${error.message}`;

        if (error.message === 'Invalid login credentials') {
          userMessage = 'メールアドレスまたはパスワードが正しくありません';
        } else if (error.message === 'Email not confirmed') {
          userMessage = 'メールアドレスの確認が完了していません。確認メールをご確認ください。';
        } else if (error.status === 0 || error.message.includes('fetch')) {
          userMessage = 'サーバーに接続できません。ネットワークを確認してください。';
        } else if (error.status === 429) {
          userMessage = 'ログイン試行回数が上限に達しました。しばらくしてから再度お試しください。';
        } else {
          userMessage = `ログインエラー: ${error.message}`;
        }

        setError(userMessage);
        setDebugInfo(debug);
        setLoading(false);
        return;
      }

      console.log('[Login] Sign in successful, user:', data.user?.id);
      router.push('/chat');
    } catch (err) {
      console.error('[Login] Unexpected error:', err);
      setError('予期しないエラーが発生しました');
      setDebugInfo(String(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-white text-xl font-black">P</span>
          </div>
          <h1 className="text-xs font-black tracking-[0.4em] uppercase">Konyaku Bot</h1>
          <p className="text-[10px] text-gray-400 mt-2 tracking-wider">
            AIポケットのアカウントでログイン
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-b border-gray-200 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-gray-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-gray-200 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-gray-300"
              required
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
          {debugInfo && (
            <p className="text-gray-300 text-[10px] text-center font-mono">{debugInfo}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full text-xs font-black tracking-[0.3em] uppercase mt-8 hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            {loading ? '...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
