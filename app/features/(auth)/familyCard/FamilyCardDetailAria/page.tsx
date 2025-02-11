"use client";

import React, { useEffect, useState } from "react";
// NOTE:Firebaseのauth認証firestoreのデータを取得するためのインポート
import { db } from "@/libs/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
// NOTE:UIに関するインポート
import { Grid, Input, TextField, Typography } from "@mui/material";
// NOTE:各種コンポーネントのインポート
import AcademicHistory from "../../../../components/familyCard/FamilyCardDetailAria/AcademicHistory";
import WorkHistory from "../../../../components/familyCard/FamilyCardDetailAria/WorkHistory";
import EditButton from "@/components/EditButton";
import InputButton from "@/components/InputButton";
import Qualification from "@/app/components/familyCard/FamilyCardDetailAria/Qualification";
import DeleteButton from "@/components/DeleteButton";
// NOTE:faimlyCardの項目を格納したデータ
import { FamilyCardDetailData } from "@/data/FamilyCardDetailData";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { userDetailState } from "@/app/states/userDetailState";
import { changeEditDetailState } from "@/app/states/changeEditDetailState";
import { birthdayState } from "@/app/states/birthdayState";
import { familyCardIdState } from "@/app/states/familyCardIdState";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

type fieldMap = {
  [key: number]: {
    field: string;
    getUserDetail: () => string;
  };
};

// NOTE:familyCardの一覧を表示するためのコンポーネント
const FamilyCardDetail = () => {
  const userId = useRecoilValue(userIdState); // ユーザーのuidを格納するためのステート
  const [userDetail, setUserDetail] = useRecoilState(userDetailState);
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  );
  const setBirthday = useSetRecoilState(birthdayState);
  const [changeBirthday, setChangeBirthday] = useState<boolean>();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const familyCardId = useRecoilValue(familyCardIdState);

  // NOTE:FamilyCardDetailに表示する各種のデータを使いまわしたいので、オブジェクトとして管理
  // NOTE:JSXで値をmapで回しているので、indexを取得し、それぞれのfieldに紐づけられるようにしている。
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

  // NOTE:インプット欄に入力された値をset〇〇のステートにそれぞれ格納
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

  // NOTE:set〇〇のステートにそれぞれ格納された値をインプット欄に表示
  const onChangeValue = (index: number) => {
    const selectedField = fieldMap[index + 1];
    if (selectedField) {
      return selectedField.getUserDetail() || "";
    }
  };

  // NOTE:InputButtonにtype="submit"をつけているため、押されたときにformのonSubmitが発火し、値をfirestoreに送信するための処理。
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
      if (currentValue !== "" && familyCardId) {
        const familyCardDocRef = await doc(
          db,
          "familyCards",
          userId,
          "familyCard",
          familyCardId,
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
        setChangeBirthday(!changeBirthday);
      }
    }

    setSelectedIndex(index);
    // 値が更新されたら、入力モードから表示モードに切り替えを行う
    setChangeEditDetail(!changeEditDetail);
  };

  // NOTE:Firestoreからサブコレクション"detail"の値を取得。userDetailのステートに格納し、各所で使えるようにしています。
  const fetchDetailDocs = async () => {
    const detailCollectionRef = collection(
      db,
      "familyCards",
      userId,
      "familyCard",
      familyCardId,
      "detail"
    );
    try {
      // サブコレクション"detail"のrefから参照し取得。docsの自動生成docsIdのみを取得したいので、filterをかけています。
      const detailSnapshot = await getDocs(detailCollectionRef);
      const userDetails = detailSnapshot.docs.map((doc) => ({
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
    if (userId && familyCardId) {
      fetchDetailDocs();
    }
  }, [userId, familyCardId]);

  // NOTE: 誕生日が変更されたら学歴を自動計算させる処理
  useEffect(() => {
    if (userDetail?.birthday) {
      setBirthday(userDetail.birthday);
    }
  }, [changeBirthday]);

  // NOTE: 画面を切り替えたときに編集モードを解除するための処理
  useEffect(() => {
    setChangeEditDetail(false);
  }, [userId, familyCardId]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: familyCardId ? "auto" : "100vh",
        padding: "80px 20px",
      }}
    >
      <Grid
        item
        sx={{
          position: "absolute",
          top: "80px",
          right: "50px",
        }}
      >
        {familyCardId && (
          <DeleteConfirmationDialog
            topCollection="familyCards"
            topDocId={userId}
            mainCollection="familyCard"
            mainDocId={familyCardId}
            collection="detail"
            docId={userDetail.detailId}
          />
        )}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        sx={{
          width: "50%",
          height: familyCardId ? "auto" : "100%",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        {familyCardId ? (
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
                  <Grid item xs={1}>
                    <Typography sx={{ flexShrink: 0, width: "70px" }}>
                      {data.detailTitle}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    {changeEditDetail &&
                    selectedIndex === index &&
                    [1, 2, 3, 4, 5].includes(index + 1) ? (
                      <TextField
                        name={data.name}
                        type={data.type}
                        value={onChangeValue(index)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChangeDetail(e, index)
                        }
                        fullWidth
                        variant="outlined"
                        sx={{
                          width: "85%",
                          paddingLeft: "10px",
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          },
                        }}
                        placeholder={data.placeholder}
                      />
                    ) : (
                      <Typography
                        sx={{ fontSize: "1.2rem", textAlign: "center" }}
                      >
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
                    {index + 1 === 8 ? (
                      <WorkHistory
                        selectedIndex={selectedIndex}
                        detailIndex={index}
                      />
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={1}
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
            <Typography sx={{ textAlign: "center" }}>
              Selecting an icon will display information.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default FamilyCardDetail;
