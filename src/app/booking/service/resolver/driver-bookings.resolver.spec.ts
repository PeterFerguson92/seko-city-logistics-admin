import { TestBed } from '@angular/core/testing';

import { DriverBookingsResolver } from './driver-bookings.resolver';

describe('DriverBookingsResolver', () => {
  let resolver: DriverBookingsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DriverBookingsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
