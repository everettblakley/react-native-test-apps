import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootPage } from './pages/Root';

const App = () => {
  return (
    <SafeAreaProvider>
      <RootPage />
    </SafeAreaProvider>
  );
};

export default App;
