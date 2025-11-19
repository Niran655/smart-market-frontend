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

export const GET_USER_WITH_PAGINATION = gql`
query GetUsersWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getUsersWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
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