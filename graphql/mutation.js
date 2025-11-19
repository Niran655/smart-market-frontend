import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
      role
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