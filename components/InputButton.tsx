import React from "react";
import SendIcon from "@mui/icons-material/Send";
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
  const handleEditButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    console.log("handle in"); // ok
    setSelectedIndex(index);
    setChangeEditDetail(!changeEditDetail);
  };

  // sendIconを押してもFormのonsubmitが発火しない件を修正する
  return (
    <IconButton
      type="submit"
      size="small"
      onClick={(e) => handleEditButtonClick(e, index)}
    >
      <SendIcon />
    </IconButton>
  );
};

export default InputButton;
