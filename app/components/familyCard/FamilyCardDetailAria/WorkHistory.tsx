import React, { useEffect, useState } from "react";
import { Grid, IconButton, Input, Typography } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { changeEditDetailState } from "@/app/states/changeEditDetailState";
import { workHistoryItemsState } from "@/app/states/workHistoryItemsState";
import InputFormComp from "@/components/InputFormComp";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { workHistoryItemsTypes } from "@/types/workHistoryItemTypes";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { blueGrey, grey } from "@mui/material/colors";

type workHistoryProps = {
  selectedIndex: number | undefined;
  detailIndex: number;
};

const WorkHistory: React.FC<workHistoryProps> = ({
  selectedIndex,
  detailIndex,
}) => {
  const userId = useRecoilValue(userIdState);
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  );
  const [workHistoryItems, setWorkHistoryItems] = useRecoilState(
    workHistoryItemsState
  );
  const [originalWorkHistory, setOriginalWorkHistory] = useState<
    workHistoryItemsTypes[]
  >([]); // 元のworkHistoryデータ
  const [company, setCompany] = useState<string>("");
  const [employmentDate, setEmploymentDate] = useState<string>("");
  const [resignationDate, setResignationDate] = useState<string>("");

  // Firestoreからデータ取得
  useEffect(() => {
    if (userId) {
      fetchWorkHistoryFromFirebase();
    }
  }, [userId]);

  const fetchWorkHistoryFromFirebase = async () => {
    try {
      const workHistoryRef = doc(
        db,
        "familyCard",
        userId,
        "detail",
        "workHistory"
      );
      const workHistoryDoc = await getDoc(workHistoryRef);

      if (workHistoryDoc.exists()) {
        const data = workHistoryDoc.data();
        const historyData = Array.isArray(data.history) ? data.history : [];
        setWorkHistoryItems(historyData);
        setOriginalWorkHistory(historyData); // 元のデータを保存
        console.log(data);
      } else {
        console.log("No data found");
        setWorkHistoryItems([]);
        setOriginalWorkHistory([]);
      }
    } catch (error) {
      console.error("Error fetching work history: ", error);
    }
  };

  // 値の編集を更新する
  const handleInputChange = (
    index: number,
    key: keyof workHistoryItemsTypes,
    value: string
  ) => {
    const updatedHistory = workHistoryItems.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setWorkHistoryItems(updatedHistory);
  };

  // Firestoreへ新規または編集済みのデータを保存
  const saveToFirestore = async () => {
    const workHistoryRef = doc(
      db,
      "familyCard",
      userId,
      "detail",
      "workHistory"
    );

    if (!company && !employmentDate && !resignationDate) return;

    try {
      // 新しいエントリーを作成
      const newEntry = {
        company: company || "",
        employmentDate: employmentDate || "",
        resignationDate: resignationDate || "",
      };

      // 既存の職歴アイテムに新しいエントリーを追加
      const newWorkHistoryItems = [...workHistoryItems, newEntry];

      await setDoc(
        workHistoryRef,
        { history: newWorkHistoryItems },
        { merge: true }
      );
      setOriginalWorkHistory(workHistoryItems);
      setCompany("");
      setEmploymentDate("");
      setResignationDate("");
      fetchWorkHistoryFromFirebase();
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  // 変更があるかチェック
  const hasChanges = () => {
    return (
      JSON.stringify(workHistoryItems) !==
        JSON.stringify(originalWorkHistory) ||
      company !== "" ||
      employmentDate !== "" ||
      resignationDate !== ""
    );
  };

  // 編集完了時にデータを保存
  useEffect(() => {
    if (!changeEditDetail && hasChanges()) {
      saveToFirestore();
    }
  }, [changeEditDetail]);

  // 新規エントリーの追加
  const addNewHistoryEntry = () => {
    if (!company && !employmentDate && !resignationDate) return;

    const newEntry = {
      company,
      employmentDate,
      resignationDate,
    };

    const updatedHistory = [...workHistoryItems, newEntry];
    setWorkHistoryItems(updatedHistory);
    setCompany("");
    setEmploymentDate("");
    setResignationDate("");
    setChangeEditDetail(false);
  };

  const handleDelete = async (index: number) => {
    const updatedHistory = workHistoryItems.filter((_, i) => i !== index);
    setWorkHistoryItems(updatedHistory);

    const workHistoryRef = doc(
      db,
      "familyCard",
      userId,
      "detail",
      "workHistory"
    );
    try {
      await setDoc(
        workHistoryRef,
        { history: updatedHistory },
        { merge: true }
      );
      setCompany("");
      setEmploymentDate("");
      setResignationDate("");
      console.log("Item deleted and data updated successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Grid container sx={{ margin: "20px 0 20px 0" }}>
      <Grid container sx={{ width: "100%" }}>
        <Grid
          item
          sx={{
            width: "100%",
            backgroundColor: "rgba(224,224,224,0.25)",
            borderRadius: "10px",
            marginBottom: "5px",
          }}
        >
          <Typography textAlign="center">会社名</Typography>
        </Grid>
        <Grid item container sx={{ width: "100%" }}>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "rgba(224,224,224,0.25)",
              borderRadius: "10px",
            }}
          >
            <Typography textAlign="center">入職日</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "rgba(224,224,224,0.25)",
              borderRadius: "10px",
            }}
          >
            <Typography textAlign="center">退職日</Typography>
          </Grid>
        </Grid>
      </Grid>
      {workHistoryItems.map((item, index) => (
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          // flexDirection="column"
          key={index}
          sx={{ width: "100%" }}
        >
          <Grid
            item
            container
            flexDirection="column"
            xs={11}
            sx={{ width: "100%" }}
          >
            <Grid item justifyContent="center">
              {changeEditDetail && selectedIndex === detailIndex ? (
                <InputFormComp
                  type={"text"}
                  inputValue={item.company}
                  handleKeyDown={(e) =>
                    e.key === "Enter" && addNewHistoryEntry()
                  }
                  onChangeAcademicValue={(e) =>
                    handleInputChange(index, "company", e.target.value)
                  }
                />
              ) : (
                <Typography sx={{ textAlign: "center" }}>
                  {item.company}
                </Typography>
              )}
            </Grid>
            <Grid item container>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "100%",
                  margin: "10px 0 20px 0",
                }}
              >
                {changeEditDetail && selectedIndex === detailIndex ? (
                  <InputFormComp
                    type={"month"}
                    inputValue={item.employmentDate}
                    handleKeyDown={(e) =>
                      e.key === "Enter" && addNewHistoryEntry()
                    }
                    onChangeAcademicValue={(e) =>
                      handleInputChange(index, "employmentDate", e.target.value)
                    }
                  />
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    {item.employmentDate}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <Typography sx={{ textAlign: "center" }}>ー</Typography>
              </Grid>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "200px",
                  margin: "10px 0 20px 0",
                }}
              >
                {changeEditDetail && selectedIndex === detailIndex ? (
                  <InputFormComp
                    type={"month"}
                    inputValue={item.resignationDate || ""}
                    handleKeyDown={(e) =>
                      e.key === "Enter" && addNewHistoryEntry()
                    }
                    onChangeAcademicValue={(e) =>
                      handleInputChange(
                        index,
                        "resignationDate",
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    {item.resignationDate}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>

          {changeEditDetail && selectedIndex === detailIndex ? (
            <Grid item xs={1} sx={{ width: "100%" }}>
              <IconButton onClick={() => handleDelete(index)}>
                <DeleteForeverIcon />
              </IconButton>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      ))}

      {/* Form for adding new history entry */}
      {changeEditDetail && selectedIndex === detailIndex && (
        <Grid container justifyContent="space-around">
          <Grid item sx={{ width: "100%" }}>
            <Input
              type="text"
              value={company}
              onKeyDown={(e) => e.key === "Enter" && addNewHistoryEntry()}
              onChange={(e) => setCompany(e.target.value)}
              disableUnderline
              sx={{
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
              }}
            />
          </Grid>
          <Grid container>
            <Grid
              item
              xs={5.5}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                margin: "10px 0",
              }}
            >
              <Grid item sx={{ marginBottom: "10px" }}>
                <Input
                  type="month"
                  value={employmentDate}
                  onKeyDown={(e) => e.key === "Enter" && addNewHistoryEntry()}
                  onChange={(e) => setEmploymentDate(e.target.value)}
                  disableUnderline
                  sx={{
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              <Typography>ー</Typography>
            </Grid>
            <Grid
              item
              xs={5.5}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "200px",
                margin: "10px 0 20px 0",
              }}
            >
              <Input
                type="month"
                value={resignationDate}
                onKeyDown={(e) => e.key === "Enter" && addNewHistoryEntry()}
                onChange={(e) => setResignationDate(e.target.value)}
                disableUnderline
                sx={{
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default WorkHistory;
