import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerDialogComponent } from './add-edit-customer-dialog.component';

describe('AddEditCustomerDialogComponent', () => {
  let component: AddEditCustomerDialogComponent;
  let fixture: ComponentFixture<AddEditCustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCustomerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
