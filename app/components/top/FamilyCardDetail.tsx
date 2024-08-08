import EditButton from "@/components/EditButton";
import { Grid3x3TwoTone } from "@mui/icons-material";

import { Grid, Input, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AcademicHistory from "./AcademicHistory";
import WorkHistory from "./WorkHistory";
import { FamilyCardDetailData } from "@/data/FamilyCardDetailData";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import InputButton from "@/components/InputButton";

const FamilyCardDetail = () => {
  const { userId } = useFamilyCard();
  const [changeEditDetail, setChangeEditDetail] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [birthday, setBirthday] = useState<string | undefined>();
  const [postCode, setPostCode] = useState<string | undefined>();
  const [address, setAddress] = useState<string | undefined>();
  const [qualification, setQualification] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();

  const onChangeDetail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    switch (index + 1) {
      case 1:
        setName(e.target.value);
        break;
      case 2:
        setBirthday(e.target.value);
      case 3:
        setPostCode(e.target.value);
        break;
      case 4:
        setAddress(e.target.value);
        break;
      case 5:
        setQualification(e.target.value);
        break;
      case 6:
        setEmail(e.target.value);
        break;
    }
  };

  const onChangeValue = (index: number) => {
    switch (index + 1) {
      case 1:
        return name;
      case 2:
        return birthday;
      case 3:
        return postCode;
      case 4:
        return address;
      case 5:
        return qualification;
      case 6:
        return email;
    }
  };

  const onSubmitDetailData = async (
    e: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    console.log("in");
    e.preventDefault();
    // Firebaseの対象のユーザーの下位コレクションに名前等を追加する処理。まずは、どの対象ユーザーのカードがクリックされたかの情報を取ってくる。今はオンチェンジで値を取ってきてFirebaseを更新しようとしているが、サブミットで値を更新するようにする？
    if (index + 1 === 1) {
      console.log("name in");

      const familyCardCollectionRef = await doc(
        collection(db, "familyCard", userId, "detail")
      );
      await updateDoc(familyCardCollectionRef, {
        name: name,
      });
      setName("");
    }
  };

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      columns={9}
      sx={{ margin: "20px" }}
    >
      {FamilyCardDetailData.map((data, index) => (
        <Grid
          item
          xs={3}
          sx={{
            width: "300px",
            margin: "5px",
            padding: "20px",
            border: "1px solid #fff",
            borderRadius: "15px",
            boxShadow: 3,
          }}
          key={data.number}
        >
          <form onSubmit={(e) => onSubmitDetailData(e, index)}>
            <Grid sx={{ display: "flex", alignItems: "center" }}>
              <Typography>{data.detailTitle}</Typography>
              {changeEditDetail &&
              selectedIndex === index &&
              [1, 2, 3, 4, 5, 6].includes(index + 1) ? (
                <InputButton
                  changeEditDetail={changeEditDetail}
                  setChangeEditDetail={setChangeEditDetail}
                  setSelectedIndex={setSelectedIndex}
                  index={index}
                />
              ) : (
                <EditButton
                  changeEditDetail={changeEditDetail}
                  setChangeEditDetail={setChangeEditDetail}
                  setSelectedIndex={setSelectedIndex}
                  index={index}
                />
              )}

              {/* インプットボタンをコンポーネントで作ったので、編集画面になったら、サブミットボタンとして編集ボタンの代わりに表示するように実装する。インプットが完了し、サブミットボタンが押されたら、Firestoreにデータを格納するように実装を行う */}

              <Grid sx={{ paddingLeft: "30px" }}>
                {changeEditDetail &&
                selectedIndex === index &&
                [1, 2, 3, 4, 5, 6].includes(index + 1) ? (
                  <Input
                    name={data.name}
                    type={data.type}
                    value={onChangeValue(index)}
                    onChange={(e) => onChangeDetail(e, index)}
                  />
                ) : (
                  ""
                )}

                {index + 1 === 7 ? <AcademicHistory /> : ""}
                {index + 1 === 8 ? <WorkHistory /> : ""}
              </Grid>
            </Grid>
          </form>
        </Grid>
      ))}
    </Grid>
  );
};

export default FamilyCardDetail;
