import { Avatar, Box, Fade, Skeleton, Typography, useTheme } from '@mui/material';

import { DomainCode } from '../../../domainCode';
import { simpleHashCode } from '../../../utils';
import { NavbarCollapse, navbarTransition } from './Styling';
import { User } from './types';

// These all have good contrast against our typical navbar background colour
const avatarColours = ['#A62A21', '#7e3794', '#0B51C1', '#3A6024', '#A81563', '#B3003C'];

const extractInitials = (name: string) =>
  name
    .split(/\s/)
    .map((part) => part.substring(0, 1).toUpperCase())
    .filter((v) => !!v)
    .slice(0, 2)
    .join('')
    .toUpperCase();

export interface UserInfoProps {
  user?: User;
  domainCode?: DomainCode;
  open: boolean;
}

/**
 * If user has a defined name and a valid url for picture, the picture will for
 * the avatar image.
 *
 * If there is a defined name but the picture is invalid or undefined, the
 * intials will be used to generate the avatar image. The colour will be random
 * for different names, but always the same for the same name.
 *
 * If user is undefined or the name is undefined, a generic empty avatar image
 * will be displayed.
 *
 */

export default function UserInfo({ user, domainCode, open }: UserInfoProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        paddingTop: 3,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <Box
        sx={{
          width: open ? '5rem' : '2rem',
          transition: open
            ? navbarTransition(theme, ['width', 'height'], 'entering')
            : navbarTransition(theme, ['width', 'height'], 'leaving'),
          aspectRatio: 1,
        }}
      >
        {user?.name ? (
          <Avatar
            src={user?.picture}
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: avatarColours[Math.abs(simpleHashCode(user.name)) % avatarColours.length],
            }}
          >
            {extractInitials(user.name)}
          </Avatar>
        ) : (
          <Avatar sx={{ width: '100%', height: '100%' }} />
        )}
      </Box>
      <NavbarCollapse sx={{ width: '100%' }} in={open}>
        <Fade in={open}>
          <Box width="100%" display="flex" flexDirection="column" alignItems="center">
            {user?.name ? (
              <Typography>{user.name}</Typography>
            ) : (
              <Skeleton animation={false} width={'50%'} />
            )}
            {domainCode ? (
              <Typography>{domainCode.toUpperCase()}</Typography>
            ) : (
              <Skeleton animation={false} width={'25%'} />
            )}
          </Box>
        </Fade>
      </NavbarCollapse>
    </Box>
  );
}
