import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { LearningProvider } from './contexts/LearningContext';
import { TeddyProvider } from './contexts/TeddyContext';
import { useFrameworkReady } from './hooks/useFrameworkReady';

export default function App() {
  // Use the framework ready hook
  useFrameworkReady();

  return (
    <AuthProvider>
      <TeddyProvider>
        <LearningProvider>
          <View style={{ flex: 1 }}>
            {/* We'll keep the existing App content here */}
            {/* This is just a temporary View until we configure the router */}
            <StatusBar style="auto" />
          </View>
        </LearningProvider>
      </TeddyProvider>
    </AuthProvider>
  );
}