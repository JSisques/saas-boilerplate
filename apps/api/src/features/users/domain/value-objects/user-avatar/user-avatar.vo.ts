import { UrlValueObject } from '@/shared/domain/value-objects/url.vo';

export class UserAvatarValueObject extends UrlValueObject {
  constructor(value: string) {
    super(value);
  }
}
