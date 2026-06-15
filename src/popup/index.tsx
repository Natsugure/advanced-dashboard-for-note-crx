import '@mantine/core/styles.css'
import './index.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { Popup } from './Popup';
import { PageProvider } from './providers/PageProvider';
import { UserProvider } from './providers/UserProvider';
import { ClerkProvider } from '@clerk/chrome-extension';

const myColor: MantineColorsTuple = [
  '#e6fdf7',
  '#d7f5ed',
  '#b2e9d9',
  '#89dcc4',
  '#67d1b3',
  '#51cba8',
  '#43c8a2',
  '#35b893',
  '#269d7c',
  '#08886a'
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
  primaryShade: 7,
});

const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Please add the VITE_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file')
} 

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <MantineProvider theme={theme}>
          <UserProvider>
            <PageProvider>
              <Popup />
            </PageProvider>
          </UserProvider>
        </MantineProvider>
      </ClerkProvider>
    </React.StrictMode>
  );
}
