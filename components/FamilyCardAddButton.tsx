import { avatarState } from "@/app/states/avatarState";
import { userNameState } from "@/app/states/userNameState";
import { Button } from "@mui/material";
import React from "react";
import { useRecoilValue } from "recoil";

const FamilyCardAddButton: React.FC = () => {
  const avatar = useRecoilValue(avatarState);
  const userName = useRecoilValue(userNameState);

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
