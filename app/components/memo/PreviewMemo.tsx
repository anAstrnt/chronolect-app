"use client";

import { previewState } from "@/app/states/previewState";
import { savePreviewsState } from "@/app/states/savedPreviewsState";
import { db } from "@/libs/firebase";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import CloseIcon from "@mui/icons-material/Close";

const PreviewMemo = () => {
  const preview = useRecoilValue(previewState);
  const [savedPreviews, setSavedPreviews] = useRecoilState(savePreviewsState);

  useEffect(() => {
    // Firestore から保存されたプレビューデータを取得
    const unsubscribe = onSnapshot(collection(db, "previews"), (snapshot) => {
      const previews = snapshot.docs.map((doc) => ({
        previewTitleId: doc.id,
        timeStamp: doc.data().timeStamp,
        title: doc.data().title,
        description: doc.data().description,
        image: doc.data().image,
        url: doc.data().url,
        memo: doc.data().memo,
      }));
      setSavedPreviews(previews);
    });
    return () => unsubscribe();
  }, []);

  const onClickDeleteMemo = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    titleId: string | undefined
  ) => {
    try {
      if (titleId) {
        await deleteDoc(doc(db, "previews", titleId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: DnD kit を導入する
  return (
    <Grid>
      <h2>Saved Previews</h2>
      <Grid
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {savedPreviews.map((p, index) => (
          <Grid
            key={`${p.previewTitleId}-${index}`}
            sx={{ maxWidth: 250, margin: "5px", position: "relative" }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 5,
                right: 5,
                zIndex: 1,
                width: "24px",
                height: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              }}
              onClick={(e) => onClickDeleteMemo(e, p.previewTitleId)}
            >
              <CloseIcon />
            </IconButton>
            <Card>
              <CardActionArea href={p.url} target="_blank">
                <CardMedia
                  component="img"
                  height="140"
                  image={p.image}
                  alt={p.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {p.memo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {p.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default PreviewMemo;
