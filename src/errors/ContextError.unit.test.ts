import { ContextError } from './ContextError';

test('ContextError meets requirements to be a valid AgError', () => {
  expect(ContextError.name).toEqual('ContextError');
  expect(new ContextError().hierarchicalName).toEqual('AgError:ContextError');
});
