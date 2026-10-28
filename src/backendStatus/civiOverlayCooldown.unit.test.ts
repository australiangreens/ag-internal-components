import {
  CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS,
  isCiviUncontactableOverlayInCooldownoldown,
  markCiviUncontactableOverlayShown,
  msUntilCiviUncontactableOverlayCooldownEnds,
  resetCiviUncontactableOverlayCooldown,
} from './constants';

describe('Civi uncontactable overlay cooldown', () => {
  beforeEach(() => {
    resetCiviUncontactableOverlayCooldown();
  });

  it('is not in cooldown before the overlay has been shown', () => {
    expect(isCiviUncontactableOverlayInCooldownoldown(1_000)).toBe(false);
    expect(msUntilCiviUncontactableOverlayCooldownEnds(1_000)).toBe(0);
  });

  it('is in cooldown for one minute after the overlay was shown', () => {
    markCiviUncontactableOverlayShown(10_000);
    expect(isCiviUncontactableOverlayInCooldownoldown(10_000)).toBe(true);
    expect(msUntilCiviUncontactableOverlayCooldownEnds(10_000)).toBe(
      CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS
    );
    expect(
      isCiviUncontactableOverlayInCooldownoldown(10_000 + CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS - 1)
    ).toBe(true);
    expect(
      msUntilCiviUncontactableOverlayCooldownEnds(10_000 + CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS - 1)
    ).toBe(1);
    expect(
      isCiviUncontactableOverlayInCooldownoldown(10_000 + CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS)
    ).toBe(false);
    expect(
      msUntilCiviUncontactableOverlayCooldownEnds(10_000 + CIVI_UNCONTACTABLE_OVERLAY_MIN_INTERVAL_MS)
    ).toBe(0);
  });
});
