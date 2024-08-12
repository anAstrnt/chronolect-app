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
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";

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
};

const AcademicHistory: React.FC = () => {
  const { userDetail, userId } = useFamilyCard();
  const [primaryStart, setPrimaryStart] = useState<string>("");
  const [primaryEnd, setPrimaryEnd] = useState<string>("");
  const [middleStart, setMiddleStart] = useState<string>("");
  const [middleEnd, setMiddleEnd] = useState<string>("");
  const [highStart, setHighStart] = useState<string>("");
  const [highEnd, setHighEnd] = useState<string>("");
  const [collegeStart, setCollegeStart] = useState<string>("");
  const [collegeEnd, setCollegeEnd] = useState<string>("");
  const [historyDate, setHistoryDate] = useState<historyDate[]>([
    {
      primaryStart: "",
      primaryEnd: "",
      middleStart: "",
      middleEnd: "",
      highStart: "",
      highEnd: "",
      collegeStart: "",
      collegeEnd: "",
    },
  ]);

  const academicHistoryMap: academicHistoryMap = {
    1: {
      contentStart: "小学校入学",
      contentEnd: "小学校卒業",
      contentStartDate: historyDate[0]?.primaryStart || "OOOO-04",
      contentEndDate: historyDate[0]?.primaryEnd || "OOOO-03",
    },
    2: {
      contentStart: "中学校入学",
      contentEnd: "中学校卒業",
      contentStartDate: historyDate[0]?.middleStart || "OOOO-04",
      contentEndDate: historyDate[0]?.middleEnd || "OOOO-03",
    },
    3: {
      contentStart: "高校入学",
      contentEnd: "高校卒業",
      contentStartDate: historyDate[0]?.highStart || "OOOO-04",
      contentEndDate: historyDate[0]?.highEnd || "OOOO-03",
    },
    4: {
      contentStart: "大学入学",
      contentEnd: "大学卒業",
      contentStartDate: historyDate[0]?.collegeStart || "OOOO-04",
      contentEndDate: historyDate[0]?.collegeEnd || "OOOO-03",
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
  }, [userDetail, userDetail[0].birthday]);

  const onChangeAcademicHistory = async () => {
    if (userId && userDetail[0].birthday) {
      const academicHistoryRef = doc(
        db,
        "familyCard",
        userId,
        "detail",
        "academicHistory"
      );
      await setDoc(academicHistoryRef, {
        primaryStart: primaryStart,
        primaryEnd: primaryEnd,
        middleStart: middleStart,
        middleEnd: middleEnd,
        highStart: highStart,
        highEnd: highEnd,
        collegeStart: collegeStart,
        collegeEnd: collegeEnd,
      });
    }
  };
  useEffect(() => {
    onChangeAcademicHistory();
  }, [
    userDetail[0].birthday,
    primaryStart,
    primaryEnd,
    middleStart,
    middleEnd,
    highStart,
    highEnd,
    collegeStart,
    collegeEnd,
  ]);

  const fetchAcademicHistoryDocs = async () => {
    const academicHistoryRef = collection(db, "familyCard", userId, "detail");
    try {
      const academicHistorySnapshot = await getDocs(academicHistoryRef);
      const academicHistorys = academicHistorySnapshot.docs
        .filter((doc) => doc.id === "academicHistory")
        .map((doc) => ({
          primaryStart: doc.data().primaryStart,
          primaryEnd: doc.data().primaryEnd,
          middleStart: doc.data().middleStart,
          middleEnd: doc.data().middleEnd,
          highStart: doc.data().highStart,
          highEnd: doc.data().highEnd,
          collegeStart: doc.data().collegeStart,
          collegeEnd: doc.data().collegeEnd,
        }));
      setHistoryDate(academicHistorys);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (historyDate) {
      fetchAcademicHistoryDocs();
    }
  }, [userId]);

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
