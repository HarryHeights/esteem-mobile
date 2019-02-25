import { default as ROUTES } from './routeNames';

const authMenuItems = [
  {
    name: 'Profile',
    route: 'ProfileTabbar',
    icon: 'perm-identity',
    id: 'profile',
  },
  {
    name: 'Bookmarks',
    route: ROUTES.SCREENS.BOOKMARKS,
    icon: 'star-border',
    id: 'bookmarks',
  },
  {
    name: 'Drafts',
    route: ROUTES.SCREENS.DRAFTS,
    icon: 'insert-drive-file',
    id: 'drafts',
  },
  {
    name: 'Settings',
    route: ROUTES.SCREENS.SETTINGS,
    icon: 'settings',
    id: 'settings',
  },
  {
    name: 'Feedback',
    route: ROUTES.SCREENS.FEEDBACK,
    icon: 'feedback',
    id: 'feedback',
  },
  {
    name: 'Logout',
    route: '',
    icon: 'power-settings-new',
    id: 'logout',
  },
];

const noAuthMenuItems = [
  {
    name: 'Add Account',
    route: ROUTES.SCREENS.LOGIN,
    icon: 'add',
    id: 'add_account',
  },
  {
    name: 'Settings',
    route: ROUTES.SCREENS.SETTINGS,
    icon: 'settings',
    id: 'settings',
  },
  {
    name: 'Feedback',
    route: ROUTES.SCREENS.FEEDBACK,
    icon: 'feedback',
    id: 'feedback',
  },
];

export default {
  AUTH_MENU_ITEMS: authMenuItems,
  NO_AUTH_MENU_ITEMS: noAuthMenuItems,
};
