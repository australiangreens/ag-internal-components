import { Routes, Route, BrowserRouter } from 'react-router-dom';

// import { List as ExampleIcon, Home as SaladIcon } from '@mui/icons-material';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
// import SendIcon from '@mui/icons-material/Send';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import StarBorder from '@mui/icons-material/StarBorder';

import { AppLayout } from '..';
import NavBarContent from './NavBarContent';
import ExampleComponentDemo from './ExampleComponentDemo';
import SaladBarDemo from './SaladBarDemo';

// const navBarMiddleLinks = [
//   {
//     label: 'Example Component',
//     destPathname: '/ExampleComponentDemo',
//     icon: ExampleIcon,
//   },
//   {
//     label: 'SaladBarDemo',
//     destPathname: '/SaladBarDemo',
//     icon: SaladIcon,
//   },
// ];

export default function DevDemo() {
  return (
    <BrowserRouter>
      <AppLayout navBarMiddle={<NavBarContent />}>
        <Routes>
          <Route index element={<ExampleComponentDemo />} />
          <Route path="/ExampleComponentDemo" element={<ExampleComponentDemo />} />
          <Route path="/SaladBarDemo" element={<SaladBarDemo />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
