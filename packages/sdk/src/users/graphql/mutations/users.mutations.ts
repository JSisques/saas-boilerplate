export const USER_CREATE_MUTATION = `
  mutation CreateUser($input: CreateUserRequestDto!) {
    createUser(input: $input) {
          success
          message
          id
        }
      }
    `;

export const USER_UPDATE_MUTATION = `
  mutation UpdateUser($input: UpdateUserRequestDto!) {
    updateUser(input: $input) {
          success
          message
          id
        }
      }
    `;

export const USER_DELETE_MUTATION = `
  mutation DeleteUser($input: DeleteUserRequestDto!) {
    deleteUser(input: $input) {
          success
          message
          id
        }
      }
    `;
