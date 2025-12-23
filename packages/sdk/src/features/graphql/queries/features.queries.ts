export const FEATURE_FIND_BY_CRITERIA_QUERY = `
  query FeaturesFindByCriteria($input: FeatureFindByCriteriaRequestDto) {
    featuresFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        key
        name
        description
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const FEATURE_FIND_BY_ID_QUERY = `
  query FeatureFindById($input: FeatureFindByIdRequestDto!) {
    featureFindById(input: $input) {
      id
      key
      name
      description
      status
      createdAt
      updatedAt
    }
  }
`;
