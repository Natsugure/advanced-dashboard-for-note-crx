import '@mantine/core/styles.css'
import './index.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { Popup } from './Popup';
import { PageProvider } from './providers/PageProvider';

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

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MantineProvider theme={theme}>
        <PageProvider>
          <Popup />
        </PageProvider>
      </MantineProvider>
    </React.StrictMode>
  );
}
