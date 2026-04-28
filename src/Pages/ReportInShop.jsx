import { useParams } from "react-router-dom";
import ReportPage from "./Report";
import { Box } from "@mui/material";
 

const ReportInShop = () => {
  const savedStoreId = localStorage.getItem("activeShopId");

  return(
    <Box sx={{p: 2}}>
          <ReportPage shopId={savedStoreId} />
    </Box>
 
    ); 
};

export default ReportInShop;