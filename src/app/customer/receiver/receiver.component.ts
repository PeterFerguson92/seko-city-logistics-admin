import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CUSTOMER_TYPES, COUNTRIES, COUNTRY_CODES, GH_DESTINATIONS, CUSTOMER_TITLES, CUSTOMER_RECEIVER_ROLE } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css', '../../shared/shared.css']
})
export class ReceiverComponent implements OnInit, AfterViewInit {

  receiversCustomerForm: FormGroup;
  receiverInfoCustomerForm: FormGroup;
  types = CUSTOMER_TYPES;
  titles = CUSTOMER_TITLES;
  countries = COUNTRIES;
  codes = COUNTRY_CODES;
  destinations = GH_DESTINATIONS;
  showOtherDestinations = false;
  formValidationMap = { name: '', surname: '', registeredName: '', phone: '', location: '' };

  get receivers(): FormArray {
    return this.receiversCustomerForm.get('receivers') as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.receiversCustomerForm = this.formBuilder.group({
      receivers: this.formBuilder.array([this.buildReceiver()])
    });

    this.receiverInfoCustomerForm = this.formBuilder.group({
      destination: [this.destinations[0], [Validators.required]],
      location: ['', []],
    });
  }

  buildReceiver(): FormGroup {
    return this.formBuilder.group({
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
    })
  }

  ngAfterViewInit(): void {
    // this.validateFormControl('registeredName');
    // this.validateFormControl('name');
    // this.validateFormControl('surname');
    // this.validateFormControl('destination');
    // this.validateFormControl('location');
    // this.validateGroupFormControl('phoneGroup', 'phone')
  }

  onAddReceveir(index) {
    if (!this.isReceiverValuePopulated(index))
    {
      this.receivers.push(this.buildReceiver());
    }
  }

  isReceiverValuePopulated(index) {
    console.log(this.receivers.controls[index])
    return !this.receivers.controls[index].valid;
  }

  onDeleteReceiver(index) {
    if (this.receivers.length > 1)
    {
      this.receivers.removeAt(index)
    };
  }

  onSelectionChange(event: any, fControlName: string, index) {
    const fControl = this.getReceiversFormControl(fControlName, index);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onInfoSelectionChange(event: any, fControlName: string) {
    const fControl = this.getReceiversInfoFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
    const locationFormControl = this.getReceiversInfoFormControl('location');
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

  isCustomerPersonal(index) {
    return this.commonService.isCustomerPersonal(this.getReceiversFormControl('type', index).value);
  }

  isDisabled() {
    return !this.receiverInfoCustomerForm.valid;
  }

  getFormControl(fControlName: string) {
    return this.receiverInfoCustomerForm.get(fControlName);
  }

  getReceiversFormControl(fControlName: string, index) {
    const fControl = this.receivers.controls[index];
    return fControlName === 'phone' || fControlName === 'countryCode' ? fControl.get('phoneGroup').get(fControlName) :
    fControl.get(fControlName)
  }

  getReceiversInfoFormControl(fControlName: string) {
    return this.receivers.get(fControlName);
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  validateGroupFormControl(formGroupName: string, fControlName: string) {
    const fGroup = this.receiverInfoCustomerForm.get(formGroupName);
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
    receiver.role = CUSTOMER_RECEIVER_ROLE;
    return receiver;
  }


}
