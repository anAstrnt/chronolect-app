"use client";

import { Avatar, AvatarGroup, Box, Grid, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "@/styles/ImageUpload.module.css";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/libs/firebase";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";

type ImageUploadProps = {
  setAvatarImage: React.Dispatch<React.SetStateAction<File | null>>;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ setAvatarImage }) => {
  const { setAvatar } = useFamilyCard();
  const [sampleAvatarImage, setSampleAvatarImage] = useState<string[]>([]);

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      const fileObject = e.target.files![0];
      setAvatarImage(e.target.files![0]);
      setAvatar(window.URL.createObjectURL(fileObject));
      e.target.value = "";
    }
  };

  useEffect(() => {
    const sampleAvatarNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // 画像のURLを非同期で取得する関数
    const fetchImages = async () => {
      try {
        const promises = sampleAvatarNumbers.map((sampleAvatarNumber) => {
          //  Firebase Storageから画像の参照を取得
          const gsReference = ref(
            storage,
            `gs://chronolect-app.appspot.com/sample_avatar/avatar${sampleAvatarNumber}.png`
          );
          // 画像の参照を使い画像のダウンロードURLをプロミスで取得
          return getDownloadURL(gsReference);
        });

        // 全ての Promise を並列で実行し、結果のURLを取得し格納。 ※ 画像取得時間短縮のための処理
        const urls = await Promise.all(promises);
        setSampleAvatarImage(urls);
      } catch (err) {
        console.error(err);
      }
    };

    fetchImages();
  }, []);

  const onClickSampleAvatar = (index: number) => {
    const choiceSampleAvatarImage = sampleAvatarImage[index];
    setAvatar(choiceSampleAvatarImage);
  };

  return (
    <div className={style.outerBox}>
      <div className={style.title}>
        {/* <h2>画像アップローダー</h2> */}
        <p>JpegかPngの画像ファイル</p>
      </div>
      <div className={style.imageUplodeBox}>
        <p>フォルダからアップロード</p>
        <input
          className={style.imageUploadInput}
          multiple
          name="imageURL"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={onChangeImageHandler}
        />
      </div>
      <p>または</p>
      <AvatarGroup>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 2,
            justifyItems: "center",
          }}
        >
          {sampleAvatarImage.map((prevSampleAvatarImage, index) => (
            <IconButton
              key={prevSampleAvatarImage}
              onClick={() => onClickSampleAvatar(index)}
              sx={{
                width: 40,
                height: 40,
                padding: 0,
              }}
            >
              <Grid
                border={2}
                sx={{
                  borderRadius: "50%",
                  borderColor: "rgba(0,0,0,0.1)",
                  "&:hover": {
                    cursor: "pointer",
                    background: "aqua",
                  },
                  "&:active": {
                    background: "blue",
                  },
                }}
              >
                <Avatar sx={{ border: "2px solid #333" }} src={prevSampleAvatarImage} />
              </Grid>
            </IconButton>
          ))}
        </Box>
      </AvatarGroup>
    </div>
  );
};

export default ImageUpload;
