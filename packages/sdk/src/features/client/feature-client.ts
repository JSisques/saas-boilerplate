import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  FEATURE_CHANGE_STATUS_MUTATION,
  FEATURE_CREATE_MUTATION,
  FEATURE_DELETE_MUTATION,
  FEATURE_UPDATE_MUTATION,
} from '../graphql/mutations/features.mutations.js';
import {
  FEATURE_FIND_BY_CRITERIA_QUERY,
  FEATURE_FIND_BY_ID_QUERY,
} from '../graphql/queries/features.queries.js';
import type {
  CreateFeatureInput,
  DeleteFeatureInput,
  FeatureChangeStatusInput,
  FeatureFindByCriteriaInput,
  FeatureFindByIdInput,
  PaginatedFeatureResult,
  UpdateFeatureInput,
  FeatureResponse,
} from '../index.js';

export class FeatureClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: FeatureFindByCriteriaInput,
  ): Promise<PaginatedFeatureResult> {
    const result = await this.client.request<{
      featuresFindByCriteria: PaginatedFeatureResult;
    }>({
      query: FEATURE_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.featuresFindByCriteria;
  }

  async findById(input: FeatureFindByIdInput): Promise<FeatureResponse> {
    const result = await this.client.request<{
      featureFindById: FeatureResponse;
    }>({
      query: FEATURE_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.featureFindById;
  }

  async create(input: CreateFeatureInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      createFeature: MutationResponse;
    }>({
      query: FEATURE_CREATE_MUTATION,
      variables: { input },
    });

    return result.createFeature;
  }

  async update(input: UpdateFeatureInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      updateFeature: MutationResponse;
    }>({
      query: FEATURE_UPDATE_MUTATION,
      variables: { input },
    });

    return result.updateFeature;
  }

  async delete(input: DeleteFeatureInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      deleteFeature: MutationResponse;
    }>({
      query: FEATURE_DELETE_MUTATION,
      variables: { input },
    });

    return result.deleteFeature;
  }

  async changeStatus(
    input: FeatureChangeStatusInput,
  ): Promise<MutationResponse> {
    const result = await this.client.request<{
      changeFeatureStatus: MutationResponse;
    }>({
      query: FEATURE_CHANGE_STATUS_MUTATION,
      variables: { input },
    });

    return result.changeFeatureStatus;
  }
}
