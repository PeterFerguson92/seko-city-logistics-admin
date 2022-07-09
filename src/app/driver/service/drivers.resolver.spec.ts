import { TestBed } from '@angular/core/testing';

import { DriversResolver } from './drivers.resolver';

describe('DriversResolverResolver', () => {
  let resolver: DriversResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DriversResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
