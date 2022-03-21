import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CUSTOMER_TYPES, COUNTRIES, COUNTRY_CODES, GH_DESTINATIONS, CUSTOMER_TITLES, CUSTOMER_RECEIVER_ROLE } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css', '../../shared/shared.css']
})
export class ReceiverComponent implements OnInit, AfterViewInit {

  receiversCustomerForm: FormGroup;
  destinationForm: FormGroup;
  types = CUSTOMER_TYPES;
  titles = CUSTOMER_TITLES;
  countries = COUNTRIES;
  codes = COUNTRY_CODES;
  destinations = GH_DESTINATIONS;
  showOtherDestinations = false;
  alertOptions = { autoClose: true, keepAfterRouteChange: false };
  formValidationMap = { name: '', surname: '', registeredName: '', phone: '', location: '' };

  get receivers(): FormArray {
    return this.receiversCustomerForm.get('receivers') as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private commonService: CommonService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.receiversCustomerForm = this.formBuilder.group({
      receivers: this.formBuilder.array([this.buildReceiver()])
    });

    this.destinationForm = this.formBuilder.group({
      destination: [this.destinations[0], [Validators.required]],
      location: [''],
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

    // this.validateGroupFormControl('phoneGroup', 'phone')
  }

  onAddReceveir(index) {
    if (!this.isReceiverValuePopulated(index))
    {
      this.receivers.push(this.buildReceiver());
    }
  }

  isReceiverValuePopulated(index) {
    return !this.receivers.controls[index].valid;
  }

  isDeleteDisabled() {
    return !(this.receivers.length > 1);
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

    const registeredNameFormControl = this.getReceiversFormControl('registeredName', index);
    if (fControlName === 'type' && event.value !== 'PERSONAL')
    {
      registeredNameFormControl.setValidators([Validators.required]);
    } else
    {
      registeredNameFormControl.setErrors(null);
      registeredNameFormControl.markAsPristine();
    }
  }

  onDestinationSelectionChange(event: any, fControlName: string) {
    const fControl = this.getDestinationFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
    const locationFormControl = this.getDestinationFormControl('location');
    if (fControlName === 'destination' && event.value === 'OTHER')
    {
      locationFormControl.setValidators([Validators.required]);
      locationFormControl.markAsDirty();
      locationFormControl.setErrors({required: 'required'});
    } else
    {
      locationFormControl.setErrors(null);
      locationFormControl.markAsPristine();
    }
  }

  onLoadPreviousReceivers() {
    console.log('something')
  }

  isCustomerPersonal(index) {
    return this.commonService.isCustomerPersonal(this.getReceiversFormControl('type', index).value);
  }

  isDisabled() {
    const isDisabled = this.receiversCustomerForm.valid === false || this.getDestinationFormControl('location').valid === false;

    if (isDisabled)
    {
      this.alertService.success('Ops, Some informations are still missing, can you please complete all required informations',
        this.alertOptions);
    }
    return isDisabled;
  }

  getDestinationFormControl(fControlName: string) {
    return this.destinationForm.get(fControlName);
  }

  getReceiversFormControl(fControlName: string, index) {
    const fControl = this.receivers.controls[index];
    return fControlName === 'phone' || fControlName === 'countryCode' ? fControl.get('phoneGroup').get(fControlName) :
    fControl.get(fControlName)
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getDestinationFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  validateGroupFormControl(formGroupName: string, fControlName: string) {
    const fGroup = this.getDestinationFormControl(formGroupName);
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
    // const receiver: any = {
    //   type: '', registeredName: '', registeredNumber: '', title: '',
    //   name: '', surname: '', countryCode: '', phone: '', destination: '', location: ''
    // }
    // Object.entries(receiver).forEach((key) => {
    //   const attributeName = key[0];
    //   receiver[attributeName] = this.getFormControl(attributeName).value;
    // })
    // receiver.role = CUSTOMER_RECEIVER_ROLE;
    // return receiver;
  }
}
