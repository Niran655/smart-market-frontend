import { useQuery } from "@apollo/client/react";
import { GET_PRDUCT_WAREHOUSE_WITH_PAGINATION } from "../../../graphql/queries";
const useGetProductWarehouse = ({
    page = 1,
    limit = 10,
    pagination = true,
    keyword = "",
} = {}) => {
    const { data, loading, error, refetch } = useQuery(
        GET_PRDUCT_WAREHOUSE_WITH_PAGINATION,
        {
            variables: { page, limit, pagination, keyword },
            fetchPolicy: "cache-and-network",
        }
    );

    const products = data?.getProductWareHouseWithPagination?.data || [];
    const paginator = data?.getProductWareHouseWithPagination?.paginator || {};

    return {
        products,
        paginator,
        loading,
        error,
        refetch,
    };
};

export default useGetProductWarehouse;