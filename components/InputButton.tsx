import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

type InputButtonProps = {
  changeEditDetail: boolean;
  setChangeEditDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  index: number;
};

const InputButton: React.FC<InputButtonProps> = ({
  changeEditDetail,
  setChangeEditDetail,
  setSelectedIndex,
  index,
}) => {
  const handleEditButtonClick = (index: number) => {
    console.log("handle in"); // ok
    setSelectedIndex(index);
    setChangeEditDetail(!changeEditDetail);
  };

  return (
    <IconButton type="submit" size="small">
      <AddIcon />
    </IconButton>
  );
};

export default InputButton;
