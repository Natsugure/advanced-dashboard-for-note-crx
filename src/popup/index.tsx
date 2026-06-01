import '@mantine/core/styles.css'
import './index.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Popup } from './Popup';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MantineProvider>
        <Popup />
      </MantineProvider>
    </React.StrictMode>
  );
}
