import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { emailWhiteList } from 'auth/constants/whiteList';

export function IsInMailWitheList(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'MailWhiteList' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value) {
      const emailParts = value.split('@');
      const domain = emailParts[emailParts.length - 1];
      return emailWhiteList.includes(domain);
    }
    return true;
  }
}
