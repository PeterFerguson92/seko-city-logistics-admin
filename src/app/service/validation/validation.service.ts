import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

export const specialCharactersValidator = (control: FormControl): { [key: string]: boolean } | null => {
  const nameRegexp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (control.value && !nameRegexp.test(control.value))
  {
    return { specialCharacters: true };
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

  private emailValidationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
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
    passwordInput: this.passwordValidationMessages
  };

  constructor() { }

  watchAndValidateFormControl(fControl: AbstractControl) {
    return fControl.valueChanges.pipe(debounceTime(1000));
  }

  setMessage(fControl: AbstractControl, fControlName: string): string | null {
    const validationMessages = this.formMap[fControlName];
    if ((fControl.touched || fControl.dirty) && fControl.errors)
    {
      console.log(Object.keys(fControl.errors).map(
        key => validationMessages[key]));
      return Object.keys(fControl.errors).map(
        key => validationMessages[key])[0];
    }
    return null;
  }
}
