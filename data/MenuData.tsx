import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const MenuData = [
  // 家族の情報
  {
    number: 1,
    title: "FamilyCard",
    link: "/features/familyCard",
    icon: <HomeIcon />,
    detail:
      "家族のプロフィールをひとまとめにして、簡単に管理できるアプリです。大切な家族の情報をすぐに確認でき、スムーズなコミュニケーションをお手伝いします。",
  },
  // スケジュール・やる事リスト
  {
    number: 2,
    title: "Todo",
    link: "/features/todo",
    icon: <ListAltIcon />,
    detail:
      "日々のタスクを簡単に整理・管理できるアプリです。リスト化することでやるべきことを効率的に進められるので、忙しい毎日でもスムーズにタスクをこなせます。",
  },
  // メモ（URL・Titleをカテゴリごとに）
  {
    number: 5,
    title: "Memo",
    link: "/features/memo",
    icon: <AutoAwesomeMotionIcon />,
    detail:
      "URLとメモを一緒に保存できるアプリです。学習や料理、趣味など、生活に役立つページをメモ付きで整理し、わかりやすく一覧にして管理できます。",
  },
  // アカウント情報
  {
    number: 6,
    title: "Account",
    link: "/features/account",
    icon: <ManageAccountsIcon />,
    detail:
      "ユーザーのログイン情報の確認・編集が簡単に行えます。メールアドレスやパスワードの変更、アカウントの削除がスムーズに行えます。",
  },
];
