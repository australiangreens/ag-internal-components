import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';

import { SyntheticEvent, useState } from 'react';
import { wrap } from 'souvlaki';
import SingleAutocomplete from '.';
import { withQueryClient } from '../../testing';
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
  wrapper: wrap(withQueryClient()),
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

  describe('handles displaying old value even when its not in current match list', () => {
    // Turns out its not an error, but just a console warning from MUI Still
    // want to be sure we avoid it, so we spy on the console. For good measure
    // we check of possible levels
    const muiWarningRegex = /MUI: The value provided to.*is invalid/i;

    const levels: Array<keyof Console> = ['error', 'warn', 'info', 'debug', 'log'];

    beforeEach(() => {
      for (const level of levels) {
        vi.spyOn(console, level);
        console[level] = vitest.fn().mockImplementation((f) => f);
      }
    });

    const MockParent = ({ initialValue }: { initialValue: AutocompleteGenericEntity | null }) => {
      const [value, setValue] = useState<AutocompleteGenericEntity | null>(initialValue);

      const handleOnChange = (
        _event: SyntheticEvent<Element, Event>,
        newValue: AutocompleteGenericEntity | null
      ) => {
        setValue(newValue);
      };

      return (
        <SingleAutocomplete
          lookup={mockLookup}
          label="This is a label"
          value={value}
          onChange={handleOnChange}
          minLength={3}
        />
      );
    };

    it('works when initial value is null', async () => {
      const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });

      render(<MockParent initialValue={null} />, commonRenderOptions());

      const comboBox = screen.getByRole('combobox', { name: 'This is a label' });

      // Select option AAA
      await user.type(comboBox, 'aaa');
      await user.type(comboBox, '{ArrowDown}{Enter}');

      // Now replace text with that matches option CCC but not option AAA
      await user.type(comboBox, 'ccc', { initialSelectionStart: 0, initialSelectionEnd: 3 });

      for (const level of levels) {
        expect(console[level]).not.toHaveBeenCalledWith(expect.stringMatching(muiWarningRegex));
      }
    });

    it('works when initial value is already set', async () => {
      const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });

      render(<MockParent initialValue={mockOptionAAA} />, commonRenderOptions());

      const comboBox = screen.getByRole('combobox', { name: 'This is a label' });

      // Option AAA already 'selected' so replace text with that matches option CCC but not option AAA
      await user.type(comboBox, 'ccc', { initialSelectionStart: 0, initialSelectionEnd: 3 });

      for (const level of levels) {
        expect(console[level]).not.toHaveBeenCalledWith(expect.stringMatching(muiWarningRegex));
      }
    });
  });
});
