# DomainCodeDialog: distinguish empty roles vs retrieve failure

## Problem

When `domainOptions` is empty, the dialog previously said organisations could not be retrieved. That is often wrong: callers pass domains derived from app-relevant roles, so `[]` usually means the user has no suitable roles. True fetch failures were indistinguishable because callers also coerce `undefined` to `[]`.

## Design

Add an optional `isError?: boolean` prop (default `false`) to `DomainCodeDialog`.

### Message priority

1. `isError` → `Unable to retrieve your active organisations. Try logging in again.`
2. `!isLoading && domainOptions.length === 0` → `You have no roles assigned that are suitable for use with this application. If you think you should, try logging in again.`
3. Otherwise, existing “no roles in chosen organisation” message when applicable
4. While `isLoading` and not `isError`, show no error helper text

Confirm/Logout behaviour stays driven by empty options / invalid selection; only the helper text changes.

### Callers

Pass React Query `isError` (or equivalent) for the query that supplies `domainOptions`. Until callers pass `isError`, behaviour matches the empty-roles message for `[]` (an improvement over the old always-retrieve wording).

## Out of scope

Changing soft “empty” returns inside `useValidDomains` (e.g. missing claims → `[]`) into thrown errors.
