"use client";

import EditButton from "@/components/EditButton";
import { Grid, Input, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AcademicHistory from "../../../../components/familyCard/FamilyCardDetailAria/AcademicHistory";
import WorkHistory from "../../../../components/familyCard/FamilyCardDetailAria/WorkHistory";
import { FamilyCardDetailData } from "@/data/FamilyCardDetailData";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import InputButton from "@/components/InputButton";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { userDetailState } from "@/app/states/userDetailState";
import Qualification from "@/app/components/familyCard/FamilyCardDetailAria/Qualification";
import { changeEditDetailState } from "@/app/states/changeEditDetailState";
import { birthdayState } from "@/app/states/birthdayState";

type fieldMap = {
  [key: number]: {
    field: string;
    getUserDetail: () => string;
  };
};

const FamilyCardDetail = () => {
  const userId = useRecoilValue(userIdState);
  const [userDetail, setUserDetail] = useRecoilState(userDetailState);
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  );
  const setBirthday = useSetRecoilState(birthdayState);

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  // FamilyCardDetailに表示する各種のデータを使いまわしたいので、オブジェクトとして管理
  // JSXで値をmapで回しているので、indexを取得し、それぞれのfieldに紐づけられるようにしている。
  const fieldMap: fieldMap = {
    1: {
      field: "name",
      getUserDetail: () => userDetail?.name,
    },
    2: {
      field: "birthday",
      getUserDetail: () => userDetail?.birthday,
    },
    3: {
      field: "postCode",
      getUserDetail: () => userDetail?.postCode,
    },
    4: {
      field: "address",
      getUserDetail: () => userDetail?.address,
    },
    5: {
      field: "email",
      getUserDetail: () => userDetail?.email,
    },
  };

  // インプット欄に入力された値をset〇〇のステートにそれぞれ格納
  const onChangeDetail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const selectedField = fieldMap[index + 1];
    if (selectedField && userDetail) {
      const updateUserDetail = {
        ...userDetail,
        [selectedField.field]: e.target.value,
      };
      setUserDetail(updateUserDetail);
    }
  };

  // set〇〇のステートにそれぞれ格納された値をインプット欄に表示
  const onChangeValue = (index: number) => {
    const selectedField = fieldMap[index + 1];
    if (selectedField) {
      return selectedField.getUserDetail();
    }
  };

  // InputButtonにtype="submit"をつけているため、押されたときにformのonSubmitが発火し、値をfirestoreに送信するための処理。
  const onSubmitDetailData = async (
    e: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    e.preventDefault();

    // どのfieldが選択されたかを定数に格納
    const selectedField = fieldMap[index + 1];

    // 選択されたfieldが分かり、FamilyCardAddコンポーネントで作った初期値のuserDetailを取得できていたら、firestoreからrefを取得し、このrefを参考にupdateDoc関数で選択したfieldのみを更新している。
    if (selectedField && userDetail) {
      const currentValue = selectedField.getUserDetail();
      // 入力値が空でない場合のみ更新を行う
      if (currentValue !== "") {
        const familyCardDocRef = await doc(
          db,
          "familyCard",
          userId,
          "detail",
          userDetail.detailId
        );
        await updateDoc(familyCardDocRef, {
          [selectedField.field]: currentValue,
        });

        // JSXにセットしたステートの値をリアルタイムで表示させるためレンダリングを起こす必要があり、ステートを更新して、JSXに新しい値を表示している。
        const updateUserDetail = {
          ...userDetail,
          [selectedField.field]: currentValue,
        };
        setUserDetail(updateUserDetail);
      }
    }

    setSelectedIndex(index);
    // 値が更新されたら、入力モードから表示モードに切り替えを行う
    setChangeEditDetail(!changeEditDetail);
  };

  // Firestoreからサブコレクション"detail"の値を取得。userDetailのステートに格納し、各所で使えるようにしています。
  const fetchDetailDocs = async () => {
    const detailCollectionRef = collection(db, "familyCard", userId, "detail");
    try {
      // サブコレクション"detail"のrefから参照し取得。docsの自動生成docsIdのみを取得したいので、filterをかけています。
      const detailSnapshot = await getDocs(detailCollectionRef);
      const userDetails = detailSnapshot.docs
        .filter(
          (doc) =>
            // doc.id !== "qualification" && "academicHistory" && "workHistory"
            doc.id !== "academicHistory"
        )
        .map((doc) => ({
          detailId: doc.id,
          name: doc.data().name,
          birthday: doc.data().birthday,
          postCode: doc.data().postCode,
          address: doc.data().address,
          email: doc.data().email,
        }));

      // 配列の最初の要素を取得し、それをuserDetailとして設定
      if (userDetails.length > 0) {
        setUserDetail(userDetails[0]);
      } else {
        // ユーザー詳細が見つからない場合は、デフォルト値を設定
        setUserDetail({
          detailId: "",
          name: "",
          birthday: "",
          postCode: "",
          address: "",
          email: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchDetailDocs();
    }
  }, [userId]);

  useEffect(() => {
    if (userDetail?.birthday) {
      setBirthday(userDetail.birthday);
    }
  }, [userDetail?.birthday]);

  useEffect(() => {
    setChangeEditDetail(false);
  }, [userId]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100vh",
        padding: "80px 20px 20px 40px",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        sx={{
          width: "50%",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        {userId ? (
          FamilyCardDetailData.map((data, index) => (
            <Grid
              item
              key={data.number}
              xs={12}
              sx={{
                width: "200px",
                padding: "20px",
                position: "relative",

                "&:after": {
                  content: `''`,
                  position: "absolute",
                  bottom: "5px" /*線の上下位置*/,
                  borderBottom: "1px solid #fff",
                  width: "90%" /*線の長さ*/,
                  height: "5px" /*線の太さ*/,
                },
              }}
            >
              <form onSubmit={(e) => onSubmitDetailData(e, index)}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={2}>
                    <Typography sx={{ flexShrink: 0, width: "70px" }}>
                      {data.detailTitle}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    {changeEditDetail &&
                    selectedIndex === index &&
                    [1, 2, 3, 4, 5].includes(index + 1) ? (
                      <Input
                        name={data.name}
                        type={data.type}
                        value={onChangeValue(index)}
                        onChange={(e) => onChangeDetail(e, index)}
                        fullWidth
                        disableUnderline
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          },
                        }}
                        placeholder={data.placeholder}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "1.2rem" }}>
                        {fieldMap[index + 1]?.getUserDetail()}
                      </Typography>
                    )}

                    {index + 1 === 6 ? (
                      <Qualification
                        selectedIndex={selectedIndex}
                        detailIndex={index}
                      />
                    ) : (
                      ""
                    )}
                    {index + 1 === 7 ? (
                      <AcademicHistory
                        selectedIndex={selectedIndex}
                        detailIndex={index}
                      />
                    ) : (
                      ""
                    )}
                    {index + 1 === 8 ? <WorkHistory /> : ""}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {changeEditDetail &&
                    selectedIndex === index &&
                    [1, 2, 3, 4, 5, 6, 7, 8].includes(index + 1) ? (
                      <InputButton />
                    ) : (
                      <EditButton
                        setSelectedIndex={setSelectedIndex}
                        index={index}
                      />
                    )}
                  </Grid>
                </Grid>
              </form>
            </Grid>
          ))
        ) : (
          <Grid
            item
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>Selecting an icon will display information.</Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default FamilyCardDetail;
