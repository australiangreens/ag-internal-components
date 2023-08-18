import { ComponentProps, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import TopBar from './TopBar';
import SidePanel, { DEFAULT_PANEL_WIDTH } from './SidePanel';
import PanelAwareMargins from './PanelAwareMargins';
import PageContainer from './PageContainer';

const INITIAL_LEFT_PANEL_OPEN = false;
const INITIAL_RIGHT_PANEL_OPEN = false;

const PANEL_DEFAULTS = {
  titleText: '',
  flavour: 'push',
  width: DEFAULT_PANEL_WIDTH,
  arrowButtons: 'both',
  startOpen: false,
  open: undefined,
  onChangeOpen: undefined,
  content: <></>,
  onOpened: undefined,
  onClosed: undefined,
  dataTestId: undefined,
};

export interface SidePanelProps {
  titleText?: string;
  content?: ReactNode;
  flavour?: 'push' | 'overlay';
  arrowButtons?: 'open' | 'close' | 'both' | 'none';
  width?: number;
  startOpen?: boolean;

  /** Use this and onChangeOpen if you want to use component as a controlled component */
  open?: boolean;
  onChangeOpen?: (open: boolean) => void;

  /** Called when the sliding transition to open has finished */
  onOpened?: () => void;

  /** Called when the sliding transition to open has finished */
  onClosed?: () => void;

  dataTestId?: string;
}

interface BasePageLayoutProps {
  titleText?: string;

  leftPanel?: SidePanelProps;
  rightPanel?: SidePanelProps;

  /** This will only have an effect for panels whose state is not controlled by
   * parent */
  sidePanelsAreMutuallyExclusive?: boolean;

  /** Temporary, get rid of later */
  debugOpacity?: boolean;

  /** Props applied to the PageContainer component, which is a styled MUI Container */
  pageContainerProps?: ComponentProps<typeof PageContainer>;

  topBarDataTestId?: string;
  pageContentDataTestId?: string;
}

interface PageLayoutWithNavBarProps extends BasePageLayoutProps {
  /** Only used by side panels for alignment purposes */
  navBarOpen: boolean;
  /** Only used by side panels for alignment purposes */
  navBarWidthOpen: number;
  /** Only used by side panels for alignment purposes */
  navBarWidthClosed: number;
}

interface PagelayoutWithoutNavBarProps extends BasePageLayoutProps {
  navBarOpen?: never;
  navBarWidthOpen?: never;
  navBarWidthClosed?: never;
}

export type PageLayoutProps = PropsWithChildren<
  PageLayoutWithNavBarProps | PagelayoutWithoutNavBarProps
>;

/**
 * To be used by all Page components in our apps to use a standard Top Bar, Left
 * Panel, Right Panel and Page Contents within the contents for a uniform look.
 *
 * At present it is somewhat crudely adapted from the code used in the
 * ListManager app. It _assumes_ NavBar component on the left.
 *
 * It is in the process of being tidied up, and as such is very much in flux.
 * The end goal is to unify the left most NavBar component with the PageLayout,
 * but this has to be done incrementally.
 */
export default function PageLayout({
  children,
  titleText = '',
  leftPanel,
  rightPanel,
  sidePanelsAreMutuallyExclusive = true,
  debugOpacity = false,
  pageContainerProps,
  pageContentDataTestId,
  topBarDataTestId,
  navBarOpen,
  navBarWidthOpen,
  navBarWidthClosed,
}: PageLayoutProps) {
  const [leftPanelOpenInternal, setLeftPanelOpenInternal] = useState(INITIAL_LEFT_PANEL_OPEN);
  const [rightPanelOpenInternal, setRightPanelOpenInternal] = useState(INITIAL_RIGHT_PANEL_OPEN);
  const [leftPanelOpenInternalPrevious, setLeftPanelOpenInternalPrevious] =
    useState(INITIAL_LEFT_PANEL_OPEN);
  const [rightPanelOpenInternalPrevious, setRightPanelOpenInternalPrevious] =
    useState(INITIAL_RIGHT_PANEL_OPEN);

  const includeLeftPanel = leftPanel !== undefined;
  const includeRightPanel = rightPanel !== undefined;

  const {
    titleText: leftPanelTitleText,
    content: leftPanelContent,
    flavour: leftPanelFlavour,
    open: leftPanelOpen,
    onChangeOpen: leftPanelOnChangeOpen,
    width: leftPanelWidth,
    arrowButtons: leftPanelArrowButtons,
    startOpen: leftPanelStartOpen,
    onOpened: leftPanelOnOpened,
    onClosed: leftPanelOnClosed,
    dataTestId: leftPanelDataTestId,
  } = leftPanel ? { ...PANEL_DEFAULTS, ...leftPanel } : { ...PANEL_DEFAULTS };

  const {
    titleText: rightPanelTitleText,
    content: rightPanelContent,
    flavour: rightPanelFlavour,
    open: rightPanelOpen,
    onChangeOpen: rightPanelOnChangeOpen,
    width: rightPanelWidth,
    arrowButtons: rightPanelArrowButtons,
    startOpen: rightPanelStartOpen,
    onOpened: rightPanelOnOpened,
    onClosed: rightPanelOnClosed,
    dataTestId: rightPanelDataTestId,
  } = rightPanel ? { ...PANEL_DEFAULTS, ...rightPanel } : { ...PANEL_DEFAULTS };

  useEffect(() => {
    if (leftPanelStartOpen !== INITIAL_LEFT_PANEL_OPEN) {
      setLeftPanelOpenInternal(leftPanelStartOpen);
      setLeftPanelOpenInternalPrevious(leftPanelStartOpen);
    }
  }, [leftPanelStartOpen]);

  useEffect(() => {
    if (rightPanelStartOpen !== INITIAL_RIGHT_PANEL_OPEN) {
      setRightPanelOpenInternal(rightPanelStartOpen);
      setRightPanelOpenInternalPrevious(rightPanelStartOpen);
    }
  }, [rightPanelStartOpen]);

  const leftPanelOpenCurrent = leftPanelOpen === undefined ? leftPanelOpenInternal : leftPanelOpen;

  const rightPanelOpenCurrent =
    rightPanelOpen === undefined ? rightPanelOpenInternal : rightPanelOpen;

  const handleLeftPanelChangeOpen = (open: boolean) => {
    if (leftPanelOpen === undefined) {
      // If not in controlled mode, update the internal state
      setLeftPanelOpenInternal(open);

      if (sidePanelsAreMutuallyExclusive && includeRightPanel) {
        if (open) {
          setRightPanelOpenInternal(false);
          setRightPanelOpenInternalPrevious(rightPanelOpenInternal);
        } else {
          setRightPanelOpenInternal(rightPanelOpenInternalPrevious);
        }
      }
    }
    // Likewise, if callback provided, call it
    if (leftPanelOnChangeOpen) leftPanelOnChangeOpen(open);
  };

  const handleRightPanelChangeOpen = (open: boolean) => {
    if (rightPanelOpen === undefined) {
      setRightPanelOpenInternal(open);
      if (sidePanelsAreMutuallyExclusive && includeLeftPanel) {
        if (open) {
          setLeftPanelOpenInternal(false);
          setLeftPanelOpenInternalPrevious(leftPanelOpenInternal);
        } else {
          setLeftPanelOpenInternal(leftPanelOpenInternalPrevious);
        }
      }
    }
    if (rightPanelOnChangeOpen) rightPanelOnChangeOpen(open);
  };

  return (
    <Box>
      {includeLeftPanel && (
        <SidePanel
          data-testid={leftPanelDataTestId}
          anchor="left"
          open={leftPanelOpenCurrent}
          onClose={() => handleLeftPanelChangeOpen(false)}
          width={leftPanelWidth}
          titleText={leftPanelTitleText}
          debugOpacity={debugOpacity}
          showCloseArrow={leftPanelArrowButtons === 'both' || leftPanelArrowButtons === 'close'}
          onOpened={leftPanelOnOpened}
          onClosed={leftPanelOnClosed}
          navBarOpen={navBarOpen}
          navBarWidthOpen={navBarWidthOpen}
          navBarWidthClosed={navBarWidthClosed}
        >
          {leftPanelContent}
        </SidePanel>
      )}

      {includeRightPanel && (
        <SidePanel
          data-testid={rightPanelDataTestId}
          anchor="right"
          open={rightPanelOpenCurrent}
          onClose={() => handleRightPanelChangeOpen(false)}
          width={rightPanelWidth}
          titleText={rightPanelTitleText}
          debugOpacity={debugOpacity}
          showCloseArrow={rightPanelArrowButtons === 'both' || rightPanelArrowButtons === 'close'}
          onOpened={rightPanelOnOpened}
          onClosed={rightPanelOnClosed}
          navBarOpen={navBarOpen}
          navBarWidthOpen={navBarWidthOpen}
          navBarWidthClosed={navBarWidthClosed}
        >
          {rightPanelContent}
        </SidePanel>
      )}

      <TopBar
        titleText={titleText}
        data-testid={topBarDataTestId}
        {...(includeLeftPanel && leftPanelFlavour === 'push'
          ? {
              leftPanel: {
                open: leftPanelOpenCurrent,
                width: leftPanelWidth,
                onOpen: () => handleLeftPanelChangeOpen(true),
                showOpenArrow: leftPanelArrowButtons === 'both' || leftPanelArrowButtons === 'open',
              },
            }
          : {})}
        {...(includeRightPanel && rightPanelFlavour === 'push'
          ? {
              rightPanel: {
                open: rightPanelOpenCurrent,
                width: rightPanelWidth,
                onOpen: () => handleRightPanelChangeOpen(true),
                showOpenArrow:
                  rightPanelArrowButtons === 'both' || rightPanelArrowButtons === 'open',
              },
            }
          : {})}
      />

      <PanelAwareMargins
        {...(leftPanelFlavour === 'push'
          ? {
              leftPanel: {
                open: leftPanelOpenCurrent,
                width: leftPanelWidth,
              },
            }
          : {})}
        {...(rightPanelFlavour === 'push'
          ? {
              rightPanel: {
                open: rightPanelOpenCurrent,
                width: rightPanelWidth,
              },
            }
          : {})}
      >
        <PageContainer data-testid={pageContentDataTestId} {...pageContainerProps}>
          {children}
        </PageContainer>
      </PanelAwareMargins>
    </Box>
  );
}
