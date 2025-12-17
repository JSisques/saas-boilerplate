import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class FeatureKeyIsNotUniqueException extends BaseApplicationException {
  constructor(featureKey: string) {
    super(`Feature with key ${featureKey} already exists`);
  }
}
