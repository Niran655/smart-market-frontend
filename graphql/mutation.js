import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
      role
      image
      active
      createdAt
      updatedAt
      nameKh
      nameEn
    }
  }
}
`

export const CREATE_USER = gql`
mutation CreateUser($input: RegisterInput) {
  createUser(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_USER = gql`
mutation UpdateUser($id: ID!, $input: RegisterInput) {
  updateUser(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_USER_STATUS = gql`
mutation UpdateUserStatus($id: ID!, $active: Boolean!) {
  updateUserStatus(_id: $id, active: $active) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_USER = gql`
mutation DeleteUser($id: ID!) {
  deleteUser(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`


export const CREATE_UNIT = gql`
mutation CreateUnit($input: UnitInput) {
  createUnit(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_UNIT = gql`
mutation UpdateUnit($id: ID!, $input: UnitInput) {
  updateUnit(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_UNIT = gql`
mutation DeleteUnit($id: ID!) {
  deleteUnit(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
` 

export const UPDATE_UNIT_STATUS = gql`
mutation UpdateUnitStatus($id: ID!, $active: Boolean!) {
  updateUnitStatus(_id: $id, active: $active) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_CATEGORY = gql`
mutation CreateCategory($input: CategoryInput) {
  createCategory(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_CATEGORY = gql`
mutation UpdateCategory($id: ID!, $input: CategoryInput) {
  updateCategory(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_CATEGORY = gql`
mutation DeleteCategory($id: ID!) {
  deleteCategory(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_CATEGORY_STATUS = gql`
mutation UpdateCategoryStatus($id: ID!, $active: Boolean!) {
  updateCategoryStatus(_id: $id, active: $active) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_SHOP = gql`
mutation CreateShop($input: ShopInput) {
  createShop(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_SHOP = gql`
mutation UpdateShop($id: ID!, $input: ShopInput) {
  updateShop(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const ADD_USER_CONTROLL_SHOP = gql`
mutation AddUserControllShop($id: ID!, $userId: [ID]!) {
  addUserControllShop(_id: $id, userId: $userId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_USER_FROM_SHOP = gql`
mutation DeleteUserFromShop($userId: [ID]!, $id: ID) {
  deleteUserFromShop(userId: $userId, _id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_SHOP = gql`
mutation DeleteShop($id: ID!) {
  deleteShop(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_PRODUCT = gql`
mutation CreateProduct($input: ProductInput) {
  createProduct(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_PRODUCT = gql`
mutation UpdateProduct($id: ID!, $input: ProductInput) {
  updateProduct(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_PRODUCT = gql`
mutation DeleteProduct($id: ID!) {
  deleteProduct(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_SUB_PRODUCT = gql`
mutation CreateSubProduct($parentProductId: ID!, $input: SubProductInput) {
  createSubProduct(parentProductId: $parentProductId, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_SUB_PRODUCT = gql`
mutation UpdateSubProduct($id: ID, $input: SubProductInput) {
  updateSubProduct(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_SUP_PRODUCT = gql`
mutation DeleteSubProduct($id: ID!) {
  deleteSubProduct(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const CREATE_SALE = gql`
mutation CreateSale($input: SaleInput) {
  createSale(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const ADJUST_STOCK = gql`
mutation AdjustStock($input: AdjustStockInput!) {
  adjustStock(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const CREATE_WAREHOUSE_TRANSFER = gql`
mutation CreateWarehouseTransfer($input: CreateWarehouseTransferInput!) {
  createWarehouseTransfer(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`