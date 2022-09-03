import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBookingHistoryComponent } from './customer-booking-history.component';

describe('CustomerBookingHistoryComponent', () => {
  let component: CustomerBookingHistoryComponent;
  let fixture: ComponentFixture<CustomerBookingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerBookingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerBookingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
