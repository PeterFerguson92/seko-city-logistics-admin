import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { CUSTOMER_TYPES, COUNTRIES, COUNTRY_CODES, GH_DESTINATIONS, CUSTOMER_TITLES, CUSTOMER_RECEIVER_ROLE } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';
import { ICustomer } from '../model';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css', '../../shared/shared.css']
})
export class ReceiverComponent implements OnInit, AfterViewInit {
  @Input() references;
  @Input() destination;
  @Input() location;
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
    private customersService: CustomersService,
    private commonService: CommonService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    console.log(this.references)
    this.receiversCustomerForm = this.formBuilder.group({
      receivers: this.formBuilder.array([])
    });

    this.destinationForm = this.formBuilder.group({
      destination: [this.destinations[0], [Validators.required]],
      location: [''],
    });

    if (this.references && this.references.length > 0)
    {
      this.populateFields(this.references);
    } else
    {
      this.receivers.push(this.buildReceiver(null));
    }

  }

  buildReceiver(customer: ICustomer): FormGroup {
    return this.formBuilder.group({
      type: [customer ? customer.type : this.types[0], [Validators.required]],
      registeredName: [customer ? customer.registeredName : ''],
      registeredNumber: [customer ? customer.registeredNumber : ''],
      title: [customer ? customer.title : this.titles[0], [Validators.required]],
      name: [customer ? customer.name : '', Validators.required],
      surname: [customer ? customer.surname : '', Validators.required],
      email: [customer ? customer.email : '', [Validators.email]],
      phoneGroup: this.formBuilder.group({
        countryCode: [customer ? customer.countryCode : this.codes[0], [Validators.required]],
        phone: [customer ? customer.phone : '', [Validators.required]],
      }, { validators: [Validators.required, this.validationService.phoneValidator] }),
    })
  }

  populateFields(references: [string]) {

    this.customersService.getCustomersByReferences(references).subscribe(
      ({ data }) => {
        const recvs = data.customersByReferences;
        recvs.forEach(customer => this.receivers.push(this.buildReceiver(customer)));

      },
      error => {
        console.log(error);
      }
    );

    this.getDestinationFormControl('destination').setValue(this.destination);
    this.getDestinationFormControl('location').setValue(this.location)
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
      this.receivers.push(this.buildReceiver(null));
    }
  }

  isReceiverValuePopulated(index) {
    // console.log(this.receivers.controls[index]);
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
    this.getReceiverDetails()
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
    return {receivers: this.getReceiversData(), destinationInfo: this.getDestinationInfo()}
  }

  getReceiversData() {
    const receiverData = [];
    this.receivers.controls.forEach((control) => {
        receiverData.push(this.buildReceiverObject(control))
      });

    return receiverData;
  }

  buildReceiverObject(control: AbstractControl) {
    const receiver: any = {
      type: '', registeredName: '', registeredNumber: '',
      title: '', name: '', surname: '', countryCode: '', phone: ''
    }
    Object.entries(receiver).forEach((key) => {
      const attributeName = key[0];
      if (attributeName === 'countryCode' || attributeName === 'phone')
      {
        receiver[attributeName] = control.get('phoneGroup').get(attributeName).value;

      } else
      {
        receiver[attributeName] = control.get(attributeName).value;
      }
    })
    return receiver;
  }

  getDestinationInfo() {
    return {destination: this.getDestinationFormControl('destination').value, location: this.getDestinationFormControl('location').value}
  }
}
