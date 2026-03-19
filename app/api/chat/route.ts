import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM = `
あなたは「ポケットくん」です。
四次元AIポケットと副業コンテンツ作成の専門サポーターです。

【AIポケットの機能】
- ステップメール生成
- note記事生成（1万文字以上）
- セールスレター生成
- X投稿・Threads投稿生成
- LP生成（12種カラーテーマ・業種別画像・LINE URL設定可）

【副業の専門知識】
- note・ブログ・SNS・メルマガ収益化
- セールスライティング・LP制作
- コーチング・情報販売・アフィリエイト

【回答ルール】
1. 質問に端的かつ深く答える
2. 不明点があれば最大3つ深掘り質問をする
3. 具体的な数字・手順・事例を含める
4. 回答の末尾に必ず以下の形式でサジェストを付ける：

[SUGGESTIONS]
{"suggestions":["関連質問1","関連質問2","関連質問3"]}
[/SUGGESTIONS]

【文体】
- 丁寧だが親しみやすい
- 絵文字は1〜2個まで
- 回答は読んだ人がすぐ行動できる実用的な内容
`;

export async function POST(req: NextRequest) {
  const { messages, mode } = await req.json();
  const modeCtx = mode === 'ai-pocket'
    ? 'モード：AIポケット使い方サポート'
    : 'モード：副業コンテンツ作成サポート';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYSTEM + '\n現在の' + modeCtx,
    messages,
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text : '';
  const match = raw.match(/\[SUGGESTIONS\]([\s\S]*?)\[\/SUGGESTIONS\]/);
  let suggestions: string[] = [];
  let content = raw;

  if (match) {
    try {
      suggestions = JSON.parse(match[1].trim()).suggestions || [];
      content = raw.replace(/\[SUGGESTIONS\][\s\S]*?\[\/SUGGESTIONS\]/, '').trim();
    } catch {}
  }

  return NextResponse.json({ content, suggestions });
}
