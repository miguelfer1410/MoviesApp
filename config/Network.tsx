import { useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkProviderProps {
  children: ReactNode;
}

const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isWifi, setIsWifi] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false);
      setIsWifi(state.type === 'wifi');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Só mostrar o alerta quando já tiver recebido o estado inicial e estiver desconectado
    if (isConnected === false || isWifi === false) {
      Alert.alert("No Internet Connection", "Please connect to a Wi-Fi network.");
    }
  }, [isConnected, isWifi]);

  return <>{children}</>;
};

export default NetworkProvider;
