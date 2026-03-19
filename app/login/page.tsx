'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません');
      setLoading(false);
    } else {
      router.push('/chat');
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
