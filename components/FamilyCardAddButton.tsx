import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import { Button } from "@mui/material";
import React from "react";

const FamilyCardAddButton: React.FC = () => {
  const { avatar, userName } = useFamilyCard();

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
