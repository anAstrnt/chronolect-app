import AcademicHistory from "@/app/components/top/AcademicHistory";
import WorkHistory from "@/app/components/top/WorkHistory";
import { Input } from "@mui/material";

export const FamilyCardDetailData = [
  { number: 1, detailTitle: "名前", component: <Input /> },
  { number: 2, detailTitle: "誕生日", component: <Input /> },
  { number: 3, detailTitle: "郵便番号", component: <Input /> },
  { number: 4, detailTitle: "住所", component: <Input /> },
  { number: 5, detailTitle: "学歴", component: <WorkHistory /> },
  { number: 6, detailTitle: "職歴", component: <AcademicHistory /> },
  { number: 7, detailTitle: "資格", component: <Input /> },
  { number: 7, detailTitle: "メモ", component: <Input /> },
];
