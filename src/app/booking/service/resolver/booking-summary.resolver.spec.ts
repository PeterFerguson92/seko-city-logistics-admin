import { TestBed } from '@angular/core/testing';

import { BookingSummaryResolver } from './booking-summary.resolver';

describe('BookingSummaryResolver', () => {
  let resolver: BookingSummaryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BookingSummaryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
