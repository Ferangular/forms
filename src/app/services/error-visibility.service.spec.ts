import { TestBed } from '@angular/core/testing';

import { ErrorVisibilityService } from './error-visibility.service';

describe('ErrorVisibilityService', () => {
  let service: ErrorVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
