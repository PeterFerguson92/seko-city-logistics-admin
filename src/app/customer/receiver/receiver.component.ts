import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CUSTOMER_TYPES, COUNTRIES, COUNTRY_CODES, GH_DESTINATIONS } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css', '../../shared/shared.css']
})
export class ReceiverComponent implements OnInit, AfterViewInit {

  receiverCustomerForm: FormGroup;
  types = CUSTOMER_TYPES;
  countries = COUNTRIES;
  codes = COUNTRY_CODES;
  destinations = GH_DESTINATIONS;
  showOtherDestinations = false;
  formValidationMap = {fullName: '', phone: '', address: '',postcode: '',country: ''};

  constructor(private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private commonService: CommonService,
    private validationService: ValidationService,
    public alertService: AlertService) { }

  ngOnInit(): void {
    this.receiverCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      fullName: ['', [Validators.required]],
      phoneGroup: this.formBuilder.group({
        code: [this.codes[0], [Validators.required]],
        phone: ['', [Validators.required]],
      }, { validators: [Validators.required, this.validationService.phoneValidator] }),
      destination: [this.destinations[0], [Validators.required]],
      otherDestination: ['',  []],
    });
  }



  ngAfterViewInit(): void {
    this.validateFormControl('type');
    this.validateFormControl('fullName');
    this.validateFormControl('destination');
    this.validateFormControl('phone');
    this.validateGroupFormControl('phoneGroup', 'phone')
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    if (fControlName === 'destination' && event.value === 'OTHER')
    {
      this.showOtherDestinations = true;
      this.receiverCustomerForm.get('otherDestination').setValidators([Validators.required]);
      this.validateFormControl('otherDestination');
    } else
    {
      this.showOtherDestinations = false;
      this.receiverCustomerForm.get('otherDestination').setValidators([]);
      this.receiverCustomerForm.get('otherDestination').markAsPristine();
      this.receiverCustomerForm.get('otherDestination').setValue('');
    }
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onLoadPreviousReceivers() {
    console.log('something')
  }

  isOtherLocationDisabled() {
    return false;
  }

  getFormControl(fControlName: string) {
    return fControlName === 'phone' || fControlName === 'code' ? this.receiverCustomerForm.get('phoneGroup').get(fControlName) :
      this.receiverCustomerForm.get(fControlName)
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
        console.log(this.formValidationMap)
      });
  }

  validateGroupFormControl(formGroupName: string, fControlName: string) {
    const fGroup = this.receiverCustomerForm.get(formGroupName);
    const fMainControl = fGroup.get(fControlName);
    this.validationService.watchAndValidateFormControl(fGroup)
      .subscribe(() => {

        this.formValidationMap.phone = this.validationService.getGroupValidationMessage(fGroup, fMainControl, fControlName);
        if (fGroup.dirty && !fGroup.valid)
        {
          fMainControl.markAsDirty();
          fMainControl.setErrors({ phone: 'Phone number' });

        } else
        {
          fGroup.setErrors(null);
        }
      });
  }

  isDisabled() {
    return !this.receiverCustomerForm.valid;
  }
}
