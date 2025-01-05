import React, { useRef, useEffect } from "react";
// NOTE:firestoreのデータを取得するためのインポート
import { db } from "@/libs/firebase";
import { collection, onSnapshot } from "firebase/firestore";
// NOTE:スライダーを実装するためのインポート
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
// NOTE:UIに関するインポート
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// NOTE:コンポーネントのインポート
import CategorySelect from "./CategorySelect";
import DeleteButton from "@/components/DeleteButton";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { savePreviewsState } from "@/app/states/savedPreviewsState";
import { changePreviewsState } from "@/app/states/changePreviewsState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

type MemoSliderType = {
  selectCategory: string;
};

// NOTE: プレビューデータをスライダーで表示するためのコンポーネント
const MemoSlider: React.FC<MemoSliderType> = ({ selectCategory }) => {
  const userId = useRecoilValue(userIdState); // ユーザーのuidを使用するためのステート
  const familyCardId = useRecoilValue(familyCardIdState); // Sidebarで選択されたFamilyCardに紐づけたMemoを表示させるためのステート
  const [savedPreviews, setSavedPreviews] = useRecoilState(savePreviewsState); // Firestore から保存されたPreviewデータを入れるためのステート
  const changePreviews = useRecoilValue(changePreviewsState); // <CategorySelect />でカテゴリーが選択されプレビューデータをFirestoreに登録したあとに、最新のプレビューデータをFirestoreから取得するためのステート
  // 外部ライブラリ（Glider.js）を使うときに、Refを使って「どのHTML要素を操作するか」を指定する
  const glideRef = useRef<Glide | null>(null);
  const glideContainerRef = useRef<HTMLDivElement | null>(null);

  // NOTE: Firestore から保存されたPreviewデータを取得
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "setMemoUser", userId, "memo", familyCardId, "previews"),
      (snapshot) => {
        const previews = snapshot.docs.map((doc) => ({
          previewTitleId: doc.id,
          timeStamp: doc.data().timeStamp,
          category: doc.data().category,
          title: doc.data().title,
          description: doc.data().description,
          image:
            doc.data().image ||
            "https://github.com/user-attachments/assets/04411ed8-01b7-4a6b-8294-e9a3cfdd3316",
          url: doc.data().url,
          memo: doc.data().memo,
        }));
        setSavedPreviews(previews);
      }
    );
    return () => unsubscribe();
  }, [userId, familyCardId, changePreviews]);

  // NOTE: Glid.jsでスライダーを実装
  useEffect(() => {
    // glideContainerRef.current= ref={glideContainerRef}を指定したdiv要素が入る。初期値はnullでマウントされるとHTMLDivElementが設定される。アンマウントで再度nullになる。
    if (savedPreviews.length > 0 && glideContainerRef.current) {
      // glideContainerRefの参照を使いどのHTMLを操作するか指定しGliderライブラリに渡すことで、ライブラリがその要素の中でスライダーを動かすことができる
      glideRef.current = new Glide(glideContainerRef.current, {
        gap: 1, // スライド間の隙間を1pxに。
        perView: 5, // 一度に表示するスライドの数を５に。
        bound: true, // スライダーが最後のスライドに達したときに、さらにスライドを動かせないように制限。
      });
      // GridインスタンスをDOMにマウントするためのメソッド。スライダーが初期化され、指定した要素内で動作を開始する。
      glideRef.current.mount();
    }
    return () => {
      // familyCardIdが切り替わるとき、glideRefのデータがなかったり、前のRefが残っているとエラーが出るため、if文とnull代入をする
      if (glideRef.current) {
        glideRef.current.destroy(); //スライダーのインスタンスを破棄
        glideRef.current = null;
      }
    };
  }, [savedPreviews, userId, familyCardId]);

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
                      topCollection="setMemoUser"
                      topDocId={userId}
                      mainCollection="memo"
                      mainDocId={familyCardId}
                      collection="previews"
                      docId={p.previewTitleId || ""}
                      appearance={"icon"}
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
