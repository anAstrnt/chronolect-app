import React, { useRef } from "react";
import { useEffect } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { savePreviewsState } from "@/app/states/savedPreviewsState";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { userIdState } from "@/app/states/userIdState";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CategorySelect from "./CategorySelect";
import DeleteButton from "@/components/DeleteButton";
import { changePreviewsState } from "@/app/states/changePreviewsState";

type MemoSliderType = {
  selectCategory: string;
};

const MemoSlider: React.FC<MemoSliderType> = ({ selectCategory }) => {
  const userId = useRecoilValue(userIdState);
  const [savedPreviews, setSavedPreviews] = useRecoilState(savePreviewsState);
  // 外部ライブラリ（Glider.js）を使うときに、Refを使って「どのHTML要素を操作するか」を指定する
  const glideRef = useRef<Glide | null>(null);
  const glideContainerRef = useRef<HTMLDivElement | null>(null);
  const changePreviews = useRecoilValue(changePreviewsState);

  // NOTE: Firestore から保存されたPreviewデータを取得
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "memo", userId, "previews"),
      (snapshot) => {
        const previews = snapshot.docs.map((doc) => ({
          previewTitleId: doc.id,
          timeStamp: doc.data().timeStamp,
          category: doc.data().category,
          title: doc.data().title,
          description: doc.data().description,
          image: doc.data().image,
          url: doc.data().url,
          memo: doc.data().memo,
        }));
        setSavedPreviews(previews);
      }
    );
    return () => unsubscribe();
  }, [userId, changePreviews]);

  // NOTE: Glid.jsでスライダーを実装
  useEffect(() => {
    if (savedPreviews.length > 0 && glideContainerRef.current) {
      // glideContainerRefの参照を使いどのHTMLを操作するか指定しGliderライブラリに渡すことで、ライブラリがその要素の中でスライダーを動かすことができる
      glideRef.current = new Glide(glideContainerRef.current, {
        gap: 1,
        perView: 5,
        bound: true,
      });
      glideRef.current.mount();
    }
    return () => {
      // userIdが切り替わるとき、glideRefのデータがなかったり、前のRefが残っているとエラーが出るため、if文とnull代入をする
      if (glideRef.current) {
        glideRef.current.destroy();
        glideRef.current = null;
      }
    };
  }, [savedPreviews, userId]);

  return (
    <div
      className="glide"
      ref={glideContainerRef}
      style={{ width: "100%", position: "relative" }}
    >
      {/* ref=要素への参照をつくる*/}
      <div
        className="glide__track"
        data-glide-el="track"
        style={{ width: "100%" }}
      >
        <ul
          className="glide__slides"
          style={{
            width: "100%",
            margin: 0,
            padding: 0,
          }}
        >
          {savedPreviews
            .filter((prev) =>
              selectCategory ? selectCategory === prev.category : !prev.category
            )
            .map((p, index) => (
              <li
                key={`${p.previewTitleId}-${index}`}
                className="glide__slide"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item sx={{ width: "250px", position: "relative" }}>
                  <Grid
                    item
                    sx={{ position: "absolute", top: 0, left: 0, zIndex: 1000 }}
                  >
                    <CategorySelect previewId={p.previewTitleId || ""} />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 1000,
                      width: "40px",
                      height: "40px",
                      border: "1px solid #a8a29e",
                      borderRadius: "3px",
                      backgroundColor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <DeleteButton
                      mainCollection="memo"
                      mainDocId={userId}
                      collection="previews"
                      docId={p.previewTitleId || ""}
                    />
                  </Grid>
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
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {p.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </li>
            ))}
        </ul>
      </div>
      <div className="glide__arrows" data-glide-el="controls">
        <button
          className="glide__arrow glide__arrow--left"
          data-glide-dir="<"
          style={{
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "-30px",
            padding: "0",
            border: "none",
            outline: "none",
            font: "inherit",
            color: "inherit",
            background: "none",
            backgroundColor: "none",
          }}
        >
          <NavigateBeforeIcon
            sx={{
              width: "30px",
              height: "272px",
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          />
        </button>
        <button
          className="glide__arrow glide__arrow--right"
          data-glide-dir=">"
          style={{
            position: "absolute",
            top: "0",
            bottom: "0",
            right: "-30px",
            padding: "0",
            border: "none",
            outline: "none",
            font: "inherit",
            color: "inherit",
            background: "none",
            backgroundColor: "none",
          }}
        >
          <NavigateNextIcon
            sx={{
              width: "30px",
              height: "272px",
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default MemoSlider;
