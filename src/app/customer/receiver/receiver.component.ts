import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CUSTOMER_TYPES, COUNTRIES, COUNTRY_CODES, GH_DESTINATIONS, CUSTOMER_TITLES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css', '../../shared/shared.css']
})
export class ReceiverComponent implements OnInit, AfterViewInit {

  receiverCustomerForm: FormGroup;
  types = CUSTOMER_TYPES;
  titles = CUSTOMER_TITLES;
  countries = COUNTRIES;
  codes = COUNTRY_CODES;
  destinations = GH_DESTINATIONS;
  showOtherDestinations = false;
  formValidationMap = { name: '', surname: '', registeredName: '', phone: '', location: '' };

  constructor(private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.receiverCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      registeredName: [''],
      registeredNumber: [''],
      title: [this.titles[0], [Validators.required]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneGroup: this.formBuilder.group({
        countryCode: [this.codes[0], [Validators.required]],
        phone: ['', [Validators.required]],
      }, { validators: [Validators.required, this.validationService.phoneValidator] }),
      destination: [this.destinations[0], [Validators.required]],
      location: ['', []],
    });
  }

  ngAfterViewInit(): void {
    this.validateFormControl('registeredName');
    this.validateFormControl('name');
    this.validateFormControl('surname');
    this.validateFormControl('destination');
    this.validateFormControl('location');
    this.validateGroupFormControl('phoneGroup', 'phone')
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
    const locationFormControl = this.receiverCustomerForm.get('location');
    if (fControlName === 'destination' && event.value === 'OTHER')
    {
      locationFormControl.setValidators([Validators.required]);
    } else
    {
      locationFormControl.setValidators([]);
    }
  }

  onLoadPreviousReceivers() {
    console.log('something')
  }

  isCustomerPersonal() {
    return this.commonService.isCustomerPersonal(this.getFormControl('type').value);
  }

  isDisabled() {
    return !this.receiverCustomerForm.valid;
  }

  getFormControl(fControlName: string) {
    return fControlName === 'phone' || fControlName === 'countryCode' ? this.receiverCustomerForm.get('phoneGroup').get(fControlName) :
      this.receiverCustomerForm.get(fControlName)
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
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

  getReceiverDetails() {
    const receiver: any = {
      type: '', registeredName: '', registeredNumber: '', title: '',
      name: '', surname: '', countryCode: '', phone: '', destination: '', location: ''
    }
    Object.entries(receiver).forEach((key) => {
      const attributeName = key[0];
      receiver[attributeName] = this.getFormControl(attributeName).value;
    })
    return receiver;
  }

}
