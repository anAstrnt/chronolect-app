"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { userDetailState } from "@/app/states/userDetailState";
import { Grid, Typography } from "@mui/material";

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

type AcademicHistoryProps = {
  birthday: string | undefined;
};

const AcademicHistory: React.FC<AcademicHistoryProps> = ({ birthday }) => {
  const userDetail = useRecoilValue(userDetailState);
  const userId = useRecoilValue(userIdState);
  const [historyDate, setHistoryDate] = useState<historyDate | null>(null);

  const academicHistoryMap: academicHistoryMap = {
    1: {
      contentStart: "小学校入学",
      contentEnd: "小学校卒業",
      contentStartDate: historyDate?.primaryStart || "OOOO-04",
      contentEndDate: historyDate?.primaryEnd || "OOOO-03",
    },
    2: {
      contentStart: "中学校入学",
      contentEnd: "中学校卒業",
      contentStartDate: historyDate?.middleStart || "OOOO-04",
      contentEndDate: historyDate?.middleEnd || "OOOO-03",
    },
    3: {
      contentStart: "高校入学",
      contentEnd: "高校卒業",
      contentStartDate: historyDate?.highStart || "OOOO-04",
      contentEndDate: historyDate?.highEnd || "OOOO-03",
    },
    4: {
      contentStart: "大学入学",
      contentEnd: "大学卒業",
      contentStartDate: historyDate?.collegeStart || "OOOO-04",
      contentEndDate: historyDate?.collegeEnd || "OOOO-03",
    },
  };

  useEffect(() => {
    const calcSchoolDate = (birthday: string) => {
      const birthDate = dayjs(birthday);
      const primaryStartYear =
        birthDate.month() < 3 ||
        (birthDate.month() === 3 && birthDate.date() < 2)
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

    if (birthday) {
      const schoolDates = calcSchoolDate(birthday);
      setHistoryDate(schoolDates);
    }
  }, [birthday]);

  const onChangeAcademicHistory = async () => {
    if (userId && userDetail.birthday) {
      const academicHistoryRef = doc(
        db,
        "familyCard",
        userId,
        "detail",
        "academicHistory"
      );
      await setDoc(academicHistoryRef, historyDate);
    }
  };

  useEffect(() => {
    if (historyDate) {
      onChangeAcademicHistory();
    }
  }, [historyDate]);

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
      if (academicHistorys.length > 0) {
        setHistoryDate(academicHistorys[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAcademicHistoryDocs();
    }
  }, [userId]);

  return (
    <Grid container sx={{ margin: "20px 0 20px 0" }}>
      {Object.values(academicHistoryMap).map((item, index) => (
        <Grid container key={index} justifyContent="space-around">
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "200px",
              margin: "10px 0 10px 0",
            }}
          >
            <Grid item sx={{ marginRight: "10px" }}>
              <Typography>{item.contentStart}</Typography>
            </Grid>
            <Grid item>{item.contentStartDate}</Grid>
          </Grid>

          <Grid item sx={{ display: "flex", margin: "10px 0 10px 0" }}>
            <Typography>ー</Typography>
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "200px",
              margin: "10px 0 10px 0",
            }}
          >
            <Grid item sx={{ marginRight: "10px" }}>
              <Typography>{item.contentEnd}</Typography>
            </Grid>
            <Grid item>{item.contentEndDate}</Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default AcademicHistory;
