import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CUSTOMER_TYPES, CUSTOMER_TITLES, COUNTRIES, COUNTRY_CODES, GH_DESTINATIONS, CUSTOMER_RECEIVER_ROLE } from 'src/app/constants';
import { ICustomer } from 'src/app/customer/model';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';
import { PreviousRecvDialogComponent } from '../previous-recv-dialog/previous-recv-dialog.component';

@Component({
  selector: 'app-bookings-receivers',
  templateUrl: './bookings-receivers.component.html',
  styleUrls: ['./bookings-receivers.component.css', '../../shared/shared-new-form.css']
})
export class BookingsReceiversComponent implements OnInit, AfterViewInit {

  @Input() references;
  @Input() destination;
  @Input() location;
  @Input() senderReference;
  receiversCustomerForm: FormGroup;
  destinationForm: FormGroup;
  types = CUSTOMER_TYPES;
  titles = CUSTOMER_TITLES;
  countries = COUNTRIES;
  codes = COUNTRY_CODES;
  destinations = GH_DESTINATIONS;
  showOtherDestinations = false;
  alertOptions = { autoClose: true, keepAfterRouteChange: false };
  formValidationMap = { name: '', surname: '', registeredName: '', phone: '' };
  formValidationMapList = [];

  counter = 0;

  get receivers(): FormArray {
    return this.receiversCustomerForm.get('receivers') as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private validationService: ValidationService,
    private customersService: CustomersService,
    private commonService: CommonService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.receiversCustomerForm = this.formBuilder.group({
      receivers: this.formBuilder.array([])
    });

    this.destinationForm = this.formBuilder.group({
      destination: [this.destinations[0], [Validators.required]],
      location: [''],
    });

    if (this.references && this.references.length > 0)
    {
      this.populateFields();
    } else
    {
   //   this.receivers.push(this.buildReceiver(null));
    }

  }

  ngAfterViewInit(): void {
    // this.validateFormControl('registeredName');
    // this.validateFormControl('name');
    // this.validateFormControl('surname');
    // this.validateGroupFormControl('phoneGroup', 'phone')
  }

  linkReceiverValidators() {
    this.receivers.controls.forEach((control, index) => {
      console.log(index);
      this.formValidationMapList.push({ name: '', surname: '', registeredName: '', phone: '' })
      this.validateReceiverFormControl('name', index);
      this.validateReceiverFormControl('surname', index);
      this.validateGroupFormControl('phoneGroup', 'phone', index)

    });
  }

  buildReceiver(customer: ICustomer): FormGroup {
    return this.formBuilder.group({
      reference: [customer ? customer.reference : null, []],
      type: [customer ? customer.type : this.types[0], [Validators.required]],
      registeredName: [customer ? customer.registeredName : '', []],
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

  populateFields() {
    this.customersService.getCustomersByReferences(this.references).subscribe(
      ({ data }) => {
        const recvs = data.customersByReferences;
        recvs.forEach(customer => this.receivers.push(this.buildReceiver(customer)));
        this.linkReceiverValidators();
      },
      error => {
        console.log(error);
      }
    );

    this.getDestinationFormControl('destination').setValue(this.destination);
    this.getDestinationFormControl('location').setValue(this.location)
  }

  onAddReceveir(index) {
    if (!this.isReceiverValuePopulated(index))
    {
      this.receivers.push(this.buildReceiver(null));
      this.formValidationMapList.push({ name: '', surname: '', registeredName: '', phone: '' })
    }
  }

  onAddReceveirs() {
    this.receivers.push(this.buildReceiver(null));
    this.formValidationMapList.push({ name: '', surname: '', registeredName: '', phone: '' })
  }

  isReceiverValuePopulated(index) {
    return !this.receivers.controls[index].valid;
  }

  isDeleteDisabled() {
    return !(this.receivers.length > 1); // TODO to delete is not used anymore
  }

  isAddItemsVisible() {
    return this.receivers.length === 0;
  }

  onDeleteReceiver(index) {
    this.receivers.removeAt(index)
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
    const dialogRef =  this.dialog.open(PreviousRecvDialogComponent, {
      height: '50%',
      width: '50%',
      data: { senderReference: this.senderReference, currentReferences: this.getReceiversReference()}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0)
      {
        // if (this.receivers.length === 1)
        // {
        //   this.receivers.removeAt(0)
        // }

        result.forEach(customer => this.receivers.push(this.buildReceiver(customer)));
      }
    });
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

  validateReceiverFormControl(fControlName: string, index) {
    const fControl = this.getReceiversFormControl(fControlName, index);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMapList[index][fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  validateGroupFormControl(formGroupName: string, fControlName: string, index) {
    const fGroup = this.getReceiversFormControl(formGroupName, index);
    const fMainControl = fGroup.get(fControlName);
    this.validationService.watchAndValidateFormControl(fGroup)
      .subscribe(() => {
        console.log(this.validationService.getGroupValidationMessage(fGroup, fMainControl, fControlName));
        console.log(this.formValidationMapList);
        this.formValidationMapList[index].phone =
          this.validationService.getGroupValidationMessage(fGroup, fMainControl, fControlName);
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

  getReceiversReference() {
    const receiversReference = [];
    this.receivers.controls.forEach((control) => {
      receiversReference.push(control.get('reference').value)
    });
    return receiversReference;
  }

  getReceiversData() {
    const receiverData = [];
    this.receivers.controls.forEach((control) => {
        receiverData.push(this.buildReceiverObject(control))
      });

    return receiverData;
  }

  buildReceiverObject(control: AbstractControl) {
    const receiver: any = { reference: '',
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
    receiver.role = CUSTOMER_RECEIVER_ROLE,
    // receiver.reference =  null,
    receiver.fullName =  null,
    receiver.email =  null ,
    receiver.fullPhoneNumber =  null ,
    receiver.displayAddress = null ,
    receiver.postcode = null ,
    receiver.address =  null ,
    receiver.country = null
    return receiver;
  }

  getDestinationInfo() {
    return {destination: this.getDestinationFormControl('destination').value, location: this.getDestinationFormControl('location').value}
  }
}
