import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import SidePanel from './SidePanel';

describe('SidePanel', () => {
  beforeEach(() => {});

  it('Displays the title text and children when open', async () => {
    render(
      <SidePanel open={true} titleText="Left Panel asdfasdf">
        Some content
      </SidePanel>
    );

    expect(screen.getByText('Left Panel asdfasdf')).toBeVisible();
    expect(screen.getByText('Some content')).toBeVisible();
  });

  it('Does not display title text or children when closed', async () => {
    render(
      <SidePanel open={false} titleText="Left Panel asdfasdf">
        Some content
      </SidePanel>
    );

    expect(screen.getByText('Left Panel asdfasdf')).not.toBeVisible();
    expect(screen.getByText('Some content')).not.toBeVisible();
  });

  it('Includes close arrow when showCloseArrow prop = true when anchor=left', async () => {
    render(<SidePanel open={true} showCloseArrow={true} anchor="left" />);
    expect(screen.getByRole('button', { name: 'Close left side panel' })).toBeVisible();
  });

  it('Does not include close arrow when showCloseArrow prop = false when anchor=left', async () => {
    render(<SidePanel open={true} showCloseArrow={false} />);
    expect(screen.queryByRole('button', { name: 'Close left side panel' })).not.toBeInTheDocument();
  });

  it('Includes close arrow when showCloseArrow prop = true when anchor=right', async () => {
    render(<SidePanel open={true} showCloseArrow={true} anchor="right" />);
    expect(screen.getByRole('button', { name: 'Close right side panel' })).toBeVisible();
  });

  it('Does not include close arrow when showCloseArrow prop = false when anchor=right', async () => {
    render(<SidePanel open={true} showCloseArrow={false} />);
    expect(
      screen.queryByRole('button', { name: 'Close right side panel' })
    ).not.toBeInTheDocument();
  });

  it('Calls onClose() when close arrow button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SidePanel open={true} onClose={onClose} showCloseArrow={true} anchor="left" />);

    await user.click(screen.getByRole('button', { name: 'Close left side panel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Value of left for anchor prop aligns panel to the left', async () => {
    render(<SidePanel anchor="left" open={true} data-testid="leftSidePanel" />);
    // Can't use something like getBoundingClientRect(), because it will always
    // have 0s in this context. Instead we confirm the css of the panel itself
    // is as expected. In a way we are also testing it has the correct testid
    const sidePanel = screen.getByTestId('leftSidePanel');
    // Its actually the sidePanel's paper component we want. Not sure how else
    // to test this
    const sidePanelPaper = sidePanel.querySelector('.MuiPaper-root') as HTMLElement;
    const style = window.getComputedStyle(sidePanelPaper);
    expect(style.left).toEqual('0px');
    expect(style.right).toEqual('');
  });

  it('Value of right for anchor prop aligns panel to the right', async () => {
    render(<SidePanel anchor="right" open={true} data-testid="rightSidePanel" />);
    const sidePanel = screen.getByTestId('rightSidePanel');
    const sidePanelPaper = sidePanel.querySelector('.MuiPaper-root') as HTMLElement;
    const style = window.getComputedStyle(sidePanelPaper);
    expect(style.left).toEqual('');
    expect(style.right).toEqual('0px');
  });
});
