import React from 'react';
import {
  Stack,
  Text,
  IStackStyles,
  CommandBar,
  ICommandBarItemProps,
  ThemeProvider as FluentThemeProvider,
  PartialTheme
} from '@fluentui/react';
import { useProjectContext } from '../../hooks/useProjectContext';

const stackStyles: IStackStyles = {
  root: {
    background: '#0078d4',
    color: '#fff',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

const commandBarItems: ICommandBarItemProps[] = [
  {
    key: 'scan',
    text: 'Run Scan',
    iconProps: { iconName: 'Scan' },
    onClick: () => { /* Implement scan trigger */ }
  },
  {
    key: 'refresh',
    text: 'Refresh',
    iconProps: { iconName: 'Refresh' },
    onClick: () => { /* Implement refresh */ }
  }
];

const farItems: ICommandBarItemProps[] = [
  {
    key: 'settings',
    text: 'Settings',
    iconProps: { iconName: 'Settings' },
    onClick: () => { /* Navigate to settings */ }
  }
];

const theme: PartialTheme = {
  palette: {
    themePrimary: '#0078d4',
    white: '#ffffff'
  }
};

export const Header: React.FC = () => {
  const { project } = useProjectContext();

  return (
    <FluentThemeProvider theme={theme}>
      <Stack styles={stackStyles}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="xLarge">ComplianceX</Text>
          {project && <Text variant="large">{project.name}</Text>}
        </Stack>
        <CommandBar
          items={commandBarItems}
          farItems={farItems}
          styles={{
            root: {
              backgroundColor: 'transparent',
              color: '#fff'
            }
          }}
        />
      </Stack>
    </FluentThemeProvider>
  );
};