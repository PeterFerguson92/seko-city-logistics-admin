import { TestBed } from '@angular/core/testing';

import { DriversResolverResolver } from './drivers-resolver.resolver';

describe('DriversResolverResolver', () => {
  let resolver: DriversResolverResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DriversResolverResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
