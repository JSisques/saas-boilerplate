import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  SAGA_INSTANCE_CHANGE_STATUS_MUTATION,
  SAGA_INSTANCE_CREATE_MUTATION,
  SAGA_INSTANCE_DELETE_MUTATION,
  SAGA_INSTANCE_UPDATE_MUTATION,
} from '../graphql/mutations/saga-instance.mutations.js';
import {
  SAGA_INSTANCE_FIND_BY_CRITERIA_QUERY,
  SAGA_INSTANCE_FIND_BY_ID_QUERY,
} from '../graphql/queries/saga-instance.queries.js';
import type {
  PaginatedSagaInstanceResult,
  SagaInstanceChangeStatusInput,
  SagaInstanceCreateInput,
  SagaInstanceDeleteInput,
  SagaInstanceFindByCriteriaInput,
  SagaInstanceFindByIdInput,
  SagaInstanceResponse,
  SagaInstanceUpdateInput,
} from '../index.js';

export class SagaInstanceClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: SagaInstanceFindByCriteriaInput,
  ): Promise<PaginatedSagaInstanceResult> {
    const result = await this.client.request<{
      sagaInstanceFindByCriteria: PaginatedSagaInstanceResult;
    }>({
      query: SAGA_INSTANCE_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.sagaInstanceFindByCriteria;
  }

  async findById(
    input: SagaInstanceFindByIdInput,
  ): Promise<SagaInstanceResponse> {
    const result = await this.client.request<{
      sagaInstanceFindById: SagaInstanceResponse;
    }>({
      query: SAGA_INSTANCE_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.sagaInstanceFindById;
  }

  async create(input: SagaInstanceCreateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaInstanceCreate: MutationResponse;
    }>({
      query: SAGA_INSTANCE_CREATE_MUTATION,
      variables: { input },
    });

    return result.sagaInstanceCreate;
  }

  async update(input: SagaInstanceUpdateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaInstanceUpdate: MutationResponse;
    }>({
      query: SAGA_INSTANCE_UPDATE_MUTATION,
      variables: { input },
    });

    return result.sagaInstanceUpdate;
  }

  async changeStatus(
    input: SagaInstanceChangeStatusInput,
  ): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaInstanceChangeStatus: MutationResponse;
    }>({
      query: SAGA_INSTANCE_CHANGE_STATUS_MUTATION,
      variables: { input },
    });

    return result.sagaInstanceChangeStatus;
  }

  async delete(input: SagaInstanceDeleteInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaInstanceDelete: MutationResponse;
    }>({
      query: SAGA_INSTANCE_DELETE_MUTATION,
      variables: { input },
    });

    return result.sagaInstanceDelete;
  }
}
