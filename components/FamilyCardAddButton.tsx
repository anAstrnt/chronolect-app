import { Button } from "@mui/material";
import React from "react";

type FamilyCardAddButtonProps = {
  userName: string;
  avatar: string;
};

const FamilyCardAddButton: React.FC<FamilyCardAddButtonProps> = ({
  userName,
  avatar,
}) => {
  return (
    <Button
      type="submit"
      disabled={!userName || !avatar}
      variant="contained"
      sx={{
        width: "250px",
        borderRadius: "100vw",
        padding: "1rem 4rem",
        backgroundColor: "#27acd9",
      }}
    >
      start
    </Button>
  );
};

export default FamilyCardAddButton;
