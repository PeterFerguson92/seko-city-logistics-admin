import { TestBed } from '@angular/core/testing';

import { DriverBookingResolver } from './driver-booking.resolver';

describe('DriverBookingResolver', () => {
  let resolver: DriverBookingResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DriverBookingResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
