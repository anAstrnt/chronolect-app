import React from "react";
import FamilyCardAria from "./FamilyCardAria/page";

interface pageProps {
  hasUserData: boolean;
}

const page: React.FC<pageProps> = ({ hasUserData }) => {
  return (
    <>
      <FamilyCardAria hasUserData={hasUserData} />
    </>
  );
};

export default page;
