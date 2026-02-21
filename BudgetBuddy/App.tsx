import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';

type TestResult = 'idle' | 'checking' | 'success' | 'error';

function App() {
  const [result, setResult] = useState<TestResult>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setResult('checking');
    setMessage('Checking Firebase...');

    try {
      const app = firebase.app();
      const appName = app.name;
      const options = app.options;

      setMessage(`App: ${appName}\nProject: ${options.projectId || 'N/A'}`);

      await analytics().logEvent('firebase_test', { source: 'test_ui' });
      setResult('success');
      setMessage(`Connected!\nEvent "firebase_test" logged to Analytics.\n\nProject: ${options.projectId || 'N/A'}`);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      setResult('error');
      setMessage(errMsg);
    }
  };

  const getStatusColor = () => {
    switch (result) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'checking': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getStatusLabel = () => {
    switch (result) {
      case 'success': return 'Connected';
      case 'error': return 'Failed';
      case 'checking': return 'Testing...';
      default: return 'Ready';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Firebase Connection Test</Text>
        <Text style={styles.subtitle}>BudgetBuddy</Text>

        <View style={[styles.statusCard, { borderColor: getStatusColor() }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusLabel, { color: getStatusColor() }]}>
              {getStatusLabel()}
            </Text>
          </View>
          {message ? (
            <Text style={styles.message} selectable>
              {message}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, result === 'checking' && styles.buttonDisabled]}
          onPress={testConnection}
          disabled={result === 'checking'}
          activeOpacity={0.8}
        >
          {result === 'checking' ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Test Firebase Connection</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Tap the button to verify Firebase SDK is connected and log a test event.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
  },
  statusCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#64748b',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
});

export default App;