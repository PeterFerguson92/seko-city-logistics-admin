import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShippmentConfirmationComponent } from './add-shippment-confirmation.component';

describe('AddShippmentConfirmationComponent', () => {
  let component: AddShippmentConfirmationComponent;
  let fixture: ComponentFixture<AddShippmentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShippmentConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShippmentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
