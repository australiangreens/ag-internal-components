import {
  Autocomplete,
  CircularProgress,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import AgDialog from '../components/AgDialog';
import { useLibraryAtom, useSaladBar } from '../providers';
import { domainCodeAtom } from './hooks';

const DOMAIN_CODE_LABELS = {
  act: 'ACT',
  nsw: 'NSW',
  nt: 'NT',
  qld: 'QLD',
  sa: 'SA',
  tas: 'TAS',
  vic: 'VIC',
  wa: 'WA',
  ag: 'AG',
  fedmps: 'Fedmps',
  '': '',
} as const;

export type DomainCode = keyof typeof DOMAIN_CODE_LABELS;

const getOptionLabel = (domainCode: DomainCode | null) => {
  return domainCode === null ? 'N/A' : DOMAIN_CODE_LABELS[domainCode] ?? '';
};

type Props = PropsWithChildren<{
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  domainOptions: DomainCode[];
  applicationName: string;
  handleLogout: () => void;
}>;

const DomainCodeDialog = ({
  isLoading,
  isOpen,
  onClose: handleClose,
  domainOptions,
  applicationName,
  handleLogout,
}: Props) => {
  const [domainCode, setDomainCode] = useLibraryAtom(domainCodeAtom);
  const [selectedDomainCode, setSelectedDomainCode] = useState(domainCode);
  const { enqueueSuccessNotification } = useSaladBar();

  const userHasNoDomains = domainOptions.length === 0;
  const userHasNoRolesInDomain =
    Boolean(domainCode) &&
    !domainOptions.includes(domainCode) &&
    !domainOptions.includes(selectedDomainCode);

  const shouldLogout = !domainCode || userHasNoDomains || userHasNoRolesInDomain;

  const handleConfirmDomainCode = async () => {
    if (selectedDomainCode) {
      setDomainCode(selectedDomainCode);
      enqueueSuccessNotification(`Set domain to ${selectedDomainCode}`);
      handleClose();
    } else setDomainCode('');
  };

  const handleDialogClose = async () => {
    if (domainCode && !userHasNoDomains && !userHasNoRolesInDomain) {
      setSelectedDomainCode(domainCode);
      handleClose();
    } else if (shouldLogout) {
      handleLogout();
    }
  };

  let errorMessage: string | undefined;
  if (userHasNoDomains) {
    errorMessage = 'Unable to retrieve your active organisations. Try logging in again.';
  } else if (userHasNoRolesInDomain) {
    errorMessage =
      'You no longer have any roles in your chosen organisation. Please choose another.';
  }

  return (
    <AgDialog
      isOpen={isOpen}
      dialogTitle="Select an organisation"
      primaryButton={{
        text: 'Confirm',
        onClick: handleConfirmDomainCode,
        disabled: !selectedDomainCode || userHasNoDomains || userHasNoRolesInDomain,
        buttonColor: 'primary',
      }}
      secondaryButton={{
        text: shouldLogout ? 'Logout' : 'Cancel',
        onClick: handleDialogClose,
      }}
      onClose={shouldLogout ? () => {} : handleClose}
    >
      <Typography marginBottom={2}>
        Select the default organisation that you want to use with the {applicationName}.
      </Typography>

      <Autocomplete
        loading={isLoading}
        multiple={false}
        disableClearable={false}
        value={selectedDomainCode !== '' ? selectedDomainCode : null}
        onChange={(_, value) => setSelectedDomainCode(value ?? '')}
        getOptionLabel={getOptionLabel}
        options={[...domainOptions]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label={'Select organisation'}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} sx={{ marginTop: '-20px' }} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </AgDialog>
  );
};

export default DomainCodeDialog;
