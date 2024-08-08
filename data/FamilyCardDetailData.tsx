import AcademicHistory from "@/app/components/top/AcademicHistory";
import WorkHistory from "@/app/components/top/WorkHistory";
import { Input } from "@mui/material";

export const FamilyCardDetailData = [
  { number: 1, detailTitle: "名前", name: "name", type: "text" },
  { number: 2, detailTitle: "誕生日", name: "birthday", type: "data" },
  { number: 3, detailTitle: "郵便番号", name: "postCode", type: "text" },
  { number: 4, detailTitle: "住所", name: "address", type: "text" },
  { number: 5, detailTitle: "資格", name: "qualification", type: "text" },
  { number: 6, detailTitle: "メール", name: "email", type: "email" },
  { number: 7, detailTitle: "学歴", name: "AcademicHistory", type: "text" },
  { number: 8, detailTitle: "職歴", name: "WorkHistory", type: "text" },
];
