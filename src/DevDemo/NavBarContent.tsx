import {
  Search as AutoCompleteDemoIcon,
  PieChart as DomainCodeDemoIcon,
  Send as ExampleComponentIcon,
  Add as NavBarTopDemoIcon,
  Inbox as RandomPageIcon,
  Drafts as SaladBarDemoIcon,
  BorderTop as TopBarMiddleDemoIcon,
} from '@mui/icons-material';
import { List } from '@mui/material';
import { NavBarLink } from 'ag-internal-components';

export default function NavBarContent() {
  return (
    <List component="nav">
      <NavBarLink label="Example Component" icon={<ExampleComponentIcon />} to={'/'} />
      <NavBarLink label="SaladBar Demo" icon={<SaladBarDemoIcon />} to={'/saladBarDemo'} />
      <NavBarLink label="NavBarTop Demo" icon={<NavBarTopDemoIcon />} to={'/navBarTopDemo'} />
      <NavBarLink
        label="TopBarMiddle Demo"
        icon={<TopBarMiddleDemoIcon />}
        to={'/topBarMiddleDemo'}
      />

      <NavBarLink label="DomainCode Demo" icon={<DomainCodeDemoIcon />} to={'/domaincode'} />
      <NavBarLink label="Autocomplete Demo" icon={<AutoCompleteDemoIcon />} to={'/autocomplete'} />
      <NavBarLink
        to={'/someRandom'}
        label="Random Page"
        icon={<RandomPageIcon />}
        subMenu={[
          { label: '1. Something', to: '/someRandom#step1' },
          { label: '2. Something else', to: '/someRandom#step2' },
          { label: '3. Puppies!', to: '/someRandom#step3' },
        ]}
        extraSubIndentSpace={3}
      />
    </List>
  );
}
