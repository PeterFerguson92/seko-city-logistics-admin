import { TestBed } from '@angular/core/testing';

import { ShipmentItemsResolver } from './shipment-items.resolver';

describe('ShipmentItemsResolver', () => {
  let resolver: ShipmentItemsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShipmentItemsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
