import { NextResponse } from "next/server";

// NOTE:URLからそのページのプレビュー情報（画像・タイトル・概要等）を取ってくるAPI。
export async function GET(req: Request) {
  // NOTE:URLの様々な要素のうち、クエリパラメータを管理するURLserchParamsオブジェクトを取り出す。
  const { searchParams } = new URL(req.url);
  // NOTE:クエリパラメータのurlを取得
  const url = searchParams.get("url");

  // NOTE:URLがない場合は、HTTPステータスコード400（Bad Request）を設定し、エラーメッセージと一緒にJSONオブジェクトを返す
  if (!url) {
    return NextResponse.json(
      { error: "URLが入力されていません。" },
      { status: 400 }
    );
  }

  try {
    // NOTE:fetch 外部APIにHTTPリクエストを送信（linkPreviewAPIのエンドポイントにクエリパラメータとしてエンコードしたURLを渡して送信する）
    const response = await fetch(
      `https://api.linkpreview.net/?key=${
        process.env.LINK_PREVIEW_API_KEY
      }&q=${encodeURIComponent(url)}`
    );
    // NOTE:fetchから返ってくるレスポンスのPromiseを、response.json()でjson形式にパースする。
    const previewData = await response.json();

    // NOTE:previewDataをクライアントに返す処理
    return NextResponse.json(previewData);
  } catch (err) {
    return NextResponse.json(
      { error: "プレビューの取得に失敗しました。" },
      { status: 500 }
    );
  }
}
