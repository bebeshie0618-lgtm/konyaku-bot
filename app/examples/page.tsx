'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PocketIcon from '../components/PocketIcon';
import { TABS, EXAMPLES, type TabKey } from './_data';

export default function ExamplesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('sales');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [input, setInput] = useState('');

  const examples = EXAMPLES[activeTab];
  const activeLabel = TABS.find(t => t.key === activeTab)?.label ?? '';

  const copyInstruction = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sendToBot = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = () => sendToBot(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ヘッダー */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <PocketIcon size={32} />
          <div>
            <p className="text-xs font-black tracking-widest">作品例ギャラリー</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <p className="text-[10px] text-gray-400">AI Pocket Examples</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="text-[10px] tracking-widest text-gray-300 hover:text-black transition-colors uppercase border border-gray-200 hover:border-black px-3 py-1.5 rounded-full"
          >
            ← chat
          </Link>
          <Link
            href="/"
            className="text-[10px] tracking-widest text-gray-300 hover:text-black transition-colors uppercase border border-gray-200 hover:border-black px-3 py-1.5 rounded-full"
          >
            home
          </Link>
        </div>
      </header>

      {/* タブバー */}
      <div className="border-b border-gray-100 bg-white sticky top-[73px] z-[9]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map(tab => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 text-[11px] tracking-wider px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-black text-white border border-black font-bold'
                      : 'bg-white text-gray-500 border border-gray-100 hover:border-black hover:text-black font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* メインエリア */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 pb-32">
        {/* 見出し */}
        <div className="mb-6">
          <h2 className="text-sm font-black tracking-[0.15em] flex items-center gap-2 mb-1">
            <span className="inline-block w-1 h-4 bg-black rounded-sm" />
            {activeLabel}の作品例
          </h2>
          <p className="text-[10px] text-gray-400 ml-3 tracking-wide">
            指示文をクリックでコピーできます。気になった例は下のフォームから質問してみてください。
          </p>
        </div>

        {/* カード一覧 */}
        <div className="space-y-5">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              {/* 番号 */}
              <div className="px-4 py-2 bg-gray-50 text-[10px] font-black tracking-[0.15em] text-gray-400 uppercase">
                Example {String(i + 1).padStart(2, '0')}
              </div>

              {/* 指示文（クリックでコピー） */}
              <button
                onClick={() => copyInstruction(ex.instruction, i)}
                className="w-full text-left p-4 border-l-[3px] border-l-black border-b border-b-gray-100 bg-white hover:bg-gray-50 transition-colors block group"
                title="クリックでコピー"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black tracking-[0.1em] text-black">
                    指示文
                  </p>
                  <p className={`text-[10px] tracking-wider transition-colors ${
                    copiedIndex === i ? 'text-green-500 font-bold' : 'text-gray-300 group-hover:text-gray-500'
                  }`}>
                    {copiedIndex === i ? '✓ COPIED' : 'CLICK TO COPY'}
                  </p>
                </div>
                <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {ex.instruction}
                </p>
              </button>

              {/* 生成例 */}
              <div className="p-4 border-l-[3px] border-l-gray-200 bg-gray-50">
                <p className="text-[10px] font-black tracking-[0.1em] text-gray-500 mb-2">
                  生成例
                </p>
                {ex.isImage ? (
                  <div className="border border-dashed border-gray-300 rounded-xl py-8 px-4 bg-white text-center">
                    <p className="text-2xl mb-2">🖼️</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed whitespace-pre-wrap">
                      {ex.imagePlaceholder}
                    </p>
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {ex.result}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 下部固定入力欄 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-4 py-4 z-20 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <PocketIcon size={32} />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="この機能でどんなコンテンツを作りたいですか？"
            className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-10 h-10 bg-black disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-full flex items-center justify-center transition-colors text-sm shrink-0"
            title="ポケットくんに送る"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
