import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { COUNTRIES, COUNTRY_CODES } from 'src/app/constants';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
  selector: 'app-add-edit-driver',
  templateUrl: './add-edit-driver.component.html',
  styleUrls: ['./add-edit-driver.component.css','../../shared/shared-new-form.css']
})
export class AddEditDriverComponent implements OnInit {
  addEditDriverForm: FormGroup;
  countries = COUNTRIES;
  countryCodes = COUNTRY_CODES;
  driver;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService,
    private validationService: ValidationService, private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      let phoneNumberData = null;
      this.driver = data.driver.getDriver.users[0];
      if (this.driver)
      {
        phoneNumberData = this.splitPhoneNumber(this.driver.phoneNumber)
      }
      this.addEditDriverForm = this.formBuilder.group({
        name: [this.driver ? this.driver.name : '', [Validators.required]],
        surname: [this.driver ? this.driver.lastName : '', [Validators.required]],
        username: [this.driver ? this.driver.username : '', [Validators.required]],
        email: [this.driver ? this.driver.email : '', [Validators.required]],
        phoneGroup: this.formBuilder.group({
          countryCode: [this.driver && phoneNumberData ? phoneNumberData.countryCode : this.countryCodes[0], [Validators.required]],
          phone: [this.driver && phoneNumberData ? phoneNumberData.number : '', [Validators.required]],
        }, { validators: [Validators.required, this.validationService.phoneValidator] }),
        country: [this.driver ? this.driver.country : this.countries[0], [Validators.required]]
      })
    })
  }

  getFormControl(fControlName: string) {
    return fControlName === 'phone' || fControlName === 'countryCode' ? this.addEditDriverForm.get('phoneGroup').get(fControlName) :
    this.addEditDriverForm.get(fControlName)
  }

  onSelectionChange(event: any, formControlName) {
    const fControl = this.getFormControl(formControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onSubmit() {
    const driverDetails = { password: null, role: 'DRIVER', phone: this.getPhoneNumber() };

    Object.keys(this.addEditDriverForm.controls).forEach(key => {
      const formControl = this.addEditDriverForm.controls[key];
      if (!(key === 'phoneGroup'))
      {
        driverDetails[key] = formControl.value;
      }
    });

    this.authService.signUp(driverDetails).subscribe(
      ({ data }) => { console.log(data); },
      error => { console.log(error); }
    );
  }

  getPhoneNumber() {
    return this.getFormControl('countryCode').value + this.getFormControl('phone').value;
  }

  splitPhoneNumber(phoneNumber) {
    return {countryCode: phoneNumber.substring(0, 3), number: phoneNumber.substring(3, phoneNumber.length) }
  }

  isDisabled() {
    return false;
  }

}
