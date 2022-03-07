import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService, postCodeValidator } from 'src/app/service/validation/validation.service';
import { ICustomer } from '../domain';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css', '../../shared/shared.css']
})
export class CustomerDetailComponent implements OnInit {

  formValidationMap = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    postcode: '',
    country: ''
  };

  types = ['PERSONAL', 'BUSINESS', 'CHARITY'];
  countries = ['UNITED KINGDOM', 'GHANA'];
  addresses = [];
  addEditCustomerForm: FormGroup;


  constructor(private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private commonService: CommonService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.addEditCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      postcode: ['', [Validators.required, postCodeValidator]],
      country: [this.countries[0], [Validators.required]]
    });

    this.validateFormControl('fullName');
    this.validateFormControl('phone');
    this.validateFormControl('email');
    this.validateFormControl('address');
    this.validateFormControl('postcode');
  }

  onAddEdit() {
    const createCustomerData = 'createCustomer'
    this.customersService.createCustomer(this.getCustomerAttributes()).subscribe(
      ({ data }) => {
        location.reload();  // To handle properly
      },
      error => {
        console.log(error);
      }
    );
  }

  onSelectionChange(event, controlName) {
    this.addEditCustomerForm.get(controlName).setValue(event.value);
  }

  validateFormControl(fControlName: string) {
    const fControl = this.addEditCustomerForm.get(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(value => this.formValidationMap[fControlName] = this.validationService.setMessage(fControl, fControlName));
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormAttribute('postcode');
    if (!postcodeFormControl.invalid)
    {
      this.addresses = this.commonService.getAddressesByPostcode(postcodeFormControl.value);
      return this.addresses;
    }
  }

  getCustomerAttributes(): ICustomer {
   return  {
      uuid: '',
      fullName: this.getFormAttribute('fullName').value,
      address: this.getFormAttribute('address').value,
      postcode: this.getFormAttribute('postcode').value,
      phone: this.getFormAttribute('phone').value,
      email: this.getFormAttribute('email').value,
      country: this.getFormAttribute('country').value,
      type: this.getFormAttribute('type').value,
      destination: ''
    };
  }

  getFormAttribute(fControlName: string) {
    return this.addEditCustomerForm.get(fControlName);
  }
}
