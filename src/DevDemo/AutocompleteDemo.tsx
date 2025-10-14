import { Settings as TitleIcon } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import LayersIcon from '@mui/icons-material/Layers';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box, Divider, Menu, MenuItem, ToggleButton, Typography } from '@mui/material';
import { useSetAtom } from 'jotai';
import { PropsWithChildren, SyntheticEvent, useEffect, useState } from 'react';

import {
  AutocompleteGenericEntity,
  FetchAutocomplete,
  FetchAutocompleteChangeReason,
  SingleAutocomplete,
  navBarTopAtom,
  topBarMiddleAtom,
} from 'ag-internal-components';
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
  const [hasContextMenu, setHasContextMenu] = useState(false);
  const [isSearchDeletedonRightClick, setIsSearchDeletedonRightClick] = useState(false);
  const setNavBarTop = useSetAtom(navBarTopAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);

  // The following code is adapted from here.
  // https://mui.com/material-ui/react-menu/#context-menu

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = !hasContextMenu
    ? undefined
    : (event: React.MouseEvent) => {
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
        <Divider sx={{ opacity: 0.6 }} />

        <Box display="flex" flexDirection="row" gap={3} alignItems="center">
          <Box display="flex" flexDirection="column" gap={1} alignItems="center">
            <QuestionMarkIcon sx={{ height: '32px', width: '32px' }} color="primary" />
            <Typography variant="h6">Show custom context menu on right click</Typography>
            <Typography variant="subtitle2">
              (This will also hide the search prompt due to how {'<Menu>'} works.)
            </Typography>
            <ToggleButton
              value="check"
              selected={hasContextMenu}
              onChange={() => setHasContextMenu((prevContextMenu) => !prevContextMenu)}
            >
              <CheckIcon />
            </ToggleButton>
          </Box>
          <Box display="flex" flexDirection="column" gap={1} alignItems="center">
            <QuestionMarkIcon sx={{ height: '32px', width: '32px' }} color="primary" />
            <Typography variant="h6">Disable default right click behaviour</Typography>
            <Typography variant="subtitle2">
              (Hide search prompt and browser context menu)
            </Typography>
            <ToggleButton
              value="check"
              selected={isSearchDeletedonRightClick}
              onChange={() =>
                setIsSearchDeletedonRightClick((prevSearchDeleted) => !prevSearchDeleted)
              }
            >
              <CheckIcon />
            </ToggleButton>
          </Box>
        </Box>

        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            columnGap: '24px',
            rowGap: '26px',
          }}
        >
          <Divider sx={{ opacity: 0.6 }} />
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
                onRightClick={handleContextMenu}
                disableDefaultRightClickBehaviour={isSearchDeletedonRightClick}
              />
            </div>
          </FormGroupBox>
          <Divider sx={{ opacity: 0.6 }} />
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
              textFieldVariant="filled"
              noOptionsText="No countries found"
              onRightClick={handleContextMenu}
              disableDefaultRightClickBehaviour={isSearchDeletedonRightClick}
            />
          </FormGroupBox>

          <Divider sx={{ opacity: 0.6 }} />
          <FormGroupBox>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <LayersIcon sx={{ height: '32px', width: '32px' }} color="primary" />
              <Typography variant="h6">FetchAutocomplete template placeholder</Typography>
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
                onRightClick={handleContextMenu}
                disableDefaultRightClickBehaviour={isSearchDeletedonRightClick}
                // The following gives it the placeholder styling
                textFieldColor="info"
                placeholderText="Placeholder field"
                textFieldFocused={true}
                textFieldSx={{
                  '& .MuiFilledInput-root.Mui-focused': {
                    backgroundColor: 'hsla(201, 98%, 41%, 0.08)',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: 'hsla(201, 98%, 41%, 0.08)',
                  },
                }}
                readOnly={true}
                hideInputEndAdornment={true}
              />
            </div>
          </FormGroupBox>
          <Divider sx={{ opacity: 0.6 }} />
          <FormGroupBox>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <LayersIcon sx={{ height: '32px', width: '32px' }} color="primary" />
              <Typography variant="h6">SingleAutocomplete template placeholder</Typography>
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
                isTemplatePlaceholder
                placeholderText="Placeholder"
                textFieldVariant="filled"
                onRightClick={handleContextMenu}
                disableDefaultRightClickBehaviour={isSearchDeletedonRightClick}
              />
            </div>
          </FormGroupBox>
        </form>
      </Box>
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
