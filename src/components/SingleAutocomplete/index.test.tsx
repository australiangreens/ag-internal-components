import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Box } from '@mui/material';
import { SyntheticEvent } from 'react';
import { wrap } from 'souvlaki';
import SingleAutocomplete from '.';
import { withQueryClient } from '../../testing/wrappers';
import { AutocompleteGenericEntity } from '../types';

const mockOptionAAA = { id: 1, label: 'AAA' };
const mockOptionBBB = { id: 2, label: 'BBB' };
const mockOptionCCC = { id: 3, label: 'CCC' };

const mockLookup = async (containing: string) => {
  const containingLowercase = containing.toLowerCase();
  // Spread to ensure we don't rely on references matching
  return [{ ...mockOptionAAA }, { ...mockOptionBBB }, { ...mockOptionCCC }].filter((x) =>
    x.label.toLowerCase().includes(containingLowercase)
  );
};

const commonRenderOptions = () => ({
  wrapper: wrap(withQueryClient()) as React.FC,
});

describe('SingleAutocomplete', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should display the label text', async () => {
    const testlabel = 'This is a label';

    render(
      <SingleAutocomplete
        lookup={async () => []}
        label={testlabel}
        value={null}
        onChange={() => []}
        data-testid="TestSingle"
      />,
      commonRenderOptions()
    );

    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
  });

  it('should display custom no options text', async () => {
    const user = userEvent.setup();
    const testLabel = 'NoOptionsTest';
    const testNoOptionsText = 'No options found';

    render(
      <SingleAutocomplete
        lookup={async () => []}
        label={testLabel}
        noOptionsText={testNoOptionsText}
        value={null}
        onChange={() => []}
        data-testid="TestSingle"
      />,
      commonRenderOptions()
    );

    const labelElement = screen.getByLabelText(testLabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteElement = screen.getByTestId('TestSingle:Autocomplete');
    await act(async () => {
      autocompleteElement.focus();
    });
    await user.click(autocompleteElement);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'XYZ' } });
    });
    expect(await screen.findByText(testNoOptionsText)).toBeInTheDocument();
  });

  it('should allow an item to be added and removed', async () => {
    const user = userEvent.setup();
    const testlabel = 'This is a label';
    let singleAutocompleteContents = null as null | AutocompleteGenericEntity;
    const handleSingleAutocompleteContents = (
      event: SyntheticEvent<Element, Event>,
      newValue: AutocompleteGenericEntity | null
    ) => {
      singleAutocompleteContents = newValue;
    };

    const { rerender } = render(
      <SingleAutocomplete
        lookup={mockLookup}
        label={testlabel}
        value={singleAutocompleteContents}
        onChange={handleSingleAutocompleteContents}
        data-testid="TestSingle"
        minLength={3}
      />,
      commonRenderOptions()
    );
    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('TestSingle:Autocomplete');
    await act(async () => {
      autocompleteStuff.focus();
    });

    // For this test, we have made the minimum character count 3. We try entering
    // a one character string, then a two character string, then 3.

    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'A' } });
    });

    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'AA' } });
    });

    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'AAA' } });
    });
    await user.click(autocompleteStuff);

    // And we go one item down to select the 'AAA'.

    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'ArrowDown' });
    });
    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'Enter' });
    });

    // We need to rerender the component with new value properties.
    // This shows us the item.

    rerender(
      <SingleAutocomplete
        lookup={mockLookup}
        label={testlabel}
        value={singleAutocompleteContents}
        onChange={handleSingleAutocompleteContents}
        data-testid="TestSingle"
        minLength={3}
      />
    );

    const labelledControlElement = screen.getByDisplayValue('AAA');
    expect(labelledControlElement).toBeInTheDocument();

    // Now it is time to click on the 'Clear' button and make the text go away.

    await act(async () => {
      autocompleteStuff.focus();
      const clearButton = screen.getByRole('button', { name: 'Clear' });
      expect(clearButton).toBeInTheDocument();

      // See https://github.com/testing-library/user-event/issues/874

      await act(async () => {
        fireEvent.click(clearButton);
      });
    });

    // Time to render one more time.

    rerender(
      <SingleAutocomplete
        lookup={mockLookup}
        label={testlabel}
        value={singleAutocompleteContents}
        onChange={handleSingleAutocompleteContents}
        data-testid="TestSingle"
        minLength={3}
      />
    );

    // This shouuld empty the control.

    const labelledTextFieldElement = screen.queryByDisplayValue('AAA');
    expect(labelledTextFieldElement).toBeNull();
  });

  const commonClickSetup = (disableDefaultRightClickBehaviour?: boolean) => {
    const mockHandleOnRightClick = vitest.fn();
    const mockOuterOnContextMenu = vitest.fn();

    const user = userEvent.setup();

    // Its not possible to detect anything about the browser's own context
    // menu, but we can detect the event bubbling up
    render(
      <Box onContextMenu={mockOuterOnContextMenu}>
        <SingleAutocomplete
          lookup={mockLookup}
          label={'This is a label'}
          value={null}
          onChange={() => {}}
          onRightClick={mockHandleOnRightClick}
          disableDefaultRightClickBehaviour={disableDefaultRightClickBehaviour}
        />
        ,
      </Box>,
      { wrapper: wrap(withQueryClient()) }
    );

    const autoCompleteEl = screen.getByRole('combobox');

    return {
      mockHandleOnRightClick,
      user,
      autoCompleteEl,
      mockOuterOnContextMenu,
    };
  };

  describe('on a right click', () => {
    it('Shows search prompt and allows contextMenu event to bubble up if disableDefaultRightClickBehaviour = unset', async () => {
      const { user, autoCompleteEl, mockOuterOnContextMenu } = commonClickSetup(undefined);
      await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
      expect(screen.queryByText('Start typing to search')).toBeInTheDocument();
      expect(mockOuterOnContextMenu).toHaveBeenCalledOnce();
    });

    it('Shows search prompt and allows contextMenu event to bubble up if disableDefaultRightClickBehaviour = false', async () => {
      const { user, autoCompleteEl, mockOuterOnContextMenu } = commonClickSetup(false);
      await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
      expect(screen.queryByText('Start typing to search')).toBeInTheDocument();
      expect(mockOuterOnContextMenu).toHaveBeenCalledOnce();
    });

    it('Hides search prompt and prevents contextMenu event bubbling up if disableDefaultRightClickBehaviour = true', async () => {
      const { user, autoCompleteEl, mockOuterOnContextMenu } = commonClickSetup(true);
      await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
      expect(screen.queryByText('Start typing to search')).not.toBeInTheDocument();
      expect(mockOuterOnContextMenu).not.toHaveBeenCalled();
    });

    describe('Calls onRightClick regardless of disableDefaultRightClickBehaviour value', () => {
      it.each([[undefined], [false], [true]])('%s', async (ddrcb) => {
        const { mockHandleOnRightClick, user, autoCompleteEl } = commonClickSetup(ddrcb);
        await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
        expect(mockHandleOnRightClick).toHaveBeenCalledOnce();
      });
    });
  });

  it('on a left click does not call onRightClick', async () => {
    const { user, autoCompleteEl, mockHandleOnRightClick } = commonClickSetup(true);
    await user.pointer({ keys: '[MouseLeft>]', target: autoCompleteEl });
    expect(screen.queryByText('Start typing to search')).toBeInTheDocument();
    expect(mockHandleOnRightClick).not.toHaveBeenCalled();
  });
});
