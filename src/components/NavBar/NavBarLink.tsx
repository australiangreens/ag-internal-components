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
} from '@mui/material';
import { useAtom } from 'jotai';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { navBarOpenAtom } from '../../layouts';

type BaseNavLink = {
  label: string;
  onClick?: () => void;
  to?: string;
  closeOnSmallScreen?: boolean;
  disabled?: boolean;
};
type NavLink = BaseNavLink & {
  icon: ReactNode;
  subMenu?: BaseNavLink[];
  subMenuInitialOpen?: boolean;
};

export function NavBarLink({
  label,
  to,
  icon,
  subMenu,
  subMenuInitialOpen,
  onClick: handleClick,
  closeOnSmallScreen,
  disabled = false,
}: NavLink) {
  const [menuOpen, setMenuOpen] = useState(subMenuInitialOpen);
  const [isNavBarOpen, setNavBarOpen] = useAtom(navBarOpenAtom);
  const { pathname } = useLocation();
  const isSmallScreen = false;

  useEffect(() => {
    if (subMenuInitialOpen !== undefined) setMenuOpen(subMenuInitialOpen);
  }, [subMenuInitialOpen]);

  return (
    <>
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
                <ListItemText primary={menuItem.label} inset />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
