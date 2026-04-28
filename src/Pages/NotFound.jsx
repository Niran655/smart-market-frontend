import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";

import ImageNotFound from "../assets/Image/not-found.png";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

export default function NotFound() {
  const navigate = useNavigate();
  const {language} =  useAuth();
  const {t} = translateLauguage(language)
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "70vh" }}
      spacing={3}
    >
      <img
        src={ImageNotFound}
        alt="Not Found"
        style={{
          width: "500px",
          maxWidth: "100%",
          height: "auto",
          display: "block",
        }}
      />
      <Button variant="contained" color="primary"  onClick={() => navigate(-1)}>
       {t(`go_back`)}
      </Button>
    </Stack>
  );
}
