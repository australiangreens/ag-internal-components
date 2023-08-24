import { useState } from 'react';
import { Box } from '@mui/material';

import {
  FetchAutocomplete,
  FetchAutocompleteChangeReason,
  AutocompleteGenericEntity,
} from 'ag-internal-components';
import countryList from './countries.json';

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

  const handleOnChange = (newValue: Country[], reason: FetchAutocompleteChangeReason) => {
    console.log(`onChange reason = ${reason}`);
    setSelectedItems(newValue);
  };

  return (
    <>
      <Box sx={{ width: '300px', marginLeft: 10 }}>
        <FetchAutocomplete
          minLength={3}
          lookup={pretendLookup}
          label="Select an item"
          value={selectedItems}
          onChange={handleOnChange}
          loadingText="Looking for items..."
          noOptionsText="No items found"
        />
      </Box>
    </>
  );
}
