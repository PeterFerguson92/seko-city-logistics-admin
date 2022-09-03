import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsCustomerHistoryComponent } from './bookings-customer-history.component';

describe('BookingsCustomerHistoryComponent', () => {
  let component: BookingsCustomerHistoryComponent;
  let fixture: ComponentFixture<BookingsCustomerHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsCustomerHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsCustomerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
