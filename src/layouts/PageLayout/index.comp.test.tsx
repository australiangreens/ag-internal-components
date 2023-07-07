import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';

import { config as reactTransitionGroupConfig } from 'react-transition-group';

import PageLayout, { PageLayoutProps } from './index';

reactTransitionGroupConfig.disabled = true;

describe('PageLayout', () => {
  it('Displays the title text and children when open', async () => {
    render(
      <PageLayout titleText="Page Title" topBarDataTestId="topBar">
        Some content on the page yay!
      </PageLayout>
    );
    const withinTopBar = within(screen.getByTestId('topBar'));
    expect(withinTopBar.getByText('Page Title')).toBeVisible();
    expect(screen.getByText('Some content on the page yay!')).toBeVisible();
  });

  it('has no open arrows if leftPanel and rightPanel unset', async () => {
    render(<PageLayout />);
    expect(screen.queryByRole('button', { name: 'Open right side panel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open right side panel' })).not.toBeInTheDocument();
  });

  it('has left side panel if leftPanel is set', async () => {
    render(<PageLayout leftPanel={{ content: 'Some content', dataTestId: 'leftSidePanel' }} />);
    expect(screen.queryByTestId('leftSidePanel')).toBeInTheDocument();
  });

  it('has right side panel if rightPanel is set', async () => {
    render(<PageLayout rightPanel={{ content: 'Some content', dataTestId: 'rightSidePanel' }} />);
    expect(screen.queryByTestId('rightSidePanel')).toBeInTheDocument();
  });

  it('uses specified titleText and content for panels', async () => {
    const leftProps = {
      titleText: 'Foobar baz',
      content: 'j322kldsk asdflkj',
      dataTestId: 'leftSidePanel',
    };
    const rightProps = {
      titleText: 'Thing and stuff',
      content: '5kl0-jkfdlkasdlkj43',
      dataTestId: 'rightSidePanel',
    };

    render(
      <PageLayout leftPanel={leftProps} rightPanel={rightProps}>
        <p>Some stuff</p>
      </PageLayout>
    );

    const withinLeftPanel = within(screen.getByTestId('leftSidePanel'));
    expect(withinLeftPanel.getByText(leftProps.titleText)).toBeInTheDocument();
    expect(withinLeftPanel.getByText(leftProps.content)).toBeInTheDocument();

    const withinRightPanel = within(screen.getByTestId('rightSidePanel'));
    expect(withinRightPanel.getByText(rightProps.titleText)).toBeInTheDocument();
    expect(withinRightPanel.getByText(rightProps.content)).toBeInTheDocument();
  });

  it('panels are shown/hidden when open=true/false (#1/2)', async () => {
    render(
      <PageLayout
        leftPanel={{
          content: 'stuff',
          titleText: 'left title',
          open: true,
        }}
        rightPanel={{
          content: 'stuff',
          titleText: 'right title',
          open: false,
        }}
      >
        <p>Some stuff</p>
      </PageLayout>
    );

    expect(screen.queryByText('left title')).toBeVisible();
    expect(screen.queryByText('right title')).not.toBeVisible();
  });

  it('panels are shown/hidden when open=true/false (#2/2)', async () => {
    render(
      <PageLayout
        leftPanel={{
          content: 'stuff',
          titleText: 'left title',
          open: false,
        }}
        rightPanel={{
          content: 'stuff',
          titleText: 'right title',
          open: true,
        }}
      >
        <p>Some stuff</p>
      </PageLayout>
    );

    expect(screen.queryByText('left title')).not.toBeVisible();
    expect(screen.queryByText('right title')).toBeVisible();
  });

  describe('when panels are open in push flavour', () => {
    const commonProps = { open: true, content: 'stuff', flavour: 'push' };

    it('hides open buttons and shows close buttons if arrowButton=both', async () => {
      const panelProps = {
        ...commonProps,
        arrowButtons: 'both',
      };
      render(
        <PageLayout
          leftPanel={panelProps as PageLayoutProps['leftPanel']}
          rightPanel={panelProps as PageLayoutProps['rightPanel']}
          topBarDataTestId="topBar"
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      const withinTopBar = within(screen.getByTestId('topBar'));
      expect(
        withinTopBar.queryByRole('button', { name: 'Open left side panel' })
      ).not.toBeInTheDocument();
      expect(
        withinTopBar.queryByRole('button', { name: 'Open right side panel' })
      ).not.toBeInTheDocument();

      expect(screen.queryByRole('button', { name: 'Close left side panel' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close right side panel' })).toBeInTheDocument();
    });

    it('does not show close buttons if arrowButtons=open', async () => {
      const panelProps = {
        ...commonProps,
        arrowButtons: 'open',
      };
      render(
        <PageLayout
          leftPanel={panelProps as PageLayoutProps['leftPanel']}
          rightPanel={panelProps as PageLayoutProps['rightPanel']}
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(
        screen.queryByRole('button', { name: 'Close left side panel' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Close right side panel' })
      ).not.toBeInTheDocument();
    });

    it('Show close buttons if arrowButtons=close', async () => {
      const panelProps = {
        ...commonProps,
        arrowButtons: 'close',
      };
      render(
        <PageLayout
          leftPanel={panelProps as PageLayoutProps['leftPanel']}
          rightPanel={panelProps as PageLayoutProps['rightPanel']}
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(screen.queryByRole('button', { name: 'Close left side panel' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close right side panel' })).toBeInTheDocument();
    });
  });

  describe('when panels are closed in push flavour', () => {
    const commonProps = { open: false, content: 'stuff', flavour: 'push' };

    it('hides close buttons and shows open buttons if arrowButton=both', async () => {
      const panelProps = {
        ...commonProps,
        arrowButtons: 'both',
      };
      render(
        <PageLayout
          leftPanel={{
            dataTestId: 'leftSidePanel',
            ...(panelProps as PageLayoutProps['leftPanel']),
          }}
          rightPanel={{
            dataTestId: 'rightSidePanel',
            ...(panelProps as PageLayoutProps['rightPanel']),
          }}
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(screen.queryByRole('button', { name: 'Open left side panel' })).toBeInTheDocument();

      expect(screen.queryByRole('button', { name: 'Open right side panel' })).toBeInTheDocument();

      const withinLeftPanel = within(screen.getByTestId('leftSidePanel'));
      expect(withinLeftPanel.queryByRole('button')).not.toBeInTheDocument();

      const withinRightPanel = within(screen.getByTestId('rightSidePanel'));
      expect(withinRightPanel.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('when panels are open in overlay flavour', () => {
    it('hides open buttons for panels in overlay flavour even if requested', async () => {
      const panelProps = {
        open: true,
        arrowButtons: 'open',
        content: 'stuff',
        flavour: 'overlay',
      };
      render(
        <PageLayout
          leftPanel={panelProps as PageLayoutProps['leftPanel']}
          rightPanel={panelProps as PageLayoutProps['rightPanel']}
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(
        screen.queryByRole('button', { name: 'Open left side panel' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Open right side panel' })
      ).not.toBeInTheDocument();
    });
  });

  describe('when panels are uncontrolled and sidePanelsAreMutuallyExclusive=false', () => {
    it('clicking on open panel buttons opens that panel', async () => {
      const user = userEvent.setup();

      const panelProps = {
        arrowButtons: 'both',
        content: 'stuff',
        flavour: 'push',
      };

      render(
        <PageLayout
          sidePanelsAreMutuallyExclusive={false}
          leftPanel={{ ...panelProps, titleText: 'left title' } as PageLayoutProps['leftPanel']}
          rightPanel={
            {
              ...panelProps,
              titleText: 'right title',
            } as PageLayoutProps['rightPanel']
          }
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(screen.queryByText('left title')).not.toBeVisible();
      expect(screen.queryByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open left side panel' }));
      expect(screen.getByText('left title')).toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open right side panel' }));
      expect(screen.getByText('left title')).toBeVisible();
      expect(screen.getByText('right title')).toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Close left side panel' }));
      expect(screen.getByText('left title')).not.toBeVisible();
      expect(screen.getByText('right title')).toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Close right side panel' }));
      expect(screen.getByText('left title')).not.toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();
    });

    it('startOpen panel prop causes panel to open automatically', async () => {
      const panelProps = {
        arrowButtons: 'both',
        content: 'stuff',
        flavour: 'push',
        startOpen: true,
      };

      render(
        <PageLayout
          sidePanelsAreMutuallyExclusive={false}
          leftPanel={{ ...panelProps, titleText: 'left title' } as PageLayoutProps['leftPanel']}
          rightPanel={
            {
              ...panelProps,
              titleText: 'right title',
            } as PageLayoutProps['rightPanel']
          }
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      // Note: It is detected as visible here, but to a user there will be a
      // delay due to the transition
      expect(screen.queryByText('left title')).toBeVisible();
      expect(screen.queryByText('right title')).toBeVisible();
    });

    it('onChangeOpen callback of each panel called if provided', async () => {
      const user = userEvent.setup();

      const onChangeOpenLeft = vi.fn();
      const onChangeOpenRight = vi.fn();

      const panelProps = {
        arrowButtons: 'both',
        content: 'stuff',
        flavour: 'push',
      };

      render(
        <PageLayout
          sidePanelsAreMutuallyExclusive={false}
          leftPanel={
            {
              ...panelProps,
              titleText: 'left title',
              onChangeOpen: onChangeOpenLeft,
            } as PageLayoutProps['leftPanel']
          }
          rightPanel={
            {
              ...panelProps,
              titleText: 'right title',
              onChangeOpen: onChangeOpenRight,
            } as PageLayoutProps['rightPanel']
          }
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(onChangeOpenLeft).not.toHaveBeenCalled();
      expect(onChangeOpenRight).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: 'Open left side panel' }));
      expect(onChangeOpenLeft).toHaveBeenLastCalledWith(true);

      await user.click(screen.getByRole('button', { name: 'Open right side panel' }));
      expect(onChangeOpenRight).toHaveBeenLastCalledWith(true);

      await user.click(screen.getByRole('button', { name: 'Close left side panel' }));
      expect(onChangeOpenLeft).toHaveBeenLastCalledWith(false);

      await user.click(screen.getByRole('button', { name: 'Close right side panel' }));
      expect(onChangeOpenRight).toHaveBeenLastCalledWith(false);
    });
  });

  describe('when panels are uncontrolled and sidePanelsAreMutuallyExclusive=true', () => {
    it('closes an open panel if the other is opened', async () => {
      const user = userEvent.setup();

      const panelProps = {
        arrowButtons: 'both',
        content: 'stuff',
        flavour: 'push',
      };

      render(
        <PageLayout
          sidePanelsAreMutuallyExclusive={true}
          leftPanel={{ ...panelProps, titleText: 'left title' } as PageLayoutProps['leftPanel']}
          rightPanel={
            {
              ...panelProps,
              titleText: 'right title',
            } as PageLayoutProps['rightPanel']
          }
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(screen.queryByText('left title')).not.toBeVisible();
      expect(screen.queryByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open left side panel' }));
      expect(screen.getByText('left title')).toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open right side panel' }));
      expect(screen.getByText('left title')).not.toBeVisible();
      expect(screen.getByText('right title')).toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open left side panel' }));
      expect(screen.getByText('left title')).toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open right side panel' }));
      expect(screen.getByText('left title')).not.toBeVisible();
      expect(screen.getByText('right title')).toBeVisible();
    });

    it('restores each panel to previous state if the other is opened and closed', async () => {
      const user = userEvent.setup();

      const panelProps = {
        arrowButtons: 'both',
        content: 'stuff',
        flavour: 'push',
      };

      render(
        <PageLayout
          sidePanelsAreMutuallyExclusive={true}
          leftPanel={{ ...panelProps, titleText: 'left title' } as PageLayoutProps['leftPanel']}
          rightPanel={
            {
              ...panelProps,
              titleText: 'right title',
            } as PageLayoutProps['rightPanel']
          }
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(screen.queryByText('left title')).not.toBeVisible();
      expect(screen.queryByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open left side panel' }));
      expect(screen.getByText('left title')).toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open right side panel' }));
      expect(screen.getByText('left title')).not.toBeVisible();
      expect(screen.getByText('right title')).toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Close right side panel' }));
      expect(screen.getByText('left title')).toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Close left side panel' }));
      expect(screen.getByText('left title')).not.toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open right side panel' }));
      expect(screen.getByText('left title')).not.toBeVisible();
      expect(screen.getByText('right title')).toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Open left side panel' }));
      expect(screen.getByText('left title')).toBeVisible();
      expect(screen.getByText('right title')).not.toBeVisible();
    });

    // The logic here is there is no point being overly restrictive
    it('startOpen panel prop causes panel to open automatically, even if true on both', async () => {
      const panelProps = {
        arrowButtons: 'both',
        content: 'stuff',
        flavour: 'push',
        startOpen: true,
      };

      render(
        <PageLayout
          sidePanelsAreMutuallyExclusive={true}
          leftPanel={{ ...panelProps, titleText: 'left title' } as PageLayoutProps['leftPanel']}
          rightPanel={
            {
              ...panelProps,
              titleText: 'right title',
            } as PageLayoutProps['rightPanel']
          }
        >
          <p>Some stuff</p>
        </PageLayout>
      );

      expect(screen.queryByText('left title')).toBeVisible();
      expect(screen.queryByText('right title')).toBeVisible();
    });
  });
});
