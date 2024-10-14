import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { useRecoilState } from "recoil";
import { changeEditDetailState } from "@/app/states/changeEditDetailState";

type EditButtonProps = {
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  index: number;
};

const EditButton: React.FC<EditButtonProps> = ({ setSelectedIndex, index }) => {
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  );

  const handleEditButtonClick = (index: number) => {
    setSelectedIndex(index);
    setChangeEditDetail(!changeEditDetail);
  };

  return (
    <IconButton
      type="button"
      size="small"
      onClick={() => handleEditButtonClick(index)}
    >
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;
