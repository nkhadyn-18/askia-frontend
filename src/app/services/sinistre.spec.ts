import { TestBed } from '@angular/core/testing';

import { Sinistre } from './sinistre';

describe('Sinistre', () => {
  let service: Sinistre;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sinistre);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
