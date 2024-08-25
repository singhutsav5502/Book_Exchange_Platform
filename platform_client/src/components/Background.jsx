import { Box } from "@mui/material";
import React from "react";

const Background = (props) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        height: '100vh', // Fixed height
        width: '100vw', // Fixed width
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.children}
    </Box>
  );
};

export default Background;
