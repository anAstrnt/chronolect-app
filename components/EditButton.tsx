import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

type EditButtonProps = {
  changeEditDetail: boolean;
  setChangeEditDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  index: number;
};

const EditButton: React.FC<EditButtonProps> = ({
  changeEditDetail,
  setChangeEditDetail,
  setSelectedIndex,
  index,
}) => {
  const handleEditButtonClick = (index: number) => {
    setSelectedIndex(index);
    setChangeEditDetail(!changeEditDetail);
  };

  return (
    <IconButton type="button" size="small" onClick={() => handleEditButtonClick(index)}>
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;
