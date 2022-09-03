import { TestBed } from '@angular/core/testing';

import { BookingCustomerHistoryResolver } from './booking-customer-history.resolver';

describe('BookingCustomerHistoryResolver', () => {
  let resolver: BookingCustomerHistoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BookingCustomerHistoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
