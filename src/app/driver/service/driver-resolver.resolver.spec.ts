import { TestBed } from '@angular/core/testing';

import { DriverResolverResolver } from './driver-resolver.resolver';

describe('DriverResolverResolver', () => {
  let resolver: DriverResolverResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DriverResolverResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
