import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Fade,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useAtom } from 'jotai';
import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useSmallScreen } from '../../layouts/AppLayout/mobile';
import { navBarOpenAtom } from '../../layouts/AppLayout/stateAtoms';

export type BaseNavLink = {
  label: string;
  onClick?: () => void;
  to?: string;
  closeOnSmallScreen?: boolean;
  disabled?: boolean;
};
export type NavLink = BaseNavLink & {
  icon: ReactNode;
  subMenu?: BaseNavLink[];
  subMenuInitialOpen?: boolean;
  extraSubIndentSpace?: number;
  openInNewWindow?: boolean;
  tooltip?: string;
};

export const NavBarLinkInner = ({
  label,
  to,
  icon,
  subMenu,
  subMenuInitialOpen,
  onClick: handleClick,
  closeOnSmallScreen,
  disabled = false,
  openInNewWindow = false,
  extraSubIndentSpace = 0,
  tooltip,
}: NavLink) => {
  const [menuOpen, setMenuOpen] = useState(subMenuInitialOpen);
  const [isNavBarOpen, setNavBarOpen] = useAtom(navBarOpenAtom);
  const { pathname } = useLocation();
  const isSmallScreen = useSmallScreen();
  const EXTRA_SUB_INDENT_SPACE = ' \u00a0'.repeat(extraSubIndentSpace);
  const openInNewWindowProps = openInNewWindow
    ? { rel: 'noopener noreferrer', target: '_blank' }
    : {};

  return (
    <>
      <Tooltip title={tooltip}>
        <ListItemButton
          component={to ? Link : 'button'}
          sx={{ width: '100%' }}
          to={to}
          onClick={() => {
            handleClick?.();
            if (isNavBarOpen) {
              setMenuOpen((prev) => !prev);
              if (closeOnSmallScreen && isSmallScreen) {
                setNavBarOpen(false);
              }
            } else if (subMenu) {
              setMenuOpen(true);
              setNavBarOpen(true);
            }
          }}
          aria-label={label}
          selected={pathname === to}
          disabled={disabled}
          {...openInNewWindowProps}
        >
          <ListItemIcon sx={{ padding: '8px' }}>{icon}</ListItemIcon>
          <Fade in={isNavBarOpen} unmountOnExit>
            <Box>
              <ListItemText primary={label} />
              {subMenu && (
                <ListItemSecondaryAction>
                  {menuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemSecondaryAction>
              )}
            </Box>
          </Fade>
        </ListItemButton>
      </Tooltip>
      {subMenu && (
        <Collapse in={menuOpen && isNavBarOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subMenu.map((menuItem) => (
              <ListItemButton
                key={menuItem.label}
                onClick={() => {
                  if (menuItem.onClick) {
                    menuItem?.onClick();
                  }
                  if (isNavBarOpen) {
                    if (menuItem?.closeOnSmallScreen && isSmallScreen) {
                      setNavBarOpen(false);
                    }
                  }
                }}
                to={menuItem.to}
                component={menuItem.to ? Link : 'button'}
                sx={{ width: '100%' }}
                selected={pathname === menuItem.to}
                disabled={menuItem.disabled}
              >
                <ListItemText
                  primary={EXTRA_SUB_INDENT_SPACE + menuItem.label}
                  inset
                  slotProps={{ primary: { variant: 'body2' } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const NavBarLink = ({ subMenuInitialOpen, ...rest }: NavLink) => {
  const remountKey =
    subMenuInitialOpen === undefined ? 'initial-undefined' : String(subMenuInitialOpen);

  return <NavBarLinkInner key={remountKey} subMenuInitialOpen={subMenuInitialOpen} {...rest} />;
};

export default NavBarLink;
