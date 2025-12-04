import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  SAGA_LOG_CREATE_MUTATION,
  SAGA_LOG_DELETE_MUTATION,
  SAGA_LOG_UPDATE_MUTATION,
} from '../graphql/mutations/saga-log.mutations.js';
import {
  SAGA_LOG_FIND_BY_CRITERIA_QUERY,
  SAGA_LOG_FIND_BY_ID_QUERY,
  SAGA_LOG_FIND_BY_SAGA_INSTANCE_ID_QUERY,
  SAGA_LOG_FIND_BY_SAGA_STEP_ID_QUERY,
} from '../graphql/queries/saga-log.queries.js';
import type {
  PaginatedSagaLogResult,
  SagaLogCreateInput,
  SagaLogDeleteInput,
  SagaLogFindByCriteriaInput,
  SagaLogFindByIdInput,
  SagaLogFindBySagaInstanceIdInput,
  SagaLogFindBySagaStepIdInput,
  SagaLogResponse,
  SagaLogUpdateInput,
} from '../index.js';

export class SagaLogClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: SagaLogFindByCriteriaInput,
  ): Promise<PaginatedSagaLogResult> {
    const result = await this.client.request<{
      sagaLogFindByCriteria: PaginatedSagaLogResult;
    }>({
      query: SAGA_LOG_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.sagaLogFindByCriteria;
  }

  async findById(input: SagaLogFindByIdInput): Promise<SagaLogResponse> {
    const result = await this.client.request<{
      sagaLogFindById: SagaLogResponse;
    }>({
      query: SAGA_LOG_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.sagaLogFindById;
  }

  async findBySagaInstanceId(
    input: SagaLogFindBySagaInstanceIdInput,
  ): Promise<SagaLogResponse[]> {
    const result = await this.client.request<{
      sagaLogFindBySagaInstanceId: SagaLogResponse[];
    }>({
      query: SAGA_LOG_FIND_BY_SAGA_INSTANCE_ID_QUERY,
      variables: { input },
    });

    return result.sagaLogFindBySagaInstanceId;
  }

  async findBySagaStepId(
    input: SagaLogFindBySagaStepIdInput,
  ): Promise<SagaLogResponse[]> {
    const result = await this.client.request<{
      sagaLogFindBySagaStepId: SagaLogResponse[];
    }>({
      query: SAGA_LOG_FIND_BY_SAGA_STEP_ID_QUERY,
      variables: { input },
    });

    return result.sagaLogFindBySagaStepId;
  }

  async create(input: SagaLogCreateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaLogCreate: MutationResponse;
    }>({
      query: SAGA_LOG_CREATE_MUTATION,
      variables: { input },
    });

    return result.sagaLogCreate;
  }

  async update(input: SagaLogUpdateInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaLogUpdate: MutationResponse;
    }>({
      query: SAGA_LOG_UPDATE_MUTATION,
      variables: { input },
    });

    return result.sagaLogUpdate;
  }

  async delete(input: SagaLogDeleteInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      sagaLogDelete: MutationResponse;
    }>({
      query: SAGA_LOG_DELETE_MUTATION,
      variables: { input },
    });

    return result.sagaLogDelete;
  }
}
