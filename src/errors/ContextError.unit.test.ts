import { ContextError } from './ContextError';

test('ContextError meets requirements to be a valid AgError', () => {
  expect(ContextError).toBeValidAgErrorClass('ContextError', 'AgError:ContextError');
});
