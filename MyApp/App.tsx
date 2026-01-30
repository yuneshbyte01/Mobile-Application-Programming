import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch } from 'react-native';

const App: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            }}
            style={styles.profileImage}
          />

          <View style={styles.infoSection}>
            <Text style={styles.name}>Yunesh Timsina</Text>
            <Text style={styles.title}>Software Developer</Text>
            <Text style={styles.email}>yuneshtimsina@gmail.com</Text>
          </View>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.statusText}>
            Status: {isActive ? 'Active' : 'Inactive'}
          </Text>

          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: '#ccc', true: '#4caf50' }}
            thumbColor={isActive ? '#2e7d32' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;
