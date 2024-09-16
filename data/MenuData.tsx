import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FaceIcon from "@mui/icons-material/Face";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

export const MenuData = [
  // 家族の情報
  {
    number: 1,
    title: "FamilyCard",
    link: "/features/familyCard",
    icon: <HomeIcon />,
    detail:
      "家族のプロフィールや連絡先をひとまとめにして、簡単に管理・共有できるアプリです。大切な家族の情報をすぐに確認でき、スムーズなコミュニケーションをお手伝いします。",
  },
  // スケジュール・やる事リスト
  {
    number: 2,
    title: "Todo",
    link: "/features/todo",
    icon: <ListAltIcon />,
    detail:
      "日々のタスクを簡単に整理・管理できるアプリです。やるべきことをリスト化して、優先順位をつけながら効率的に進められるので、忙しい毎日でもスムーズにタスクをこなせます。",
  },
  // ライフプラン表
  // { number: 3, title: "Life", link: "/features/life", icon: <FaceIcon /> },
  // 所持品の保存
  // {
  //   number: 4,
  //   title: "Property",
  //   link: "/features/property",
  //   icon: <LaptopChromebookIcon />,
  // },
  // メモ（URL・Titleをカテゴリごとに）
  {
    number: 5,
    title: "Memo",
    link: "/features/memo",
    icon: <AutoAwesomeMotionIcon />,
    detail:
      "URLとメモを一緒に保存できる便利なアプリです。学習や料理、趣味など、生活に役立つページをメモ付きで整理し、わかりやすく一覧にして管理できます。",
  },
  // アカウント情報
  {
    number: 6,
    title: "Account",
    link: "/features/account",
    icon: <ManageAccountsIcon />,
    detail:
      "ユーザーのプロフィールやログイン情報の確認・編集が簡単に行えます。パスワードの変更や通知設定の更新など、アカウントに関する設定をスムーズに管理できます。",
  },
  // このアプリの説明書
  // {
  //   number: 7,
  //   title: "Instructions",
  //   link: "/features/instructions",
  //   icon: <AutoStoriesIcon />,
  // },
];
