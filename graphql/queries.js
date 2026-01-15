import { gql } from "@apollo/client";

export const GET_UNIT_WHITH_PAGINATION = gql`
query GetUnitWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getUnitWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      nameKh
      nameEn
      remark
      active
      createdAt
      updatedAt
      _id
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`
export const GET_UNIT = gql`
query GetUnit {
  getUnit {
    _id
    nameKh
    nameEn
    remark
    active
    createdAt
    updatedAt
  }
}
`

export const GET_USER_WITH_PAGINATION = gql`
query GetUsersWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $role: String) {
  getUsersWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, role: $role) {
    data {
      _id
      image
      nameEn
      nameKh
      email
      gender
      phone
      password
      active
      role
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`
export const GET_CATEGORY_WHITH_PAGINATION = gql`
query GetCategoryWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getCategoryWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      _id
      nameKh
      nameEn
      remark
      active
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`
export const GET_CATEGORY = gql`
query GetCategory {
  getCategory {
    _id
    image
    nameKh
    nameEn
    remark
    active
    createdAt
    updatedAt
  }
}
`
export const GET_ALL_SHOP = gql`
query GetAllShops($id: ID!) {
  getAllShops(_id: $id) {
    _id
    code
    image
    nameEn
    nameKh
    type
    remark
    address
    active
    createdAt
    updatedAt
    platform {
      id
      platform
      name
      url
    }
    user {
      nameEn
      nameKh
    }
  }
}
`
export const GET_SHOP_BY_SHOP_ID = gql`
query GetShopByShopId($shopId: ID!, $id: ID) {
  getShopByShopId(shopId: $shopId, _id: $id) {
    _id
    code
    image
    nameEn
    nameKh
    type
    remark
    address
    active
    createdAt
    updatedAt
    platform {
      id
      platform
      name
      url
    }
    user {
      _id
      role
      nameEn
      nameKh
    }
  }
}
`

export const GET_PRODUCT_WITH_PAGINATION = gql`
query GetProductsWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getProductsWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      nameKh
      nameEn
      image
      unitId {
        nameKh
        nameEn
        _id
      }
      categoryId {
        nameEn
        nameKh
        _id
      }
      remark
      _id
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`

export const GET_SUP_PRODUCT = gql`
query GetSubProducts($parentProductId: ID!) {
  getSubProducts(parentProductId: $parentProductId) {
    _id
    priceDes
    priceImg
    productDes
    productImg
    qty
    salePrice
    saleType
    sell
    servicePrice
    taxRate
    totalPrice
    updatedAt
    using 
    stock
    minStock
    shopId {
      _id
      nameEn
      nameKh
    }
    unitId {
      _id
      nameEn
      nameKh
    }
    check
    barCode
    costPrice
    createdAt
  }
}
`
export const GET_PRODUCT_FOR_SALE_WITH_PAGINATION = gql`
query GetProductForSaleWithPagination($shopId: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $categoryId: String) {
  getProductForSaleWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, categoryId: $categoryId) {
    data {
      _id
      qty
      stock
      parentProductId {
        _id
        nameKh
        nameEn
        categoryId {
          nameEn
          nameKh
          _id
        }
      }
      unitId {
        _id
        nameKh
        nameEn
      }
      productImg
      taxRate
      salePrice
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`

export const GET_PRDUCT_WAREHOUSE_WITH_PAGINATION = gql`
query GetProductWareHouseWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getProductWareHouseWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
   data {
    _id
      stock
      subProduct {
        _id
        qty
        unitId {
          nameEn
          nameKh
        }
        parentProductId {
          nameKh
          nameEn
        }
        productImg
        minStock
        _id
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }  
  }
}
`

export const GET_PRODUCT_WAREHOUSE_IN_SHOP_WITH_PAGINATION = gql`
query GetProductWareHouseInShopoWithPagination($shopId: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getProductWareHouseInShopoWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      minStock
      createdAt
      updatedAt
      stock
      subProduct {
        _id
    priceDes
    priceImg
    productDes
    productImg
    qty
    salePrice
    saleType
    sell
    servicePrice
    taxRate
    totalPrice
    updatedAt
    using 
    stock
    minStock
     
    unitId {
      _id
      nameEn
      nameKh
    }
    check
    barCode
    costPrice
    createdAt
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`