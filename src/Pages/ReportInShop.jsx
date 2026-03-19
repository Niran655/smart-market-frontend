import { useParams } from "react-router-dom";
import ReportPage from "./Report";
 

const ReportInshopPage = () => {
  const savedStoreId = localStorage.getItem("activeShopId");

  return <ReportPage shopId={savedStoreId} />; 
};

export default ReportInshopPage;