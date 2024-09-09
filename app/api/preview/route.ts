// import { NextRequest, NextResponse } from "next/server";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // URLの様々な要素のうち、クエリパラメータを管理するURLserchParamsオブジェクトを取り出す。
  const { searchParams } = new URL(req.url);
  // クエリパラメータのurlを取得
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URLが入力されていません。" },
      { status: 400 }
    );
  }

  try {
    // fetch:外部APIにHTTPリクエストを送信（linkPreviewAPIのエンドポイントにクエリパラメータとしてエンコードしたURLを渡して送信する）
    const response = await fetch(
      `https://api.linkpreview.net/?key=${
        process.env.LINK_PREVIEW_API_KEY
      }&q=${encodeURIComponent(url)}`
    );
    // fetchから返ってくるレスポンスのPromiseを、response.json()でjson形式にパースする。
    const previewData = await response.json();

    // rpreviewDataをクライアントに返す処理
    return NextResponse.json(previewData);
  } catch (err) {
    return NextResponse.json(
      { error: "プレビューの取得に失敗しました。" },
      { status: 500 }
    );
  }
}

// パターン１

// import { NextResponse } from 'next/server';

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const url = searchParams.get('url');

//   if (!url) {
//     return NextResponse.json({ error: 'URL is required' }, { status: 400 });
//   }

//   try {
//     // LinkPreview API へのリクエスト（例えば、LinkPreview.ioなど）
//     const response = await fetch(`https://api.linkpreview.net/?key=YOUR_API_KEY&q=${encodeURIComponent(url)}`);
//     const previewData = await response.json();

//     return NextResponse.json(previewData);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
//   }
// }

// パターン２

// interface PreviewData {
//   title: string;
//   description: string;
//   image: string;
//   url: string;
// }

// interface ErrorResponse {
//   error: string;
// }

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const url = searchParams.get("url");

//   if (!url) {
//     return NextResponse.json({ error: "URL is required" }, { status: 400 });
//   }

//   try {
//     const response = await fetch(
//       `https://api.linkpreview.net/?key=${
//         process.env.LINK_PREVIEW_API_KEY
//       }&q=${encodeURIComponent(url)}`
//     );
//     const data = await response.json();

//     if (data.error) {
//       return NextResponse.json({ error: data.error }, { status: 400 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
