import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ORDER_PICKUP_TIMES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css', '../../shared/shared-new-form.css']
})
export class OrderInfoComponent implements OnInit, AfterViewInit {
  @Input() orderInfo;

  orderInfoForm: FormGroup;
  times = ORDER_PICKUP_TIMES;
  addresses = [];
  formValidationMap = { postcode: '' };

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,private commonService: CommonService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.orderInfoForm = this.formBuilder.group({
      date: [this.orderInfo.deliveryDate ? new Date(this.orderInfo.deliveryDate ) : new Date(), [Validators.required]],
      time: [this.orderInfo.deliveryTime ? this.orderInfo.deliveryTime :  this.times[0], [Validators.required]],
      postcode: [this.orderInfo.deliveryPostCode ? this.orderInfo.deliveryPostCode : '',
      [Validators.required, this.validationService.postCodeValidator]],
      address: [this.orderInfo.deliveryAddress ? this.orderInfo.deliveryAddress : '', [Validators.required]],
      updatesViaWhatsapp: [this.orderInfo.updatesViaWhatsapp === null ? this.orderInfo.updatesViaWhatsapp : true, [Validators.required]],
      updatesViaEmail: [this.orderInfo.updatesViaEmail === null ? this.orderInfo.updatesViaEmail : true, [Validators.required]]
    })
  }

  ngAfterViewInit(): void {
    this.validateFormControl('postcode');
  }

  getFormControl(fControlName: string) {
    return this.orderInfoForm.get(fControlName)
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    const data = fControlName === 'updatesViaWhatsapp' ? event.checked : event.value;
    fControl.setValue(data);
    fControl.markAsDirty();
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormControl('postcode');
    if (!postcodeFormControl.invalid)
    {
      this.addresses = this.commonService.getAddressesByPostcode(postcodeFormControl.value);
      return this.addresses;
    }
  }

  getInfoDetails() {
    const info: any = { date: '', time: '', postcode: '', address: '', updatesViaWhatsapp: '',updatesViaEmail: '' }
    Object.entries(info).forEach((key) => {
      const attributeName = key[0];
      if (attributeName === 'date')
      {
        info[attributeName] = this.commonService.getFormattedIsoDate(this.getFormControl(attributeName).value);
      } else
      {
        info[attributeName] = this.getFormControl(attributeName).value;
      }
    })
    return info;
  }

}
