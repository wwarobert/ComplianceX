import React from 'react';
import {
  Nav,
  INavStyles,
  INavLinkGroup
} from '@fluentui/react';

const navStyles: Partial<INavStyles> = {
  root: {
    width: 250,
    boxSizing: 'border-box',
    border: '1px solid #eee',
    height: '100%'
  }
};

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: 'Dashboard',
        url: '/',
        key: 'dashboard',
        icon: 'ViewDashboard'
      },
      {
        name: 'Project Settings',
        url: '/project-settings',
        key: 'project-settings',
        icon: 'Settings'
      },
      {
        name: 'Global Settings',
        url: '/global-settings',
        key: 'global-settings',
        icon: 'Globe'
      },
      {
        name: 'Scan History',
        url: '/scan-history',
        key: 'scan-history',
        icon: 'History'
      },
      {
        name: 'Reports',
        url: '/reports',
        key: 'reports',
        icon: 'BarChart4'
      }
    ]
  }
];

export const Navigation: React.FC = () => {
  return (
    <Nav
      ariaLabel="Compliance Navigation"
      styles={navStyles}
      groups={navLinkGroups}
    />
  );
};