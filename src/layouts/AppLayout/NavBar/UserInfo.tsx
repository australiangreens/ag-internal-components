import { Box, Avatar, Typography, Skeleton } from '@mui/material';

import { DomainCode } from '../../../domainCode';
import { simpleHashCode } from '../../../utils';
import { User } from './types';

const avatarSize = {
  width: '5rem',
  height: '5rem',
};

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
 */
export default function UserInfo({ user, domainCode }: UserInfoProps) {
  return (
    <Box marginY="2rem" display="flex" flexDirection="column" alignItems="center" gap="1rem">
      {user?.name ? (
        <Avatar
          src={user?.picture}
          sx={{
            ...avatarSize,
            bgcolor: avatarColours[Math.abs(simpleHashCode(user.name)) % avatarColours.length],
          }}
        >
          {extractInitials(user.name)}
        </Avatar>
      ) : (
        <Avatar sx={avatarSize} />
      )}

      <Box alignItems="center" display="flex" flexDirection="column">
        {user?.name ? (
          <Typography>{user.name}</Typography>
        ) : (
          <Skeleton animation={false} width={avatarSize.width} />
        )}

        {domainCode ? (
          <Typography>{domainCode.toUpperCase()}</Typography>
        ) : (
          <Skeleton animation={false} width={avatarSize.width} />
        )}
      </Box>
    </Box>
  );
}
