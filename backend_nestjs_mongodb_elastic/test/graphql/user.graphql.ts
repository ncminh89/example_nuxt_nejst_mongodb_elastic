const userFragment = `
  fragment userFragment on User {
    id
    name
    username
    email
    role
    avatar
  }
  `;

export const createUserQuery =
  `
  mutation ($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        ...userFragment
      }
      token
    }
  }   
  ` + userFragment;

export const updateUserQuery =
  `
  mutation ($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...userFragment
    }
  }
  ` + userFragment;

export const deleteUserQuery =
  `
  mutation ($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      ...userFragment
    }
  }
  ` + userFragment;

export const loginQuery =
  `
  mutation ($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...userFragment
      }
    }
  }
` + userFragment;

export const searchUsersQuery =
  `
  query($input: SearchUsersInput!){
    searchUsers(input: $input) {
      ...userFragment
    }
  }
` + userFragment;
