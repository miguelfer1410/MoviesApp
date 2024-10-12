import React from 'react';
import { Provider } from './context/Provider';
import TabComponent from './routes/stack';
import { NavigationContainer } from '@react-navigation/native';
import NetworkProvider from './config/Network';

export default function App() {
  return (
    <NavigationContainer>
        <Provider>
          <NetworkProvider>
            <TabComponent />
          </NetworkProvider>
        </Provider>
      </NavigationContainer>
  );
}
