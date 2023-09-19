import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SyntheticEvent } from 'react';
import { wrap } from 'souvlaki';
import SingleAutocomplete from '.';
import { withQueryClient } from '../../testing';
import { AutocompleteGenericEntity } from '../types';

const genericLookupMethod = async () => {
  return [
    { id: 1, label: 'AAA' },
    { id: 2, label: 'BBB' },
  ];
};

describe('SingleAutocomplete', () => {
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
      {
        wrapper: wrap(withQueryClient()),
      }
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
      {
        wrapper: wrap(withQueryClient()),
      }
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
        lookup={genericLookupMethod}
        label={testlabel}
        value={singleAutocompleteContents}
        onChange={handleSingleAutocompleteContents}
        data-testid="TestSingle"
        minLength={3}
      />,
      {
        wrapper: wrap(withQueryClient()),
      }
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
        lookup={genericLookupMethod}
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
        lookup={genericLookupMethod}
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
});
