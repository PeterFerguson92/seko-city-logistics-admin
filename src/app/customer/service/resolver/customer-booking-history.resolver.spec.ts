import { TestBed } from '@angular/core/testing';

import { CustomerBookingHistoryResolver } from './customer-booking-history.resolver';

describe('CustomerBookingHistoryResolver', () => {
  let resolver: CustomerBookingHistoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CustomerBookingHistoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
