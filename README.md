# 📒 chronolect

家族のこと・やること・保存したい Web ページをまるごと記録しておけるアプリです。

<img src="https://github.com/user-attachments/assets/04411ed8-01b7-4a6b-8294-e9a3cfdd3316">

### Family Card

家族や大切な人の情報（名前・誕生日・郵便番号・住所・メールアドレス・資格・学歴・職歴）を保存するページです。

### Todo

日々の Todo をタイトルごとに保存することがでるページです。

### Memo

気になるページの URL をメモ付きで保存できるページです。  
例えば、勉強でまた見返したいページを保存するときや、美味しそうなレシピを見つけたときに URL にメモを付けて保存してみてください。

## 🌼 このサービスを作った想い

例えば、「サービスの申し込みをするときに、家族の誕生日や住所が思い出せない。」「ついでにやらなければならないこともまとめておきたい。」  
そんな悩みを持つ方に向けて作成したアプリです。
役場の窓口でお子様の生年月日をなかなか思い出せない方が案外いらっしゃることに気づき、このアプリを作成しました。

## 💁🏼‍♀️ App URL（PC 用アプリとなります。）

https://chronolect-app-jwf5-e9vy8edws-anastrnts-projects.vercel.app/

## 🔧 機能一覧

### ユーザー認証

- メールアドレスとパスワードによるログイン
- ユーザー登録機能
- ログアウト機能

［ログイン画面］  
ユーザー登録がお済みでしたら、メールアドレスとパスワードでパスワードでサインインしてください。  
パスワードをお忘れの場合は、「Forgot password?」よりパスワードの再設定を行なってください。
<img src="https://github.com/user-attachments/assets/6c0ea15f-5727-431f-8c30-34ffdbfcc47d">
［ユーザー登録画面］  
ユーザー登録は、ログイン画面の「Don't have an account?」より入ったページですることができます。
<img src="https://github.com/user-attachments/assets/0d90e38d-bd53-4534-86f6-805a9dfeee1f">
［メニュー画面］
利用するカードをクリックしてサービスページに移動します。  
アカウントのサインアウトもこのページからすることができます。
<img src="https://github.com/user-attachments/assets/3502cae4-6516-427a-8d0e-856f052c2bb9">

### Family Card

⭐️ 家族カード管理

- 家族のプロフィール作成・編集
- 家族情報の表示
- 家族カードの削除

⭐️ 職歴管理

- 職歴の追加・編集・削除
- 職歴データの表示
- 職歴のソート機能（雇用日順）

⭐️ 学歴管理

- 学歴の追加・編集・削除
- 学歴データの表示
- 誕生日に基づく自動学歴計算

⭐️ 資格情報管理

- 資格情報の追加・編集・削除
- 資格データの表示

［Family Card 作成画面］  
Family Card の初期画面で、カードを一つ登録してもらいます。  
初期登録である名前とアバター画像を登録してください。  
なお、登録したいアバター画像を持ち合わせていない場合は、12 個のアバターサンプルから選んで登録することができます。
<img src="https://github.com/user-attachments/assets/65dc8a1e-f2ab-4efa-9676-ec01d124c59e">
［Family Card 編集画面］  
Family Card の登録事項を表示または編集する画面です。  
サイドバーから選択されたアバターの Family Card 内容を表示します。
編集の際には、鉛筆アイコンを押して対象の項目を編集してください。  
編集：鉛筆アイコン　　登録：＋アイコン　　削除：✗ アイコン
<img src="https://github.com/user-attachments/assets/3c6b13b6-66d0-4892-b2c3-1aaca3a0234e">

### Todo

⭐️ Todo リスト管理

- Todo タイトルの追加・表示
- Todo アイテムの追加・編集・削除

［Todo リスト表示画面］  
まずはタイトルを登録すると、画面中央よりタイトルに対応したカードが表示されるため、そこから Todo の登録を行っていってください。  
Todo が完了したらチェックボタンを押すことで、Todo に取り消し線を引くことができます。  
Todo やタイトルカードを削除したい際には、文字横にある ✗ アイコンを押すと削除できます。  
また、Todo はカード右下より表示非表示の切り替えができます。
<img src="https://github.com/user-attachments/assets/63595c31-2902-4027-9076-00163fc044a7">

### Memo

⭐️ メモ管理

- URL とメモの追加・表示
- メモのカテゴリー分け
- メモのプレビュー表示

⭐️ カテゴリー管理

- メモのカテゴリーの追加・削除
- カテゴリーに基づくメモのフィルタリング

［Memo 表示画面］  
今後見返したい URL をメモ付きで登録してください。  
カテゴリー名を登録することで、カードをそれぞれカテゴリー分けすることができます。
<img src="https://github.com/user-attachments/assets/809caaa5-0a91-4cff-83b0-7bbe34bc1622">

### Tips

⭐️ ヘルプ・チップ機能

- 各機能に関する使い方やヒントの表示

［操作に関するヒント表示画面］  
それぞれのサービスページで操作に関するヒントをつけています。  
画面右上の Tips をクリックすることで表示することができます。
<img src="https://github.com/user-attachments/assets/901eb32f-687a-46ff-a4db-787585f6f1c7">

## 🔧 使用技術

#### プログラミング言語

- JavaScript
- TypeScript

#### フレームワーク・ライブラリ

- React
- Next.js

#### 状態管理

- Recoil

#### スタイリング

- Material-UI

#### データベース

- Firebase Firestore
- Firebase Storage

#### 認証

- Firebase Authentication

#### API

- LinkPreview API

#### バージョン管理

- GitHub

## ✏️ 今後のアップデート予定

- レスポンシブデザインに対応
- UI/UX の改善
