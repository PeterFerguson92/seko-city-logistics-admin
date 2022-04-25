import { TestBed } from '@angular/core/testing';

import { ShipmentResolverService } from './shipment-resolver.service';

describe('ShipmentResolverResolver', () => {
  let resolver: ShipmentResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShipmentResolverService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
