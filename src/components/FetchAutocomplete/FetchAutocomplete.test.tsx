import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SyntheticEvent } from 'react';

import FetchAutocomplete from '.';
import { GenericAutocompleteEntity } from './types';

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
        dataTestidPrefix="getstuff"
      />
    );

    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('getstuffAutocomplete');
    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'Mel' } });
    });
    const noStuffElement = screen.getByText(nostufftext);
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
        dataTestidPrefix="getstuff"
        preLoadedOptions={[]}
      />
    );

    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('getstuffAutocomplete');
    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'Mel' } });
    });
    const noStuffElement = screen.getByText(nostufftext);
    expect(noStuffElement).toBeInTheDocument();
  });

  it('should allow an item to be selected and turned into a chip (which is later removed)', async () => {
    const user = userEvent.setup();
    const testlabel = 'This is a label';
    const nostufftext = 'No stuff found';
    let fetchAutocompleteContents = [] as GenericAutocompleteEntity[];
    const handleFetchAutocompleteContents = (
      event: SyntheticEvent<Element, Event>,
      newValue: GenericAutocompleteEntity[]
    ) => {
      fetchAutocompleteContents = newValue;
    };

    const { rerender } = render(
      <FetchAutocomplete
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        dataTestidPrefix="getstuff"
        minLength={3}
      />
    );
    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('getstuffAutocomplete');
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

    // No stuff to be found.

    expect(screen.getByText(nostufftext)).toBeInTheDocument();

    await act(async () => {
      autocompleteStuff.focus();
    });
    await user.click(autocompleteStuff);
    await act(async () => {
      fireEvent.change(labelElement, { target: { value: 'AA' } });
    });

    // Still no stuff to be found.

    expect(screen.getByText(nostufftext)).toBeInTheDocument();

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
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        dataTestidPrefix="getstuff"
        minLength={3}
      />
    );

    // This line would throw an error if the chip wasn't there.
    screen.getByTestId('getstuffChip1');
    const firstChipDelete = screen.getByTestId('getstuffChipDelete1');

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
        noOptionsText={nostufftext}
        dataTestidPrefix="getstuff"
        minLength={3}
      />
    );

    screen.getByTestId('getstuffChip2');
    const secondChipDelete = screen.getByTestId('getstuffChipDelete2');

    // Now click the first chip to make it go away.

    await user.click(firstChipDelete);
    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        lookup={genericLookupMethod}
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        dataTestidPrefix="getstuff"
        minLength={3}
      />
    );

    // That chip is now gone.

    const firstChipQuery = screen.queryByTestId('getstuffChip1');
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
        noOptionsText={nostufftext}
        dataTestidPrefix="getstuff"
        minLength={3}
      />
    );

    // All the chips are gone.

    const secondChipQuery = screen.queryByTestId('getstuffChip1');
    expect(secondChipQuery).toBeNull();
  });

  it('should allow an item to be selected and turned into a chip (which is later removed) with preLoadedOptions', async () => {
    const testlabel = 'This is a label';
    const nostufftext = 'No stuff found';
    let fetchAutocompleteContents = [] as GenericAutocompleteEntity[];
    const handleFetchAutocompleteContents = (
      event: SyntheticEvent<Element, Event>,
      newValue: GenericAutocompleteEntity[]
    ) => {
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
        dataTestidPrefix="getstuff"
        preLoadedOptions={preLoadedOptions}
      />
    );
    const labelElement = screen.getByLabelText(testlabel);
    expect(labelElement).toBeInTheDocument();
    const autocompleteStuff = screen.getByTestId('getstuffAutocomplete');
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
        dataTestidPrefix="getstuff"
        preLoadedOptions={preLoadedOptions}
      />
    );

    // This line would throw an error if the chip wasn't there.
    screen.getByTestId('getstuffChip1');
    const firstChipDelete = screen.getByTestId('getstuffChipDelete1');

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
        dataTestidPrefix="getstuff"
        preLoadedOptions={preLoadedOptions}
      />
    );

    screen.getByTestId('getstuffChip2');
    const secondChipDelete = screen.getByTestId('getstuffChipDelete2');

    // Now click the first chip to make it go away.

    await user.click(firstChipDelete);
    // Let's rerender it.

    rerender(
      <FetchAutocomplete
        label={testlabel}
        value={fetchAutocompleteContents}
        onChange={handleFetchAutocompleteContents}
        noOptionsText={nostufftext}
        dataTestidPrefix="getstuff"
        preLoadedOptions={preLoadedOptions}
      />
    );

    // That chip is now gone.

    const firstChipQuery = screen.queryByTestId('getstuffChip1');
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
        dataTestidPrefix="getstuff"
        preLoadedOptions={preLoadedOptions}
      />
    );

    // All the chips are gone.

    const secondChipQuery = screen.queryByTestId('getstuffChip1');
    expect(secondChipQuery).toBeNull();
  });
});
