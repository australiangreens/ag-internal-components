export const SIDE_PANEL_DEFAULTS = {
  titleText: '',
  flavour: 'push',
  width: 400,
  arrowButtons: 'both',
  startOpen: false,
  open: undefined,
  onChangeOpen: undefined,
  content: <></>,
  onOpened: undefined,
  onClosed: undefined,
  dataTestId: undefined,
};

export const INITIAL_LEFT_PANEL_OPEN = false;
export const INITIAL_RIGHT_PANEL_OPEN = false;

// TODO: Instead of having defaults, just make it so AppLayout requires the AgTheme
export const DEFAULT_TOP_BAR_HEIGHT = 164;
export const DEFAULT_NAV_BAR_WIDTH_OPEN = 256;
export const DEFAULT_NAV_BAR_WIDTH_CLOSED = 64;
export const DEFAULT_NAV_BAR_BACKGROUND_COLOR = '#E8E8E8';
