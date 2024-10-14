// "use client";

// import React, { useEffect } from "react";
// import { Card, CardActionArea, Grid, Typography } from "@mui/material";
// import FamilyCard from "@/app/components/familyCard/FamilyCardAria/FamilyCard";
// import AddIcon from "@mui/icons-material/Add";
// import FamilyCardAdd from "@/app/components/familyCard/FamilyCardAria/FamilyCardAdd";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { openInputSpaceState } from "@/app/states/openInputSpaceState";
// import { hasUserDataState } from "@/app/states/hasUserDataState";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "@/libs/firebase";
// import { usersState } from "@/app/states/usersState";

// const Page: React.FC = () => {
//   const [openInputSpace, setOpenInputSpace] =
//     useRecoilState(openInputSpaceState);

//   const openFamilyCardAddSpace = () => {
//     setOpenInputSpace(!openInputSpace);
//   };

//   return (
//     <Grid
//       sx={{
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//       }}
//     >
//       {/* <Grid
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <FamilyCard />
//         <Card
//           sx={{
//             maxWidth: 200,
//             margin: "10px",
//             opacity: "0.5",
//             height: "222px",
//             width: "200px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <CardActionArea
//             onClick={openFamilyCardAddSpace}
//             sx={{
//               height: "100%",
//               width: "100%",
//               padding: "20px 40px",
//             }}
//           >
//             <AddIcon />
//           </CardActionArea>
//         </Card>
//       </Grid> */}
//       {openInputSpace ? <FamilyCardAdd /> : ""}
//     </Grid>
//   );
// };

// export default Page;
