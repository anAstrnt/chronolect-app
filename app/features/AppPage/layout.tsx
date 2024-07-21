import React, { ReactNode } from "react";
import { MenuData } from "@/data/MenuData";
import {
  Box,
  Grid,
  ImageList,
  ImageListItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import TimeDisplay from "@/components/TimeDisplay";

interface childrenProps {
  children: ReactNode;
}

const layout = ({ children }: childrenProps) => {
  return (
    <Grid sx={{ display: "flex", alignItems: "center", width: "200px", height: "100%" }}>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          position: "fixed",
          top: "30px",
          left: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            width: "100%",
          }}
        >
          <ImageListItem
            sx={{ padding: 0, width: 200, height: 200, borderRadius: "30px" }}
          >
            <img src="/images/titlelogo.png" />
          </ImageListItem>
          <Box sx={{ borderRight: "grey", padding: 0 }}>
            {MenuData.map((menu) => (
              <List
                key={menu.number}
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  bgcolor: "background.paper",
                  padding: 0,
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                // subheader={
                //   <ListSubheader component="div" id="nested-list-subheader">
                //     Nested List Items
                //   </ListSubheader>
                // }
              >
                <ListItemButton>
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText primary={menu.title} />
                </ListItemButton>
              </List>
            ))}
          </Box>
        </Box>
        <TimeDisplay />
      </Grid>
      {children}
    </Grid>
  );
};

export default layout;
