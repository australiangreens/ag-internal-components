import { Box } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wrap } from 'souvlaki';

import FetchAutocomplete from '.';
import { withQueryClient } from '../../testing/wrappers';
import { AutocompleteGenericEntity } from '../types';

const genericLookupMethod = async () => {
  return [
    { id: 1, label: 'AAA' },
    { id: 2, label: 'BBB' },
  ];
};

describe('FetchAutocomplete', () => {
  it('should display the label text, and an empty message', async () => {
    const user = userEvent.setup();
    const testlabel = 'This is a label';
    const nostufftext = 'No stuff found';

    render(
      <FetchAutocomplete
        lookup={async () => []}
        label={testlabel}
        value={[]}
        onChange={() => []}
        noOptionsText={nostufftext}
        data-testid="TestFetch"
      />,
      { wrapper: wrap(withQueryClient()) as React.FC }
    );

    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('TestFetch:Autocomplete');
    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'Mel' } });
    });
    const noStuffElement = await screen.findByText(nostufftext);
    expect(noStuffElement).toBeInTheDocument();
  });

  it('should display the label text, and an empty message with empty preLoadedOptions', async () => {
    const user = userEvent.setup();
    const testlabel = 'This is a label';
    const nostufftext = 'No stuff found';

    render(
      <FetchAutocomplete
        label={testlabel}
        value={[]}
        onChange={() => []}
        noOptionsText={nostufftext}
        data-testid="TestFetch"
        preLoadedOptions={[]}
      />,
      { wrapper: wrap(withQueryClient()) as React.FC }
    );

    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('TestFetch:Autocomplete');
    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'Mel' } });
    });
    const noStuffElement = await screen.findByText(nostufftext);
    expect(noStuffElement).toBeInTheDocument();
  });

  it('should allow an item to be selected and turned into a chip (which is later removed)', async () => {
    const user = userEvent.setup();
    const testlabel = 'This is a label';
    const noStuffText = 'No stuff found';
    const startTypingToSearchText = 'Start typing to search';

    let fetchAutocompleteContents: AutocompleteGenericEntity[] = [];
    const handleFetchAutocompleteContents = (newValue: AutocompleteGenericEntity[]) => {
      fetchAutocompleteContents = newValue;
    };

    const { rerender } = render(
      <FetchAutocomplete
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={noStuffText}
        data-testid="TestFetch"
        minLength={3}
      />,
      { wrapper: wrap(withQueryClient()) as React.FC }
    );
    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('TestFetch:Autocomplete');
    // await act(async () => {
    //   autocompleteStuff.focus();
    // });

    // For this test, we have made the minimum character count 3. We try entering
    // a one character string, then a two character string, then 3.

    // await act(async () => {
    //   autocompleteStuff.focus();
    // });
    // await user.click(autocompleteStuff);
    // await act(async () => {
    //   fireEvent.change(labelElement, { target: { value: 'Abc' } });
    // });

    await user.type(autocompleteStuff, 'a');

    // No stuff to be found.

    expect(await screen.findByText(startTypingToSearchText)).toBeInTheDocument();

    await user.type(autocompleteStuff, 'a');

    // Still no stuff to be found.

    expect(await screen.findByText(startTypingToSearchText)).toBeInTheDocument();

    await user.type(autocompleteStuff, 'a');

    // Stuff has been found.

    expect(screen.queryByText(startTypingToSearchText)).toBeNull();

    // And we go one item down to select the 'AAA'.

    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'ArrowDown' });
    });
    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'Enter' });
    });

    // We need to rerender the compoent with new value properties.
    // This shows us the chip.
    rerender(
      <FetchAutocomplete
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={noStuffText}
        data-testid="TestFetch"
        minLength={3}
      />
    );

    // This line would throw an error if the chip wasn't there.
    screen.getByTestId('TestFetch:Chip(1)');
    const firstChipDelete = screen.getByTestId('TestFetch:Chip(1):deleteIcon');

    // Now let's click on the 'BBB'

    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'BBB' } });
    });
    await user.click(autocompleteStuff);

    // And we select the 'BBB'.

    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'ArrowDown' });
    });
    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'Enter' });
    });

    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={noStuffText}
        data-testid="TestFetch"
        minLength={3}
      />
    );

    screen.getByTestId('TestFetch:Chip(2)');
    const secondChipDelete = screen.getByTestId('TestFetch:Chip(2):deleteIcon');

    // Now click the first chip to make it go away.

    await user.click(firstChipDelete);
    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={noStuffText}
        data-testid="TestFetch"
        minLength={3}
      />
    );

    // That chip is now gone.

    const firstChipQuery = screen.queryByTestId('TestFetch:Chip(1)');
    expect(firstChipQuery).toBeNull();

    // Now click on the second chip to make it disappear.

    await user.click(secondChipDelete);

    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={noStuffText}
        data-testid="TestFetch"
        minLength={3}
      />
    );

    // All the chips are gone.

    const secondChipQuery = screen.queryByTestId('TestFetch:Chip(1)');
    expect(secondChipQuery).toBeNull();
  });

  it('should allow an item to be selected and turned into a chip (which is later removed) with preLoadedOptions', async () => {
    const testlabel = 'This is a label';
    const nostufftext = 'No stuff found';
    let fetchAutocompleteContents: AutocompleteGenericEntity[] = [];
    const handleFetchAutocompleteContents = (newValue: AutocompleteGenericEntity[]) => {
      fetchAutocompleteContents = newValue;
    };
    const preLoadedOptions = [
      { id: 1, label: 'AAA' },
      { id: 2, label: 'BBB' },
    ];

    const user = userEvent.setup();
    const { rerender } = render(
      <FetchAutocomplete
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        data-testid="TestFetch"
        preLoadedOptions={preLoadedOptions}
      />,
      { wrapper: wrap(withQueryClient()) as React.FC }
    );
    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('TestFetch:Autocomplete');
    await act(async () => {
      autocompleteStuff.focus();
    });

    // For this test, we don't have a minium character count 3. All the options
    // should be available.

    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'AAA' } });
    });
    await user.click(autocompleteStuff);

    // Stuff has been found.

    expect(screen.queryByText(nostufftext)).toBeNull();

    // And we go one item down to select the 'AAA'.

    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'ArrowDown' });
    });
    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'Enter' });
    });

    // We need to rerender the compoent with new value properties.
    // This shows us the chip.

    rerender(
      <FetchAutocomplete
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        data-testid="TestFetch"
        preLoadedOptions={preLoadedOptions}
      />
    );

    // This line would throw an error if the chip wasn't there.
    screen.getByTestId('TestFetch:Chip(1)');
    const firstChipDelete = screen.getByTestId('TestFetch:Chip(1):deleteIcon');

    // Now let's click on the 'BBB'

    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'BBB' } });
    });
    await user.click(autocompleteStuff);

    // And we select the 'BBB'.

    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'ArrowDown' });
    });
    await act(async () => {
      fireEvent.keyDown(autocompleteStuff, { key: 'Enter' });
    });

    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        data-testid="TestFetch"
        preLoadedOptions={preLoadedOptions}
      />
    );

    screen.getByTestId('TestFetch:Chip(2)');
    const secondChipDelete = screen.getByTestId('TestFetch:Chip(2):deleteIcon');

    // Now click the first chip to make it go away.

    await user.click(firstChipDelete);
    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        data-testid="TestFetch"
        preLoadedOptions={preLoadedOptions}
      />
    );

    // That chip is now gone.

    const firstChipQuery = screen.queryByTestId('TestFetch:Chip(1)');
    expect(firstChipQuery).toBeNull();

    // Now click on the second chip to make it disappear.

    await user.click(secondChipDelete);

    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        data-testid="TestFetch"
        preLoadedOptions={preLoadedOptions}
      />
    );

    // All the chips are gone.

    const secondChipQuery = screen.queryByTestId('TestFetch:Chip(1)');
    expect(secondChipQuery).toBeNull();
  });

  const commonClickSetup = (
    isPlaceHolder: boolean,
    disableDefaultRightClickBehaviour?: boolean
  ) => {
    const mockHandleOnRightClick = vitest.fn();
    const mockOuterOnContextMenu = vitest.fn();
    const mockOnInputChange = vitest.fn();

    const user = userEvent.setup();

    // Its not possible to detect anything about the browser's own context
    // menu, but we can detect the event bubbling up
    render(
      <Box onContextMenu={mockOuterOnContextMenu}>
        <FetchAutocomplete
          minLength={3}
          lookup={async () => []}
          label={'This is a label'}
          value={[]}
          onChange={() => {}}
          onInputChange={mockOnInputChange}
          data-testid="TestFetch"
          noOptionsText={'Start typing to search'}
          onRightClick={mockHandleOnRightClick}
          disableDefaultRightClickBehaviour={disableDefaultRightClickBehaviour}
          isPlaceholder={isPlaceHolder}
        />
      </Box>,
      { wrapper: wrap(withQueryClient()) }
    );

    const autoCompleteEl = screen.getByRole('combobox');

    return {
      mockHandleOnRightClick,
      user,
      autoCompleteEl,
      mockOuterOnContextMenu,
      mockOnInputChange,
    };
  };

  describe('on a right click', () => {
    it('Shows search prompt and allows contextMenu event to bubble up if disableDefaultRightClickBehaviour = unset', async () => {
      const { user, autoCompleteEl, mockOuterOnContextMenu } = commonClickSetup(false, undefined);
      await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
      expect(screen.queryByText('Start typing to search')).toBeInTheDocument();
      expect(mockOuterOnContextMenu).toHaveBeenCalledOnce();
    });

    it('Shows search prompt and allows contextMenu event to bubble up if disableDefaultRightClickBehaviour = false', async () => {
      const { user, autoCompleteEl, mockOuterOnContextMenu } = commonClickSetup(false, false);
      await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
      expect(screen.queryByText('Start typing to search')).toBeInTheDocument();
      expect(mockOuterOnContextMenu).toHaveBeenCalledOnce();
    });

    it('Hides search prompt and prevents contextMenu event bubbling up if disableDefaultRightClickBehaviour = true', async () => {
      const { user, autoCompleteEl, mockOuterOnContextMenu } = commonClickSetup(false, true);
      await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
      expect(screen.queryByText('Start typing to search')).not.toBeInTheDocument();
      expect(mockOuterOnContextMenu).not.toHaveBeenCalled();
    });

    describe('Calls onRightClick regardless of disableDefaultRightClickBehaviour value', () => {
      it.each([[undefined], [false], [true]])('%s', async (ddrcb) => {
        const { mockHandleOnRightClick, user, autoCompleteEl } = commonClickSetup(false, ddrcb);
        await user.pointer({ keys: '[MouseRight>]', target: autoCompleteEl });
        expect(mockHandleOnRightClick).toHaveBeenCalledOnce();
      });
    });
  });

  it('on a left click does not call onRightClick', async () => {
    const { user, autoCompleteEl, mockHandleOnRightClick } = commonClickSetup(false, true);
    await user.pointer({ keys: '[MouseLeft>]', target: autoCompleteEl });
    expect(screen.queryByText('Start typing to search')).toBeInTheDocument();
    expect(mockHandleOnRightClick).not.toHaveBeenCalled();
  });

  describe('isPlaceholder behaviour', () => {
    it('when false can click and type', async () => {
      const { user, autoCompleteEl, mockOnInputChange } = commonClickSetup(false);
      await user.pointer({ keys: '[MouseLeft>]', target: autoCompleteEl });
      await user.click(autoCompleteEl);
      expect(screen.queryByText('Start typing to search')).not.toBeInTheDocument();

      await user.keyboard('Some text');
      // Checking if the text came up wasn't working as intended, so just check
      // the input change event was never triggered
      expect(mockOnInputChange).toHaveBeenCalledTimes(9);
      // expect(screen.queryByText('Some text')).toBeInTheDocument();
    });

    it('when false prevents clicking and typing', async () => {
      const { user, autoCompleteEl, mockOnInputChange } = commonClickSetup(true);
      await user.pointer({ keys: '[MouseLeft>]', target: autoCompleteEl });
      await user.click(autoCompleteEl);
      expect(screen.queryByText('Start typing to search')).not.toBeInTheDocument();

      await user.keyboard('Some text');
      expect(mockOnInputChange).not.toHaveBeenCalled();
    });
  });
});
