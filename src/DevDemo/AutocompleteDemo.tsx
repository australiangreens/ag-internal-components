import { PropsWithChildren, SyntheticEvent, useEffect, useState } from 'react';

import { Settings as TitleIcon } from '@mui/icons-material';
import LayersIcon from '@mui/icons-material/Layers';
import { Box, Divider, Typography } from '@mui/material';
import {
  AutocompleteGenericEntity,
  FetchAutocomplete,
  FetchAutocompleteChangeReason,
  SingleAutocomplete,
  navBarTopAtom,
  topBarMiddleAtom,
} from 'ag-internal-components';
import { useSetAtom } from 'jotai';
import countryList from './countries.json';

const FormGroupBox = ({ children }: PropsWithChildren) => (
  <Box display="flex" gap="18px" flexDirection="column">
    {children}
  </Box>
);

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
      <Box display="flex" flexDirection="column" padding="1rem" gap="26px">
        <Box display="flex" flexDirection="row" gap={1} alignItems="center">
          <TitleIcon sx={{ height: '2.75rem', width: '2.75rem' }} color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Autocomplete Demo
          </Typography>
        </Box>

        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            columnGap: '24px',
            rowGap: '26px',
          }}
        >
          <Divider light />
          <FormGroupBox>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <LayersIcon sx={{ height: '32px', width: '32px' }} color="primary" />
              <Typography variant="h6">FetchAutocomplete example</Typography>
            </Box>
            <Typography>
              Enter some country names here. Select as many as you like.{' '}
              <i>
                (You can even select items like &quot;Heard Island and Mcdonald Islands&quot;, which
                really is more an uninhabited Australian territory than a country...)
              </i>
            </Typography>
            <div>
              <FetchAutocomplete
                minLength={3}
                lookup={pretendLookup}
                label="Select a country"
                value={selectedItems}
                onChange={handleOnChange}
                loadingText="Looking for countries..."
                noOptionsText="No countries found"
                sx={{ width: '50%' }}
                boxSx={{ width: '50%' }}
                textFieldColor="primary"
              />
            </div>
          </FormGroupBox>
          <Divider light />
          <FormGroupBox>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <LayersIcon sx={{ height: '32px', width: '32px' }} color="primary" />
              <Typography variant="h6">SingleAutocomplete example</Typography>
            </Box>
            <Typography>
              Enter a country name here, but now you only get to select one.{' '}
              <i>(You still get to select territories as well as real countries.)</i>
            </Typography>
            <SingleAutocomplete
              minLength={3}
              lookup={pretendLookup}
              label="Select a country"
              value={singleItem}
              onChange={handleSingleItemChange}
              sx={{ width: '50%' }}
              textFieldColor="info"
              textFieldVariant="outlined"
              noOptionsText="No countries found"
            />
          </FormGroupBox>
        </form>
      </Box>
    </>
  );
}
