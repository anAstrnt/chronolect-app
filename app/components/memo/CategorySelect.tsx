import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useRecoilState, useRecoilValue } from "recoil";
import { memoCategorysState } from "@/app/states/memoCategorysState";
import { db } from "@/libs/firebase";
import { userIdState } from "@/app/states/userIdState";
import { doc, updateDoc } from "firebase/firestore";
import { changePreviewsState } from "@/app/states/changePreviewsState";

type categorySelectType = {
  previewId: string;
};

const CategorySelect: React.FC<categorySelectType> = ({ previewId }) => {
  const userId = useRecoilValue(userIdState);
  const [choiceCategoryInValue, setChoiceCategoryInValue] = useState("");
  const categorys = useRecoilValue(memoCategorysState);
  const [changePreviews, setChangePreviews] =
    useRecoilState(changePreviewsState);

  const choiceCategory = (event: SelectChangeEvent) => {
    setChoiceCategoryInValue(event.target.value);
  };

  const changeMemoCategoryToFirebase = async () => {
    if (choiceCategoryInValue) {
      try {
        const previewRef = doc(db, "memo", userId, "previews", previewId);
        await updateDoc(previewRef, { category: choiceCategoryInValue });
        setChangePreviews(!changePreviews);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    changeMemoCategoryToFirebase();
  }, [choiceCategoryInValue]);

  return (
    <FormControl
      sx={{
        width: "40px",
        height: "40px",
      }}
    >
      <Select
        value={choiceCategoryInValue || ""}
        renderValue={() => ""}
        sx={{
          backgroundColor: "rgba(255,255,255,0.7)",
          width: "100%",
          height: "100%",
        }}
        onChange={choiceCategory}
      >
        {categorys.map((category) => (
          <MenuItem key={category.id} value={category.categoryName}>
            {category.categoryName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
