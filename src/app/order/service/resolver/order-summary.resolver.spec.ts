import { TestBed } from '@angular/core/testing';

import { OrderSummaryResolver } from './order-summary.resolver';

describe('OrderSummaryResolver', () => {
  let resolver: OrderSummaryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OrderSummaryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
