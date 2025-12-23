export const FEATURE_CREATE_MUTATION = `
  mutation CreateFeature($input: CreateFeatureRequestDto!) {
    createFeature(input: $input) {
      success
      message
      id
    }
  }
`;

export const FEATURE_UPDATE_MUTATION = `
  mutation UpdateFeature($input: UpdateFeatureRequestDto!) {
    updateFeature(input: $input) {
      success
      message
      id
    }
  }
`;

export const FEATURE_DELETE_MUTATION = `
  mutation DeleteFeature($input: DeleteFeatureRequestDto!) {
    deleteFeature(input: $input) {
      success
      message
      id
    }
  }
`;

export const FEATURE_CHANGE_STATUS_MUTATION = `
  mutation ChangeFeatureStatus($input: FeatureChangeStatusRequestDto!) {
    changeFeatureStatus(input: $input) {
      success
      message
      id
    }
  }
`;
