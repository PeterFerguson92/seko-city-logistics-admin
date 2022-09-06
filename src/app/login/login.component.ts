import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { REDIRECT_SECTION_AFTER_LOGIN } from '../constants';
import { ValidationService } from '../service/validation/validation.service';
import { CommonService } from '../service/common.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  authForm: FormGroup;
  showErrorText: boolean;
  showLoader: boolean;
  errorText: string;

  formValidationMap = {
    usernameInput: '',
    passwordInput: ''
  };

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private validationService: ValidationService,
    private commonService: CommonService) { }

  ngAfterViewInit(): void {
    // window.location.reload();
  }

  ngOnInit(): void {
    this.showLoader = false;
    this.authForm = this.formBuilder.group({
      usernameInput: ['', [Validators.required]],
      passwordInput: ['', [Validators.required]],
    })

    this.validateFormControl('usernameInput');
    this.validateFormControl('passwordInput');
  }

  onAuthenticate() {
    this.showLoader = true;
    this.showErrorText = false;
    const authenticationMode = 'login';
    this.authService.login(this.authForm.get('usernameInput').value, this.authForm.get('passwordInput').value).subscribe(
      ({ data }) => {
        this.showLoader = false;
        if (data[authenticationMode].result)
        {
          this.encript(data[authenticationMode].userData.sub)
        } else
        {
          this.showErrorText = true;
          this.errorText = data[authenticationMode].errors[0].message;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  encript(sub) {
    this.commonService.getKeys().subscribe(
      ({ data }) => {
        const encrypted = CryptoJS.AES.encrypt(sub,  data.getKeys.encryptionKey).toString();
        localStorage.setItem('id', encrypted);
        this.router.navigate([`/${REDIRECT_SECTION_AFTER_LOGIN}`])

        // const decrypted = CryptoJS.AES.decrypt(encrypted,  data.getKeys.encryptionKey).toString(CryptoJS.enc.Utf8);
        // console.log(decrypted);

      },
      error => { console.log(error); }
    );
  }

  validateFormControl(fControlName: string) {
    const fControl = this.authForm.get(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(value => this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName));
  }
}
