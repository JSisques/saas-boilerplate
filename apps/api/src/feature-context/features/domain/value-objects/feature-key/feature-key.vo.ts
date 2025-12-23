import { SlugValueObject } from '@/shared/domain/value-objects/slug/slug.vo';

/**
 * FeatureKeyValueObject represents a feature's unique key in the domain.
 * The key is used as a unique identifier for the feature (e.g., "advanced-analytics", "api-access").
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class FeatureKeyValueObject extends SlugValueObject {}
