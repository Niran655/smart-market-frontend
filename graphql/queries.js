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
export  const GET_PROFIEL_BY_ID = gql`
query GetProfileById($id: ID) {
  getProfileById(_id: $id) {
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
          image
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

export const GET_SUPPRODUCT_BY_ID = gql`
query GetSubProductById($subProductId: ID!) {
  getSubProductById(subProductId: $subProductId) {
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
          image
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
    barCode
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
        costPrice
        unitId {
          nameEn
          nameKh
        }
        parentProductId {
          _id
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
      parentProductId {
          nameKh
          nameEn
        }
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

export const GET_PRODUCTS_WAREHOUSE_TRANSFER_WITH_PAGINATION = gql`
query GetWarehouseTransfersWithPagination($status: TransferStatus, $shopId: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getWarehouseTransfersWithPagination(status: $status, shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
       _id
    toShop {
      nameKh
      nameEn
    }
    items {
      quantity
      subProduct {
        _id
        saleType
        qty
        barCode
        productDes
        productImg
        using
        check
        sell
        servicePrice
        salePrice
        taxRate
        costPrice
        priceImg
        totalPrice
        priceDes
        createdAt
        updatedAt
        stock
        minStock
        parentProductId {
          nameEn
          nameKh
          _id
        }
        unitId {
          _id
          nameEn
          nameKh
        }
      }
      remainingQty
      receivedQty
    }
    status
    requestedBy {
      nameEn
      nameKh
    }
    acceptedBy {
      _id
      image
      nameEn
      nameKh
      email
      gender
      phone
      active
      role
      createdAt
      updatedAt
    }
    remark
    createdAt
    acceptedAt
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
export const GET_WAREHOUSE_TRANSFER_BY_ID = gql`
query GetWarehouseTransferById($id: ID!) {
  getWarehouseTransferById(_id: $id) {
     _id
    toShop {
      nameKh
      nameEn
    }
    items {
      quantity
      subProduct {
        _id
        saleType
        qty
        barCode
        productDes
        productImg
        using
        check
        sell
        servicePrice
        salePrice
        taxRate
        costPrice
        priceImg
        totalPrice
        priceDes
        createdAt
        updatedAt
        stock
        minStock
      }
    }
    status
    requestedBy {
      nameEn
      nameKh
    }
    acceptedBy {
      _id
      image
      nameEn
      nameKh
      email
      gender
      phone
      active
      role
      createdAt
      updatedAt
    }
    remark
    createdAt
    acceptedAt
  }
}
`

export const GET_SALES = gql`
  query GetSales(
    $shopId: ID
    $status: SaleStatus
    $page: Int
    $limit: Int
    $pagination: Boolean
    $startDate: Date
    $endDate: Date
  ) {
    getSales(
      shopId: $shopId
      status: $status
      page: $page
      limit: $limit
      pagination: $pagination
      startDate: $startDate
      endDate: $endDate
    ) {
      data {
        _id
        saleNumber
        user {
          _id
          nameEn
          nameKh
        }
        shopId
        items {
          product {
            _id
            nameEn
            nameKh
            image
          }
          subProductId 
          # {
          #   _id
          #   productImg
          # }
          name
          price
          quantity
          total
        }
        subtotal
        tax
        discount
        total
        paymentMethod
        amountPaid
        change
        status
        createdAt
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
`;

export const DASHBOARD_STATS = gql`
query DashboardStats($filter: String, $shopId: ID, $dayStart: Date, $dayEnd: Date) {
  dashboardStats(filter: $filter, shopId: $shopId, dayStart: $dayStart, dayEnd: $dayEnd) {
    totalOrders
    totalSales
    averageValue
    reservations
    weeklyRevenue
    topSellingItems {
      rank
      orders
      name
    }
    activeOrders {
      name
      type
      table
    }
    categoryStats {
      orders
      category
    }
        dailyRevenue
  }
}`

export const GET_REPORT_STATS = gql`
query GetReportStats($type: ReportType, $shopId: ID, $endDate: Date, $startDate: Date) {
  getReportStats(type: $type, shopId: $shopId, endDate: $endDate, startDate: $startDate) {
    staff {
      totalStaff
      activeStaff
      totalHours
      totalSales
      salesPerStaff
      performance {
        id
        nameKh
        nameEn
        role
        hours
        sales
        orders
      }
    }
    sales {
      totalRevenue
      totalOrders
      averageOrderValue
      topProducts {
        id
        name
        category
        sales
        revenue
      }
      recentTransactions {
        id
        date
        customer
        type
        amount
        status
      }
    }
    inventory {
      totalItems
      lowStockCount
      totalValue
      items {
        id
        name
        category
        stock
        unit
        reorderLevel
        value
      }
    }
  }
}`

export const GET_SUPPLIERS_WITH_PAGINATION = gql`
query GetSuppliersWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getSuppliersWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      _id
      nameKh
      nameEn
      remark
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
}`

export const GET_PURCHASE_ORDER_WITH_PAGINATION = gql`
query GetPurchaseOrdersWithPagination($supplierId: ID, $status: PurchaseOrderStatus, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getPurchaseOrdersWithPagination(supplierId: $supplierId, status: $status, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      _id
      supplier {
        _id
        nameKh
        nameEn
        remark
        createdAt
        updatedAt
      }
      items {
         
        subProduct {
            _id
          parentProductId {
            nameKh
            nameEn
          }
        }
        quantity
        costPrice
        totalPrice
        receivedQty
        remainingQty
      }
      totalAmount
      status
      remark
      createdBy {
        nameKh
        nameEn
      }
      receivedBy {
        nameKh
        nameEn
      }
      createdAt
      receivedAt
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
}`



export const GET_SHIFT_SESSIONS = gql`
query GetShiftSessions($shopId: ID) {
  getShiftSessions(shopId: $shopId) {
    _id
    user {
      _id
      email
      nameEn
      nameKh
    }
    shop {
      nameEn
      nameKh
      _id
    }
    shiftName
    startTime
    endTime
    openingCash
    closingCash
    totalSales
    totalOrders
    status
    createdAt
    closedAt
  }
}
`
export const GET_CURRENT_SHIFT = gql`
query GetCurrentShift($userId: ID) {
  getCurrentShift(userId: $userId) {
    _id
    user {
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
    
    shiftName
    startTime
    endTime
    openingCash
    closingCash
    totalSales
    totalOrders
    status
    createdAt
    closedAt
  }
}
`

export const GET_OPEN_SHIFT = gql`
query GetOpenShift($shopId: ID!, $userId: ID) {
  getOpenShift(shopId: $shopId, userId: $userId) {
    status
    startTime
    openingCash
    user {
      _id
      nameEn
      nameKh
    }
  }
}
`

export const GET_STOCK_MOVMENT_WITH_PAGINATION = gql`
query GetStockMovementWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $shopId: ID) {
  getStockMovementWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, shopId: $shopId) {
    data {
      type
      quantity
      reason
      reference
      previousStock
      newStock
      createdAt
      user {
        nameKh
        nameEn
      }
      product {
        nameKh
        nameEn
      }
      subProduct {
        unitId {
          nameKh
          nameEn
        }
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