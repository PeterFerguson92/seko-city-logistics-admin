import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { POSTCODE_REGEX } from 'src/app/constants';
import { isValidPhoneNumber } from 'libphonenumber-js'
import { CommonService } from '../common.service';

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
    email: 'Email address not valid.'
  };

  private postcodeValidationMessages = {
    required: 'Please enter postcode.',
    postcode: 'Postcode not valid.'
  };

  private phoneValidationMessages = {
    required: 'Please enter phone number.',
    telephone: 'Phone number not valid.'
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
    phone: this.phoneValidationMessages,
    email: this.emailValidationMessages,
    address: this.requiredValidationMessages,
    postcode: this.postcodeValidationMessages
  };

  constructor(private commonService: CommonService) { }

  specialCharactersValidator (control: FormControl): { [key: string]: boolean } | null {
    const nameRegexp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (control.value && !nameRegexp.test(control.value))
    {
      return { specialCharacters: true };
    }
    return null;
  };

  postCodeValidator (control: FormControl): { [key: string]: boolean } | null {
    const nameRegexp = POSTCODE_REGEX
    if (control.value && !nameRegexp.test(control.value))
    {
      return { postcode: true };
    }
    return null;
  };

  upperCaseCharactersValidator (control: FormControl): { [key: string]: boolean } | null {
    const noUpperCase = control.value === control.value.toLowerCase() && control.value !== control.value.toUpperCase();
    if(control.value && noUpperCase)
    {
      return { upperCase: true };
    }
    return null;
  };

 lowerCaseCharactersValidator(control: FormControl): { [key: string]: boolean } | null {
    const noLowerCase = control.value === control.value.toUpperCase() && control.value !== control.value.toLowerCase();
    if(control.value && noLowerCase)
    {
      return { lowerCase: true };
    }
    return null;
  };

  digitsCharactersValidator = (control: FormControl): { [key: string]: boolean } | null => {
    const nameRegexp =  /\d/;
    if (control.value && !nameRegexp.test(control.value))
    {
      return { digits: true };
    }
    return null;
  };

  phoneValidator = (formGroup: FormGroup): { [key: string]: boolean } | null => {
    const countryCode = formGroup.get('phoneCountryCode').value;
    const phoneNumber = formGroup.get('phone').value;
    console.log(phoneNumber)
    if (phoneNumber.length !== 0)
    {
      console.log(3939393939339)
      if (!isValidPhoneNumber(this.commonService.getFormattedPhoneNumber(countryCode, phoneNumber)))
      {
        return { telephone: true };
      }
      return null;
    } else
    {
      return null;
    }
  };

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
