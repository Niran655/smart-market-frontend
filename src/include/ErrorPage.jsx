import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
 

const ErrorPage = ({ error, refetch,t }) => {
 

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 4,
          mt: 6,
          border: "1px solid",
          borderColor: "error.main",
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {t("error_loading") || "Error loading dashboard"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error?.message || t("unknown_error")}
        </Typography>
        <Button
          onClick={refetch}
          variant="outlined"
          color="error"
          sx={{ mt: 3 }}
        >
          {t("retry") || "Retry"}
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;