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
