import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  SAGA_STEP_CHANGE_STATUS_MUTATION,
  SAGA_STEP_CREATE_MUTATION,
  SAGA_STEP_DELETE_MUTATION,
  SAGA_STEP_UPDATE_MUTATION,
} from '../graphql/mutations/saga-step.mutations.js';
import {
  SAGA_STEP_FIND_BY_CRITERIA_QUERY,
  SAGA_STEP_FIND_BY_ID_QUERY,
  SAGA_STEP_FIND_BY_SAGA_INSTANCE_ID_QUERY,
} from '../graphql/queries/saga-step.queries.js';
import type {
  PaginatedSagaStepResult,
  SagaStepChangeStatusInput,
  SagaStepCreateInput,
  SagaStepDeleteInput,
  SagaStepFindByCriteriaInput,
  SagaStepFindByIdInput,
  SagaStepFindBySagaInstanceIdInput,
  SagaStepResponse,
  SagaStepUpdateInput,
} from '../index.js';

export class SagaStepClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: SagaStepFindByCriteriaInput,
  ): Promise<PaginatedSagaStepResult> {
    const result = await this.client.request<{
      sagaStepFindByCriteria: PaginatedSagaStepResult;
    }>({
      query: SAGA_STEP_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.sagaStepFindByCriteria;
  }

  async findById(input: SagaStepFindByIdInput): Promise<SagaStepResponse> {
    const result = await this.client.request<{
      sagaStepFindById: SagaStepResponse;
    }>({
      query: SAGA_STEP_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.sagaStepFindById;
  }

  async findBySagaInstanceId(
    input: SagaStepFindBySagaInstanceIdInput,
  ): Promise<SagaStepResponse[]> {
    const result = await this.client.request<{
      sagaStepFindBySagaInstanceId: SagaStepResponse[];
    }>({
      query: SAGA_STEP_FIND_BY_SAGA_INSTANCE_ID_QUERY,
      variables: { input },
    });

    return result.sagaStepFindBySagaInstanceId;
  }

  async create(input: SagaStepCreateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaStepCreate: MutationResponse;
    }>({
      query: SAGA_STEP_CREATE_MUTATION,
      variables: { input },
    });

    return result.sagaStepCreate;
  }

  async update(input: SagaStepUpdateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaStepUpdate: MutationResponse;
    }>({
      query: SAGA_STEP_UPDATE_MUTATION,
      variables: { input },
    });

    return result.sagaStepUpdate;
  }

  async changeStatus(
    input: SagaStepChangeStatusInput,
  ): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaStepChangeStatus: MutationResponse;
    }>({
      query: SAGA_STEP_CHANGE_STATUS_MUTATION,
      variables: { input },
    });

    return result.sagaStepChangeStatus;
  }

  async delete(input: SagaStepDeleteInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaStepDelete: MutationResponse;
    }>({
      query: SAGA_STEP_DELETE_MUTATION,
      variables: { input },
    });

    return result.sagaStepDelete;
  }
}
