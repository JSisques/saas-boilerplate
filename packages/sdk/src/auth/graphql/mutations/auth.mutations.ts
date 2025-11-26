export const AUTH_LOGIN_BY_EMAIL_MUTATION = `
  mutation LoginByEmail($input: AuthLoginByEmailRequestDto!) {
    loginByEmail(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const AUTH_REGISTER_BY_EMAIL_MUTATION = `
  mutation RegisterByEmail($input: AuthRegisterByEmailRequestDto!) {
    registerByEmail(input: $input) {
      success
      message
      id
    }
  }
`;

export const AUTH_LOGOUT_MUTATION = `
  mutation Logout($input: UpdateUserRequestDto!) {
    logout(input: $input) {
      success
      message
      id
    }
  }
`;

