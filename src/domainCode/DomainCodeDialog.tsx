import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import AgDialog from 'src/components/AgDialog';
import { useDomainCode } from './hooks';

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
}>;

const DomainCodeDialog = ({
  isLoading,
  isOpen,
  onClose: handleClose,
  domainOptions: domainCodeOptions,
}: Props) => {
  const [storedDomainCode, setStoredDomainCode] = useDomainCode();
  const [domainCode, setDomainCode] = useState(storedDomainCode);
  return (
    <AgDialog
      isOpen={isOpen}
      dialogTitle="Select an organisation"
      primaryButton={{
        text: 'Confirm',
        onClick: async () => {
          setStoredDomainCode(domainCode);
          handleClose();
        },
      }}
      onClose={handleClose}
    >
      <p>Select the default organisation that you want to use with the List Manager.</p>

      <Autocomplete
        loading={isLoading}
        multiple={false}
        disableClearable={false}
        value={domainCode}
        onChange={(_, value) => setDomainCode(value ?? '')}
        getOptionLabel={getOptionLabel}
        options={domainCodeOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label={'Select organisation'}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </AgDialog>
  );
};

export default DomainCodeDialog;
