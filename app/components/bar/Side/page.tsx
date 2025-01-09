"use client";

import { userIdState } from "@/app/states/userIdState";
import { usersState } from "@/app/states/usersState";
import { Avatar, Button, Grid, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AddIcon from "@mui/icons-material/Add";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { familyCardIdState } from "@/app/states/familyCardIdState";

// NOTE: FamilyCard・Todo・Memo欄のサイドバーとして表示させるコンポーネント
// NOTE: ユーザーの切替をすることができます。
const Page = () => {
  const hasUserData = useRecoilValue(hasUserDataState); // ユーザーデータが存在するかどうかを示すステート
  const [users, setUsers] = useRecoilState(usersState); // 現在のユーザーリストを保持するステート
  const userId = useRecoilValue(userIdState); // 現在選択されているユーザーのIDを格納するためのステート
  const setFamilyCardId = useSetRecoilState(familyCardIdState);
  const [openInputSpace, setOpenInputSpace] =
    useRecoilState(openInputSpaceState); // 入力スペースが開いているかどうかを示すステート

  // NOTE: ユーザーアイコンを押すと走る処理。ユーザーごとのページが画面中央に表示される。
  const openUserDetail = (familyCardId: string) => {
    if (familyCardId) {
      setFamilyCardId(familyCardId);
      setOpenInputSpace(false);
    } else {
      console.log("not choice user.");
    }
  };

  // NOTE: Sideバーのプラスボタンを押すと、ユーザーの登録ができる処理。FamilyCardでユーザーを登録するのと同じ効果が得られる。
  const openFamilyCardAddSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  // NOTE: ユーザーのデータが有れば（FamilyCardで何かしらユーザー情報が登録されていたら）、ユーザー情報を一覧でSideバーに表示させるための処理
  useEffect(() => {
    if (hasUserData) {
      const unsubscribe = onSnapshot(
        collection(db, "familyCards", userId, "familyCard"),
        (snapshot) => {
          const newUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            userName: doc.data().userName,
            avatar: doc.data().avatar,
          }));
          setUsers(newUsers);
        }
      );
      return () => unsubscribe();
    }
  }, [hasUserData]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          width: "100%",
          height: "100%",
          marginTop: "70px",
        }}
      >
        {/* ユーザーアイコンの表示 */}
        {users.map((user) => (
          <Grid item key={user.id} sx={{ marginBottom: "10px" }}>
            <Button
              onClick={() => openUserDetail(user.id)}
              sx={{
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&:hover .MuiAvatar-root": {
                  transform: "scale(1.4)",
                },
                "&:active .MuiAvatar-root": {
                  transform: "scale(1.2)",
                },
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: "white",
                  width: 40,
                  height: 40,
                  transition: "transform 0.2s",
                }}
                alt="user"
                src={user.avatar || "/images/titleLogo.png"}
              />
            </Button>
          </Grid>
        ))}

        {/* ユーザーの追加ボタンの表示 */}
        <Grid item>
          <IconButton
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "white",
              opacity: "0.3",
              transition: "opacity 0.3s, background-color 0.3s",
              "&:hover": {
                backgroundColor: "white",
                opacity: 1,
              },
              "& .MuiSvgIcon-root": {
                transition: "color 0.3s",
              },
              "&:hover .MuiSvgIcon-root": {
                color: "primary.main", // または任意の明るい色
              },
            }}
            onClick={() => openFamilyCardAddSpace()}
          >
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Page;
