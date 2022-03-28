import { TestBed } from '@angular/core/testing';

import { BookingsResolverService } from './bookings-resolver.service';

describe('BookingsResolverService', () => {
  let service: BookingsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
