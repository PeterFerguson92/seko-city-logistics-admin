import { TestBed } from '@angular/core/testing';

import { ShipmentsResolverService } from './shipments-resolver.service';

describe('ShipmentsResolverService', () => {
  let service: ShipmentsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipmentsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
