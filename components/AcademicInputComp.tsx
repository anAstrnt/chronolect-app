import { Input } from "@mui/material";
import React from "react";

type AcademicInputCompProps = {
  inputValue: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeAcademicValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AcademicInputComp: React.FC<AcademicInputCompProps> = ({
  inputValue,
  handleKeyDown,
  onChangeAcademicValue,
}) => {
  console.log(onChangeAcademicValue);
  return (
    <Input
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

export default AcademicInputComp;
