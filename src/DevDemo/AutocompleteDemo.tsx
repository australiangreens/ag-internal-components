import { SyntheticEvent, useEffect, useState } from 'react';

import {
  AutocompleteGenericEntity,
  FetchAutocomplete,
  FetchAutocompleteChangeReason,
  SingleAutocomplete,
  navBarTopAtom,
  topBarMiddleAtom,
} from 'ag-internal-components';
import countryList from './countries.json';
import { useSetAtom } from 'jotai';

interface Country extends AutocompleteGenericEntity {
  id: string;
  somethingElse: string;
}

const mappedCountryList: Country[] = countryList.map((x) => {
  return {
    id: x.code,
    label: x.name,
    somethingElse: x.name.toLocaleUpperCase(),
  };
});

const getCountryContaining = (value: string) => {
  const valueToLowerCase = value.toLowerCase();

  return mappedCountryList.filter((x) => {
    if (
      x.label.toLowerCase().includes(valueToLowerCase) ||
      x.id.toLowerCase().includes(valueToLowerCase)
    ) {
      return true;
    }
    return false;
  });
};

// We could simulate abort signal if we wanted to extend this pattern
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const pretendLookup = async (lookupValue: string): Promise<Country[]> => {
  const containsList = getCountryContaining(lookupValue);
  await delay(500);
  return containsList;
};

export default function FetchAutocompleteDemo() {
  const [selectedItems, setSelectedItems] = useState<Country[]>([]);
  const [singleItem, setSingleItem] = useState<Country | null>(null);
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);

  useEffect(() => {
    setNavBarTop(undefined);
    setTopBarMiddle(undefined);
  }, [setNavBarTop, setTopBarMiddle]);

  const handleOnChange = (newValue: Country[], reason: FetchAutocompleteChangeReason) => {
    console.log(`onChange reason = ${reason}`);
    setSelectedItems(newValue);
  };

  const handleSingleItemChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: Country | null
  ) => {
    setSingleItem(newValue);
  };

  return (
    <>
      <h1>Autocomplete Demo</h1>
      <h2>FetchAutocomplete example</h2>
      <p>Enter some country names here. Select as many as you like. </p>
      <p>
        <i>
          (You can even select items like &quot;Heard Island and Mcdonald Islands&quot;, which
          really is more an uninhabited Australian territory than a country...)
        </i>
      </p>

      <FetchAutocomplete
        minLength={3}
        lookup={pretendLookup}
        label="Select a country"
        value={selectedItems}
        onChange={handleOnChange}
        loadingText="Looking for countries..."
        noOptionsText="No countries found"
        sx={{ width: '300px' }}
        textFieldColor="primary"
      />
      <h2>SingleAutocomplete example</h2>
      <p>Enter a country name here, but now you only get to select one. </p>
      <p>
        <i>(You still get to select territories as well as real countries.)</i>
      </p>
      <SingleAutocomplete
        minLength={3}
        lookup={pretendLookup}
        label="Select a country"
        value={singleItem}
        onChange={handleSingleItemChange}
        sx={{ width: '300px' }}
        textFieldColor="info"
        textFieldVariant="outlined"
        noOptionsText="No countries found"
      />
    </>
  );
}
