import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachInvoiceDialogComponent } from './attach-invoice-dialog.component';

describe('AttachInvoiceDialogComponent', () => {
  let component: AttachInvoiceDialogComponent;
  let fixture: ComponentFixture<AttachInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachInvoiceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
