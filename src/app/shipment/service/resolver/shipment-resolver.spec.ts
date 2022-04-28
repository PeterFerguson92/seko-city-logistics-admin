import { TestBed } from '@angular/core/testing';

import { ShipmentResolver} from './shipment-resolver';

describe('ShipmentResolverResolver', () => {
  let resolver: ShipmentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShipmentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
