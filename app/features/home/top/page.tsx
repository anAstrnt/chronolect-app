import React from "react";
import FamilyCardAria from "./FamilyCardAria/page";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";

// type pageProps = {
//   hasUserData: boolean;
// };

const page: React.FC = () =>
  // { hasUserData }

  {
    return (
      <>
        <FamilyCardAria />
        {/* <FamilyCardAria hasUserData={hasUserData} /> */}
      </>
    );
  };

export default page;
