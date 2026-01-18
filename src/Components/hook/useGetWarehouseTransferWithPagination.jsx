import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";

import { GET_PRODUCTS_WAREHOUSE_TRANSFER_WITH_PAGINATION } from "../../../graphql/queries";

const useGetWarehouseTransferWithPagination = ({
  page = 1,
  limit = 10,
  pagination = true,
  keyword = "",
} = {}) => {
  const { data, loading, error, refetch } = useQuery(
    GET_PRODUCTS_WAREHOUSE_TRANSFER_WITH_PAGINATION,
    {
      variables: { page, limit, pagination, keyword },
      fetchPolicy: "cache-and-network",
    },
  );

  const [productsWarehouseTransfer, setProductsWarehouseTransfer] = useState(
    [],
  );
  const [paginator, setPaginator] = useState({});

  useEffect(() => {
    if (data?.getWarehouseTransfersWithPagination) {
      setProductsWarehouseTransfer(
        data.getWarehouseTransfersWithPagination.data || [],
      );
      setPaginator(data.getWarehouseTransfersWithPagination.paginator || {});
    }
  }, [data]);

  return {
    productsWarehouseTransfer,
    paginator,
    loading,
    error,
    refetch,
  };
};

export default useGetWarehouseTransferWithPagination;
