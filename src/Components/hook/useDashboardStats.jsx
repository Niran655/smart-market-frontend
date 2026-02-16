import { useQuery } from "@apollo/client/react";
import { DASHBOARD_STATS } from "../../../graphql/queries";

const useDashboardStats = ({
  shopId = null,
  dayStart = null,
  dayEnd = null,
  filter = "today",
}) => {
  const { data, loading, error, refetch, networkStatus } = useQuery(
    DASHBOARD_STATS,
    {
      variables: { shopId, dayStart, dayEnd, filter },
      skip: !shopId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  console.log("variables:", { shopId, dayStart, dayEnd, filter });
  console.log("data:", data);

  return {
    stats: data?.dashboardStats || null,
    loading,
    error,
    refetch,
    isRefetching: networkStatus === 4,
  };
};

export default useDashboardStats;
