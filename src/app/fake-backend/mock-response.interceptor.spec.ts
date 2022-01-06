import { TestBed } from '@angular/core/testing';

import { MockResponseInterceptor } from './mock-response.interceptor';

describe('MockResponseInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockResponseInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MockResponseInterceptor = TestBed.inject(MockResponseInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
