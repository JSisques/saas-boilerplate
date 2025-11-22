import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

/**
 * Interface for base aggregate DTO.
 *
 * @interface IBaseAggregateDto
 * @property {DateValueObject} createdAt - The created at date value object.
 * @property {DateValueObject} updatedAt - The updated at date value object.
 */
export interface IBaseAggregateDto {
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}
