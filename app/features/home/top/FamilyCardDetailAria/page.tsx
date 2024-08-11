import EditButton from "@/components/EditButton";
import { Grid, Input, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AcademicHistory from "../../../../components/top/FamilyCardDetailAria/AcademicHistory";
import WorkHistory from "../../../../components/top/FamilyCardDetailAria/WorkHistory";
import { FamilyCardDetailData } from "@/data/FamilyCardDetailData";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import InputButton from "@/components/InputButton";

type userDetail = {
  detailId: string;
  name: string;
  birthday: string;
  postCode: string;
  address: string;
  qualification: string;
  email: string;
}[];

type fieldMap = {
  [key: number]: {
    field: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    getUserDetail: string;
  };
};

const FamilyCardDetail = () => {
  const { userId } = useFamilyCard();
  const [changeEditDetail, setChangeEditDetail] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [postCode, setPostCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [qualification, setQualification] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userDetail, setUserDetail] = useState<userDetail>([
    {
      detailId: "",
      name: "",
      birthday: "",
      postCode: "",
      address: "",
      qualification: "",
      email: "",
    },
  ]);

  const fieldMap: fieldMap = {
    1: {
      field: "name",
      value: name,
      setValue: setName,
      getUserDetail: userDetail[0].name,
    },
    2: {
      field: "birthday",
      value: birthday,
      setValue: setBirthday,
      getUserDetail: userDetail[0].birthday,
    },
    3: {
      field: "postCode",
      value: postCode,
      setValue: setPostCode,
      getUserDetail: userDetail[0].postCode,
    },
    4: {
      field: "address",
      value: address,
      setValue: setAddress,
      getUserDetail: userDetail[0].address,
    },
    5: {
      field: "qualification",
      value: qualification,
      setValue: setQualification,
      getUserDetail: userDetail[0].qualification,
    },
    6: {
      field: "email",
      value: email,
      setValue: setEmail,
      getUserDetail: userDetail[0].email,
    },
  };

  const onChangeDetail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const selectedField = fieldMap[index + 1];
    if (selectedField) {
      selectedField.setValue(e.target.value);
    }
  };

  const onChangeValue = (index: number) => {
    const selectedField = fieldMap[index + 1];
    if (selectedField) {
      return selectedField.value;
    }
  };

  const fetchDetailDocs = async () => {
    const detailCollectionRef = collection(db, "familyCard", userId, "detail");
    try {
      const detailSnapshot = await getDocs(detailCollectionRef);
      detailSnapshot.forEach((doc) => {
        setUserDetail([
          {
            detailId: doc.id,
            name: doc.data().name,
            birthday: doc.data().birthday,
            postCode: doc.data().postCode,
            address: doc.data().address,
            qualification: doc.data().qualification,
            email: doc.data().email,
          },
        ]);
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchDetailDocs();
    }
  }, [userId]);

  const onSubmitDetailData = async (
    e: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    e.preventDefault();

    const selectedField = fieldMap[index + 1];

    if (selectedField && userDetail) {
      const familyCardDocRef = await doc(
        db,
        "familyCard",
        userId,
        "detail",
        userDetail[0].detailId
      );
      await updateDoc(familyCardDocRef, {
        [selectedField.field]: selectedField.value,
      });

      const updateUserDetail = [...userDetail];
      updateUserDetail[0] = {
        ...updateUserDetail[0],
        [selectedField.field]: selectedField.value,
      };
      setUserDetail(updateUserDetail);

      selectedField.setValue("");
    }

    setSelectedIndex(index);
    setChangeEditDetail(!changeEditDetail);
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
      {userId
        ? FamilyCardDetailData.map((data, index) => (
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
                    <>
                      <Input
                        name={data.name}
                        type={data.type}
                        value={onChangeValue(index)}
                        onChange={(e) => onChangeDetail(e, index)}
                      />
                      <InputButton
                        changeEditDetail={changeEditDetail}
                        setChangeEditDetail={setChangeEditDetail}
                        setSelectedIndex={setSelectedIndex}
                        index={index}
                      />
                    </>
                  ) : (
                    <>
                      <EditButton
                        changeEditDetail={changeEditDetail}
                        setChangeEditDetail={setChangeEditDetail}
                        setSelectedIndex={setSelectedIndex}
                        index={index}
                      />
                      <Typography>{fieldMap[index + 1]?.getUserDetail || ""}</Typography>
                    </>
                  )}
                  {index + 1 === 7 ? <AcademicHistory /> : ""}
                  {index + 1 === 8 ? <WorkHistory /> : ""}
                </Grid>
              </form>
            </Grid>
          ))
        : ""}
    </Grid>
  );
};

export default FamilyCardDetail;
