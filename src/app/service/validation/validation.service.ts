import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { POSTCODE_REGEX } from 'src/app/constants';

export const specialCharactersValidator = (control: FormControl): { [key: string]: boolean } | null => {
  const nameRegexp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (control.value && !nameRegexp.test(control.value))
  {
    return { specialCharacters: true };
  }
  return null;
};

export const postCodeValidator = (control: FormControl): { [key: string]: boolean } | null => {
  const nameRegexp = POSTCODE_REGEX
  if (control.value && !nameRegexp.test(control.value))
  {
    return { postcode: true };
  }
  return null;
};

export const upperCaseCharactersValidator = (control: FormControl): { [key: string]: boolean } | null => {
  const noUpperCase = control.value === control.value.toLowerCase() && control.value !== control.value.toUpperCase();
  if(control.value && noUpperCase)
  {
    return { upperCase: true };
  }
  return null;
};

export const lowerCaseCharactersValidator = (control: FormControl): { [key: string]: boolean } | null => {
  const noLowerCase = control.value === control.value.toUpperCase() && control.value !== control.value.toLowerCase();
  if(control.value && noLowerCase)
  {
    return { lowerCase: true };
  }
  return null;
};

export const digitsCharactersValidator = (control: FormControl): { [key: string]: boolean } | null => {
  const nameRegexp =  /\d/;
  if (control.value && !nameRegexp.test(control.value))
  {
    return { digits: true };
  }
  return null;
};


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private usernameValidationMessages = {
    required: 'Please enter your username.',
  };

  private requiredValidationMessages = {
    required: 'Please enter a value.',
  };

  private emailValidationMessages = {
    required: 'Please enter email address.',
    email: 'Please enter a valid email address.'
  };

  private postcodeValidationMessages = {
    required: 'Please enter postcode.',
    postcode: 'Please enter a valid postcode.'
  };

  private passwordValidationMessages = {
    required: 'Please enter your password.',
    minlength: 'The password must be of minimum length 8 characters.',
    specialCharacters: 'Password must contain special characters.',
    upperCase: 'Password must contain upper case characters.',
    lowerCase: 'Password must contain lower case characters.',
    digits: 'Password must contain at least one digit (0-9).'
  };

  private formMap = {
    usernameInput: this.usernameValidationMessages,
    emailInput: this.emailValidationMessages,
    passwordInput: this.passwordValidationMessages,
    fullName: this.requiredValidationMessages,
    phone: this.requiredValidationMessages,
    email: this.emailValidationMessages,
    address: this.requiredValidationMessages,
    postcode: this.postcodeValidationMessages
  };

  constructor() { }

  watchAndValidateFormControl(fControl: AbstractControl) {
    return fControl.valueChanges.pipe(debounceTime(1000));
  }

  setMessage(fControl: AbstractControl, fControlName: string): string | null {
    const validationMessages = this.formMap[fControlName];
    if ((fControl.touched || fControl.dirty) && fControl.errors)
    {
      return Object.keys(fControl.errors).map(
        key => validationMessages[key])[0];
    }
    return null;
  }
}
