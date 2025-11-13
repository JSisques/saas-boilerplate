import { Criteria } from '@/shared/domain/entities/criteria';
import { IStorageFindByCriteriaQueryDto } from '@/storage-context/storage/application/dtos/queries/storage-find-by-criteria/storage-find-by-criteria-query.dto';

/**
 * Query class for finding storage by criteria.
 *
 * @class StorageFindByCriteriaQuery
 * @param props - The properties for the query.
 * @property {Criteria} criteria - The criteria to find the storage by.
 */
export class StorageFindByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: IStorageFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
