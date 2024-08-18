import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FaceIcon from "@mui/icons-material/Face";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

export const MenuData = [
  // 家族の情報
  { number: 1, title: "Home", link: "/features/top", icon: <HomeIcon /> },
  // スケジュール・やる事リスト
  { number: 2, title: "Todo", link: "/features/todo", icon: <ListAltIcon /> },
  // ライフプラン表
  { number: 3, title: "Life", link: "/features/life", icon: <FaceIcon /> },
  // 所持品の保存
  {
    number: 4,
    title: "Property",
    link: "/features/property",
    icon: <LaptopChromebookIcon />,
  },
  // メモ（URL・Titleをカテゴリごとに）
  {
    number: 5,
    title: "Memo",
    link: "/features/memo",
    icon: <AutoAwesomeMotionIcon />,
  },
  // アカウント情報
  {
    number: 6,
    title: "Account",
    link: "/features/account",
    icon: <ManageAccountsIcon />,
  },
  // このアプリの説明書
  {
    number: 7,
    title: "Instructions",
    link: "/features/instructions",
    icon: <AutoStoriesIcon />,
  },
];
