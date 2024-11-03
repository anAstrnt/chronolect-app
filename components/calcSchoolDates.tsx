import dayjs from "dayjs";

// 誕生日から学歴を自動計算する計算式
export const calcSchoolDates = (birthday: string) => {
  const birthDate = dayjs(birthday);
  const primaryStartYear =
    birthDate.month() < 3 || (birthDate.month() === 3 && birthDate.date() < 2)
      ? birthDate.year() + 6
      : birthDate.year() + 7;

  return [
    {
      school: "小学校",
      contentStartDate: `${primaryStartYear}-04`,
      contentEndDate: `${primaryStartYear + 6}-03`,
    },
    {
      school: "中学校",
      contentStartDate: `${primaryStartYear + 6}-04`,
      contentEndDate: `${primaryStartYear + 9}-03`,
    },
    {
      school: "高校",
      contentStartDate: `${primaryStartYear + 9}-04`,
      contentEndDate: `${primaryStartYear + 12}-03`,
    },
    {
      school: "大学",
      contentStartDate: `${primaryStartYear + 12}-04`,
      contentEndDate: `${primaryStartYear + 16}-03`,
    },
  ];
};
