import type { ErrorEvent, EventHint } from '@sentry/react';
import { sentryBeforeSend } from './sentryBeforeSend';

const mockEvent = { event_id: 'test-123' } as unknown as ErrorEvent;

function hintWith(originalException: unknown): EventHint {
  return { originalException } as EventHint;
}

describe('sentryBeforeSend()', () => {
  describe('Auth0 login_required errors', () => {
    it('should filter an Auth0 OAuthError with error "login_required"', () => {
      const auth0Error = {
        name: 'OAuthError',
        message: 'Login required',
        error: 'login_required',
        error_description: 'Login required',
      };

      expect(sentryBeforeSend(mockEvent, hintWith(auth0Error))).toBeNull();
    });

    it('should filter a plain object with error "login_required"', () => {
      const error = { error: 'login_required' };

      expect(sentryBeforeSend(mockEvent, hintWith(error))).toBeNull();
    });
  });

  describe('other Auth0 errors', () => {
    it('should pass through an Auth0 error with a different error code', () => {
      const auth0Error = {
        name: 'OAuthError',
        message: 'Consent required',
        error: 'consent_required',
        error_description: 'Consent required',
      };

      expect(sentryBeforeSend(mockEvent, hintWith(auth0Error))).toBe(mockEvent);
    });
  });

  describe('non-Auth0 errors', () => {
    it('should pass through a regular Error', () => {
      const error = new Error('Something went wrong');

      expect(sentryBeforeSend(mockEvent, hintWith(error))).toBe(mockEvent);
    });

    it('should pass through when originalException is a string', () => {
      expect(sentryBeforeSend(mockEvent, hintWith('some string error'))).toBe(mockEvent);
    });

    it('should pass through when originalException is null', () => {
      expect(sentryBeforeSend(mockEvent, hintWith(null))).toBe(mockEvent);
    });

    it('should pass through when originalException is undefined', () => {
      expect(sentryBeforeSend(mockEvent, hintWith(undefined))).toBe(mockEvent);
    });
  });
});
