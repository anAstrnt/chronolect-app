"use client";

import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { Grid, Typography } from "@mui/material";
import { changeEditDetailState } from "@/app/states/changeEditDetailState";
import { birthdayState } from "@/app/states/birthdayState";
import { calcSchoolDates } from "@/components/calcSchoolDates";
import { academicHistoryItemsState } from "@/app/states/academicHistoryItemsState";
import { academicHistoryItemsTypes } from "@/types/academicHistoryItemTypes";
import InputFormComp from "@/components/InputFormComp";
import { familyCardIdState } from "@/app/states/familyCardIdState";

type AcademicHistoryProps = {
  selectedIndex: number | undefined;
  detailIndex: number;
};

type PreviousBirthdayType = {
  birthday: string;
};

// NOTE: familyCardの学歴欄の表示や処理をするコンポーネント。誕生日が登録されたら、自動で入卒年月を計算する処理が走る。値は編集可能。
const AcademicHistory: React.FC<AcademicHistoryProps> = ({
  selectedIndex,
  detailIndex,
}) => {
  const userId = useRecoilValue(userIdState); // ユーザーが選択されているか判断するステート
  const familyCardId = useRecoilValue(familyCardIdState);
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  ); // 編集モードに切り替えするためのステート
  const birthday = useRecoilValue(birthdayState); // 誕生日が登録されたら、自動で入卒年月を計算するため、それに使われるステート
  const [academicHistoryItems, setAcademicHistoryItems] = useRecoilState(
    academicHistoryItemsState
  ); // 学歴が更新された際に値を格納するステート
  const [fetchHistoryItems, setFetchHistoryItems] = useState<
    academicHistoryItemsTypes[]
  >([]); // Firestoreから取得した学歴のデータを保持。ローカルのステート（academicHistoryItems）との比較に使う。
  const [previousBirthday, setPreviousBirthday] =
    useState<PreviousBirthdayType>(); // Firestoreの学歴collectionから取得した誕生日のデータを保持。誕生日が更新された際に、学歴を自動計算させる時に使う。

  // NOTE: ユーザーが選択された時に、初期データをFirestoreから取得
  useEffect(() => {
    if (userId && familyCardId) {
      fetchAcademicHistoryFromFirebase();
    }
  }, [userId, familyCardId]);

  // NOTE: Firestoreから学歴と誕生日を取ってくる処理。誕生日は、FamilyCardの誕生日とは分けて、学歴のcollection内にもう一つ作成している。
  const fetchAcademicHistoryFromFirebase = async () => {
    try {
      const academicHistoryRef = collection(
        db,
        "familyCards",
        userId,
        "familyCard",
        familyCardId,
        "academicHistory"
      );
      const birthdayRef = doc(academicHistoryRef, "birthday");
      const academicHistoryDoc = await getDocs(academicHistoryRef);
      const birthdayDoc = await getDoc(birthdayRef);

      // Firestoreから学歴情報を取ってこれているかで処理が分岐
      if (academicHistoryDoc) {
        // 取ってこれていた場合、doc名がbirthday担っているものを除き、データをhistoryDataに格納。
        // 並べ替えをし、academicHistoryItemsとfetchHistoryItemsに格納。
        const historyData = academicHistoryDoc.docs
          .filter((doc) => doc.id !== "birthday")
          .map((doc) => ({
            id: doc.id,
            school: doc.data().school,
            contentStartDate: doc.data().contentStartDate,
            contentEndDate: doc.data().contentEndDate,
          }));
        // docIdがbirthdayのデータが取れてきた場合は、その値をpreviousBirthdayステートに格納
        if (birthdayDoc.exists()) {
          const birthdayData = {
            birthday: birthdayDoc.data().birthday,
          };
          setPreviousBirthday(birthdayData);
        }

        // 取ってきたデータの並べ替え処理。入学年月が若い方から並べ替え。
        historyData.sort((a, b) => {
          const dateA = new Date(a.contentStartDate).getTime();
          const dateB = new Date(b.contentStartDate).getTime();
          return dateA - dateB;
        });

        // ステートの更新。
        setAcademicHistoryItems(historyData);
        setFetchHistoryItems(historyData);
      } else {
        setPreviousBirthday({ birthday: "" });
      }
    } catch (error) {
      console.error("Error fetching academic history: ", error);
    }
  };

  // NOTE: 誕生日が更新されたときに学歴を自動計算し、saveAcademicHistoryToFirebase関数でFirestoreに保存
  useEffect(() => {
    if (birthday && birthday !== previousBirthday?.birthday) {
      const schoolDates = calcSchoolDates(birthday); // 自動計算させるコンポーネント（calcSchoolDates）に誕生日を渡す
      setAcademicHistoryItems(schoolDates);
      saveAcademicHistoryToFirebase(schoolDates); // 自動計算したデータをFirestoreにデータを送る関数へ渡す
    } else if (!birthday) {
      setAcademicHistoryItems([]);
    }
  }, [birthday]);

  // NOTE: 誕生日から学歴が自動計算されたら、Firesoreに更新をかける処理
  const saveAcademicHistoryToFirebase = async (
    calcHistoryDates: academicHistoryItemsTypes[]
  ) => {
    try {
      const academicHistoryRef = collection(
        db,
        "familyCards",
        userId,
        "familyCard",
        familyCardId,
        "academicHistory"
      );
      const academicHistorySnapshot = await getDocs(academicHistoryRef);

      // 誕生日の変更があった場合に、前回の誕生日から自動計算された学歴データもしくはそれ以降編集されたデータを一度全て削除
      // 新たに誕生日から自動計算した学歴を表示させる。
      const deleteAcademicPromises = academicHistorySnapshot.docs.map(
        (doc) => deleteDoc(doc.ref) // todoDoc.refを指定するとドキュメントの削除や更新ができる。
      );
      await Promise.all(deleteAcademicPromises); // snapshotで返ってくる値はPromise。わたってきた値がすべて実行されるまで、次の処理にうつらない。
      // もとの学歴データの削除が終わったら、自動計算された学歴が再度Firestoreへ登録される
      calcHistoryDates.map(async (date) => {
        await addDoc(academicHistoryRef, date);
      });

      // 更新された誕生日も再度、学歴collection配下に登録する
      const birthdayRef = doc(academicHistoryRef, "birthday");
      if (birthday) {
        await setDoc(birthdayRef, { birthday: birthday });
      }

      // Firesoreへの登録が完了したら、画面上に新しいデータを表示させたいため、Firesoreから最新の値をとってくる
      fetchAcademicHistoryFromFirebase();
    } catch (error) {
      console.error("Error saving academic history:", error);
    }
  };

  // NOTE: 入力フォームに入力される値を格納するステート更新。学校・入学年月・卒業年月すべてacademicHistoryItemsに値を格納しデータを保持している。
  const handleInputChange = (
    index: number,
    key: keyof academicHistoryItemsTypes,
    value: string
  ) => {
    const updatedHistory = academicHistoryItems.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setAcademicHistoryItems(updatedHistory);
  };

  // NOTE: Enterを押した際にデータをFirestoreへ保存するための処理
  const handleSaveToFirebase = async (item: academicHistoryItemsTypes) => {
    // firestoreにすでに登録してある値と、ローカルのステートを比較し、相違があるかで条件分岐
    if (
      JSON.stringify(fetchHistoryItems) !== JSON.stringify(academicHistoryItems)
    ) {
      // ローカルの学歴情報に変更があった場合
      try {
        if (item.id) {
          const academicHistoryRef = doc(
            db,
            "familyCards",
            userId,
            "familyCard",
            familyCardId,
            "academicHistory",
            item.id
          );
          await updateDoc(academicHistoryRef, {
            school: item.school,
            contentStartDate: item.contentStartDate,
            contentEndDate: item.contentEndDate,
          });
          setFetchHistoryItems(academicHistoryItems); // 最新データを初期データとして更新
        }
      } catch (error) {
        console.error("Error updating academic history:", error);
      }
    }
    // 編集モードを解除する
    setChangeEditDetail(false);
  };

  // NOTE: 入力フォームの右横のプラスボタンが押され、編集モードが解除された時に次のFiresoreへの保存処理関数をはしらせる
  useEffect(() => {
    allSaveToFirebase();
  }, [changeEditDetail]);

  // NOTE: Firesoreへの保存処理
  const allSaveToFirebase = async () => {
    if (!userId) return;

    // 編集されているかにかかわらず、すべての値をFiresoreに格納
    // HACK: 編集ずみの値だけを取ってくる良い方法が思い浮かばなかったため、すべて保存にしてある。改善の余地あり。
    academicHistoryItems.map(async (item) => {
      if (item.id) {
        const academicHistoryRef = doc(
          db,
          "familyCards",
          userId,
          "familyCard",
          familyCardId,
          "academicHistory",
          item.id
        );
        await updateDoc(academicHistoryRef, {
          school: item.school,
          contentStartDate: item.contentStartDate,
          contentEndDate: item.contentEndDate,
        });
      }
    });
  };

  return (
    <Grid
      container
      sx={{ margin: "20px 0 20px 0", justifyContent: "center", width: "100%" }}
    >
      {/* 誕生日が登録されていたら、学歴を表示 */}
      {!previousBirthday?.birthday ? (
        <Grid item xs={12} justifyContent="center">
          <Typography textAlign="center">
            誕生日を入力すれば、自動で学歴が表示されます。
          </Typography>
        </Grid>
      ) : (
        <Grid item sx={{ width: "100%" }}>
          {/* 入力フォームのサンプルガイド */}
          <Grid container sx={{ width: "100%" }}>
            <Grid
              item
              sx={{
                width: "100%",
                backgroundColor: "rgba(224,224,224,0.25)",
                borderRadius: "10px",
                marginBottom: "5px",
              }}
            >
              <Typography textAlign="center">学校名</Typography>
            </Grid>
            <Grid item container sx={{ width: "100%" }}>
              <Grid
                item
                xs={6}
                sx={{
                  backgroundColor: "rgba(224,224,224,0.25)",
                  borderRadius: "10px",
                }}
              >
                <Typography textAlign="center">入学</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  backgroundColor: "rgba(224,224,224,0.25)",
                  borderRadius: "10px",
                }}
              >
                <Typography textAlign="center">卒業</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* 学歴の表示・編集欄 */}
          {academicHistoryItems.map((item, index) => (
            <Grid
              key={index}
              item
              container
              justifyContent="space-around"
              sx={{ width: "100%" }}
            >
              <Grid item xs={12} sx={{ width: "100%", marginRight: "10px" }}>
                {changeEditDetail && selectedIndex === detailIndex ? (
                  <InputFormComp
                    type={"text"}
                    inputValue={item.school}
                    handleKeyDown={(e) =>
                      e.key === "Enter" && handleSaveToFirebase(item)
                    }
                    onChangeAcademicValue={(e) =>
                      handleInputChange(index, "school", e.target.value)
                    }
                  />
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    {item.school}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  margin: "10px 0",
                }}
              >
                <Grid item sx={{ width: "100%" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"month"}
                      inputValue={item.contentStartDate}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && handleSaveToFirebase(item)
                      }
                      onChangeAcademicValue={(e) =>
                        handleInputChange(
                          index,
                          "contentStartDate",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {item.contentStartDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  width: "100%",
                  display: "flex",
                  margin: "10px 0",
                }}
              >
                <Typography sx={{ width: "100%", textAlign: "center" }}>
                  ー
                </Typography>
              </Grid>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  margin: "10px 0",
                }}
              >
                <Grid item sx={{ width: "100%" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"month"}
                      inputValue={item.contentEndDate}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && handleSaveToFirebase(item)
                      }
                      onChangeAcademicValue={(e) =>
                        handleInputChange(
                          index,
                          "contentEndDate",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {item.contentEndDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default AcademicHistory;
