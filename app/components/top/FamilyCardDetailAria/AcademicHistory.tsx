import React, { useEffect, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import dayjs from "dayjs";

// type AcademicHistoryProps = {
//   birthday: string;
// };

type academicHistoryMap = {
  [key: number]: {
    contentStart: string;
    contentEnd: string;
    contentStartDate: string;
    contentEndDate: string;
  };
};

type historyDate = {
  primaryStart: string;
  primaryEnd: string;
  middleStart: string;
  middleEnd: string;
  highStart: string;
  highEnd: string;
  collegeStart: string;
  collegeEnd: string;
  gradStart: string;
  gradEnd: string;
};

const AcademicHistory: React.FC = () => {
  const { userDetail, setUserDetail } = useFamilyCard();
  const [primaryStart, setPrimaryStart] = useState<string>("");
  const [primaryEnd, setPrimaryEnd] = useState<string>("");
  const [middleStart, setMiddleStart] = useState<string>("");
  const [middleEnd, setMiddleEnd] = useState<string>("");
  const [highStart, setHighStart] = useState<string>("");
  const [highEnd, setHighEnd] = useState<string>("");
  const [collegeStart, setCollegeStart] = useState<string>("");
  const [collegeEnd, setCollegeEnd] = useState<string>("");
  const [historyDate, setHistoryDate] = useState<historyDate[]>();

  const academicHistoryMap: academicHistoryMap = {
    1: {
      contentStart: "小学校入学",
      contentEnd: "小学校卒業",
      contentStartDate: primaryStart,
      contentEndDate: primaryEnd,
    },
    2: {
      contentStart: "中学校入学",
      contentEnd: "中学校卒業",
      contentStartDate: middleStart,
      contentEndDate: middleEnd,
    },
    3: {
      contentStart: "高校入学",
      contentEnd: "高校卒業",
      contentStartDate: highStart,
      contentEndDate: highEnd,
    },
    4: {
      contentStart: "大学入学",
      contentEnd: "大学卒業",
      contentStartDate: collegeStart,
      contentEndDate: collegeEnd,
    },
  };

  useEffect(() => {
    if (userDetail && userDetail[0]?.birthday) {
      const calcSchoolDate = (birthday: string) => {
        const birthDate = dayjs(birthday);
        const primaryStartYear =
          birthDate.month() < 3 || (birthDate.month() === 3 && birthDate.date() < 2)
            ? birthDate.year() + 6
            : birthDate.year() + 7;
        console.log(primaryStartYear + 6);
        const primaryStart = `${primaryStartYear}-04`;
        const primaryEnd = `${primaryStartYear + 6}-03`;
        const middleStart = `${primaryStartYear + 6}-04`;
        const middleEnd = `${primaryStartYear + 9}-03`;
        const highStart = `${primaryStartYear + 9}-04`;
        const highEnd = `${primaryStartYear + 12}-03`;
        const collegeStart = `${primaryStartYear + 12}-04`;
        const collegeEnd = `${primaryStartYear + 16}-03`;

        return {
          primaryStart,
          primaryEnd,
          middleStart,
          middleEnd,
          highStart,
          highEnd,
          collegeStart,
          collegeEnd,
        };
      };
      const {
        primaryStart,
        primaryEnd,
        middleStart,
        middleEnd,
        highStart,
        highEnd,
        collegeStart,
        collegeEnd,
      } = calcSchoolDate(userDetail[0].birthday);
      setPrimaryStart(primaryStart);
      setPrimaryEnd(primaryEnd);
      setMiddleStart(middleStart);
      setMiddleEnd(middleEnd);
      setHighStart(highStart);
      setHighEnd(highEnd);
      setCollegeStart(collegeStart);
      setCollegeEnd(collegeEnd);
    }
  }, [userDetail]);

  // userDetail[0].birthdayに値が入ったら、学歴を自動的に計算し、firestoreのdetailサブコレクション・"academicHistory"に格納。

  return (
    <Timeline position="left" sx={{ width: "300px" }}>
      {Object.values(academicHistoryMap).map((item, index) => (
        <React.Fragment key={index}>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              {item.contentStartDate}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>{item.contentStart}</TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              {item.contentEndDate}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>{item.contentEnd}</TimelineContent>
          </TimelineItem>
        </React.Fragment>
      ))}
    </Timeline>
  );
};

export default AcademicHistory;
