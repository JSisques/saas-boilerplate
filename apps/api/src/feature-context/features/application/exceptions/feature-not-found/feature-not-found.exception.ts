import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class FeatureNotFoundException extends BaseApplicationException {
  constructor(featureId: string) {
    super(`Feature with id ${featureId} not found`);
  }
}
