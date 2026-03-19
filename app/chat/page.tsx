'use client';
import { useState, useRef, useEffect } from 'react';

type Mode = null | 'ai-pocket' | 'fukugyou';
interface Message { role: 'assistant' | 'user'; content: string; }

export default function ChatPage() {
  const [mode, setMode] = useState<Mode>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const selectMode = (m: Mode) => {
    setMode(m);
    const msg = m === 'ai-pocket'
      ? 'AIポケットの使い方についてサポートします。\nどの機能について知りたいですか？'
      : '副業コンテンツの作成をサポートします。\n目標や現状を教えていただけますか？';
    setMessages([{ role: 'assistant', content: msg }]);
    setSuggestions(
      m === 'ai-pocket'
        ? ['LP生成の使い方を教えて', 'note記事を上手く作るコツは？', 'ステップメールとは何ですか？']
        : ['副業で月5万円稼ぐ方法は？', 'noteで売れる記事の書き方', 'X（Twitter）で集客する方法']
    );
  };

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setSuggestions([]);
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, mode }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      if (data.suggestions?.length) setSuggestions(data.suggestions);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant', content: 'エラーが発生しました。もう一度お試しください。'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-black">P</span>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest">POCKET</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <p className="text-[10px] text-gray-400">online</p>
            </div>
          </div>
        </div>
        {mode && (
          <button
            onClick={() => { setMode(null); setMessages([]); setSuggestions([]); }}
            className="text-[10px] tracking-widest text-gray-300 hover:text-black transition-colors uppercase"
          >
            ← back
          </button>
        )}
      </header>

      {/* モード未選択 */}
      {!mode && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-8">
            <span className="text-white text-2xl font-black">P</span>
          </div>
          <h2 className="text-sm font-black tracking-[0.2em] mb-2">こんにちは。</h2>
          <p className="text-xs text-gray-400 mb-10 tracking-wide text-center leading-relaxed">
            今日はどんなことをサポートしますか？
          </p>
          <div className="w-full max-w-xs space-y-3">
            {[
              { key: 'ai-pocket' as Mode, label: 'AIポケットの使い方', sub: '機能説明・操作方法・活用コツ' },
              { key: 'fukugyou' as Mode, label: '副業コンテンツの作成', sub: '収益化・LP・note・SNS戦略' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => selectMode(item.key)}
                className="w-full border border-gray-100 rounded-2xl py-5 px-5 text-left hover:border-black transition-all group"
              >
                <p className="text-xs font-black tracking-wider mb-1 group-hover:text-black">
                  {item.label}
                </p>
                <p className="text-[10px] text-gray-400">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* チャット */}
      {mode && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 max-w-xl w-full mx-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-black">P</span>
                  </div>
                )}
                <div className="relative group max-w-[80%]">
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-tr-sm'
                      : 'bg-gray-50 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyText(msg.content, i)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow-sm"
                    >
                      {copied === i ? '✓' : '⎘'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-black">P</span>
                </div>
                <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0,120,240].map(d => (
                      <div key={d} className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {suggestions.length > 0 && !loading && (
              <div className="ml-10 space-y-2 pt-2">
                <p className="text-[10px] text-gray-300 tracking-wider uppercase">こんなことも聞けます</p>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="block w-full text-left text-xs border border-gray-100 rounded-xl px-4 py-3 hover:border-black transition-all text-gray-600 hover:text-black">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 px-4 py-4 max-w-xl w-full mx-auto">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="メッセージを入力..."
                className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-black disabled:bg-gray-100 text-white rounded-full flex items-center justify-center transition-colors text-sm shrink-0"
              >
                ↑
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
