import { TestBed } from '@angular/core/testing';

import { ListBookingsResolver } from './list-bookings.resolver';

describe('ListBookingsResolver', () => {
  let resolver: ListBookingsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ListBookingsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
