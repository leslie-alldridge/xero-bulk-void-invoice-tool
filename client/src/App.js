import React from 'react';
import './App.css';
import { PageHeader } from './components/PageHeader';

import { GlobalProvider } from './context/GlobalState';

function App() {
  return (
    <GlobalProvider>
      <PageHeader />
    </GlobalProvider>
  );
}

export default App;
