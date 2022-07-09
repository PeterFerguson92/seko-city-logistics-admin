import { TestBed } from '@angular/core/testing';

import { DriverResolver } from './driver.resolver';

describe('DriverResolverResolver', () => {
  let resolver: DriverResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DriverResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
