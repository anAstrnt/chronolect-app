import { Grid, Typography } from "@mui/material";
import React from "react";
import MemoSlider from "./MemoSlider";

// NOTE: 追加したURLのプレビュー情報を仮で表示させるコンポーネント（カテゴリー分けしていない状態）
const MemoPreview = () => {
  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid
        item
        sx={{
          borderRadius: "30px",
          minHeight: "300px",
          width: "100%",
          height: "400px",
          margin: "10px 0",
          position: "relative",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", margin: "15px 0" }}>
          PreviewAria
        </Typography>
        {/* プレビューデータの本体 */}
        <Grid item sx={{ margin: "0px 30px" }}>
          <MemoSlider selectCategory="カテゴリーなし" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MemoPreview;
