import { PropsWithChildren, SyntheticEvent, useEffect, useState } from 'react';

import { Settings as TitleIcon } from '@mui/icons-material';
import LayersIcon from '@mui/icons-material/Layers';
import { Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // The following code is adapted from here.

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );

    // Prevent text selection lost after opening the context menu on Safari and Firefox
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      setTimeout(() => {
        selection.addRange(range);
      });
    }
  };

  const handleCloseAlt = () => {
    setContextMenu(null);
  };

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
                onRightClick={(event: SyntheticEvent<Element, Event>) => {
                  setAnchorEl(event.currentTarget as HTMLElement);
                }}
                disableDefaultRightClickBehaviour
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
              onRightClick={handleContextMenu}
            />
          </FormGroupBox>

          <Divider light />
          <FormGroupBox>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <LayersIcon sx={{ height: '32px', width: '32px' }} color="primary" />
              <Typography variant="h6">FetchAutocomplete placeholder</Typography>
            </Box>
            <Typography>
              Enter some country names here... if you can. Sorry - it is a placeholder.
            </Typography>
            <div>
              <FetchAutocomplete
                lookup={pretendLookup}
                label="Select a country"
                value={[]}
                onChange={() => {}}
                noOptionsText="Why are you typing? This is a search template."
                sx={{ width: '50%' }}
                boxSx={{ width: '50%' }}
                textFieldColor="info"
                isPlaceholder
                placeHolderText="Placeholder"
                disableDefaultRightClickBehaviour
              />
            </div>
          </FormGroupBox>
          <Divider light />
          <FormGroupBox>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <LayersIcon sx={{ height: '32px', width: '32px' }} color="primary" />
              <Typography variant="h6">SingleAutocomplete placeholder</Typography>
            </Box>
            <Typography>
              Enter some country names here... if you can. Sorry - it is yet another placeholder.
            </Typography>
            <div>
              <SingleAutocomplete
                lookup={pretendLookup}
                label="Select a country"
                value={null}
                onChange={() => {}}
                noOptionsText="Why are you typing? This is a search template."
                sx={{ width: '50%' }}
                textFieldColor="info"
                isPlaceholder
                placeHolderText="Placeholder"
                disableDefaultRightClickBehaviour
              />
            </div>
          </FormGroupBox>
        </form>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={handleClose}>Set as place holder</MenuItem>
        <MenuItem disabled>Combine with existing placeholder</MenuItem>
        <MenuItem disabled>Remove placeholder</MenuItem>
      </Menu>

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseAlt}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuItem onClick={handleCloseAlt}>Set as place holder</MenuItem>
        <MenuItem disabled>Combine with existing placeholder</MenuItem>
        <MenuItem disabled>Remove placeholder</MenuItem>
      </Menu>
    </>
  );
}
