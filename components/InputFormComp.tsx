import { Input } from "@mui/material";
import React from "react";

type InputFormCompProps = {
  type: string;
  inputValue: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeAcademicValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputFormComp: React.FC<InputFormCompProps> = ({
  type,
  inputValue,
  handleKeyDown,
  onChangeAcademicValue,
}) => {
  return (
    <Input
      type={type}
      value={inputValue}
      onKeyDown={handleKeyDown}
      onChange={onChangeAcademicValue}
      disableUnderline
      sx={{
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  );
};

export default InputFormComp;
