import { FirstValidator } from './first-validator.directive';

describe('FirstDirective', () => {
  it('should create an instance', () => {
    const directive = new FirstValidator();
    expect(directive).toBeTruthy();
  });
});
