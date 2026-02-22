import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../constants/Icons';
import SafeScreenView from '../components/SafeScreenView';
import { useTheme } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/authService';
import { CURRENCIES, CURRENCY_LABELS } from '../services/settingsService';
import { screenContainer, secondaryButton } from '../styles/commonStyles';
import { Typography } from '../styles/tokens';
import { Space, Radius } from '../styles/tokens';
import { Strings } from '../constants/Strings';
import { TRANSACTION_CATEGORIES } from '../constants/transactionConstants';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { colors, settings, updateSettings } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email ?? '';

  const handleCurrency = (currency: string) => {
    updateSettings({ currency: currency as typeof settings.currency });
    setShowCurrencyPicker(false);
  };

  const handleDarkMode = (value: boolean) => {
    updateSettings({ darkMode: value });
  };

  const handleNotifications = (value: boolean) => {
    updateSettings({ notifications: value });
  };

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logOut();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Log out failed.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const goToSubscriptions = () => {
    (navigation as any).navigate?.(Strings.routes.Subscriptions);
  };

  return (
    <SafeScreenView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[screenContainer, styles.content, { backgroundColor: colors.neutral.bg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../../icons/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appName, { color: colors.neutral.textPrimary }]}>{Strings.appName}</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => {}} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={colors.neutral.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: colors.neutral.textPrimary }]}>
          {Strings.tabs.Settings}
        </Text>

        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: colors.neutral.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.neutral.bg }]}>
            <Ionicons name="person-outline" size={32} color={colors.neutral.textSecondary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.neutral.textPrimary }]}>{displayName}</Text>
            <Text style={[styles.profileEmail, { color: colors.neutral.textSecondary }]} numberOfLines={1}>
              {displayEmail || 'No email'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('My Profile', 'Edit profile coming soon.')} style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color={colors.neutral.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Settings list */}
        <View style={[styles.listCard, { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.border }]}>
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.neutral.border }]}
            onPress={() => Alert.alert('My Profile', 'Edit profile coming soon.')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={22} color={colors.brand.primary} />
            <Text style={[styles.settingLabel, { color: colors.neutral.textPrimary }]}>{Strings.settings.myProfile}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: colors.neutral.border }]} onPress={goToSubscriptions} activeOpacity={0.7}>
            <Ionicons name={Icons.tab.subscriptions as any} size={22} color={colors.brand.primary} />
            <Text style={[styles.settingLabel, { color: colors.neutral.textPrimary }]}>{Strings.settings.manageSubscriptions}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.settingRow, { borderBottomColor: colors.neutral.border }]}>
            <Ionicons name={Icons.notifications as any} size={22} color={colors.brand.primary} />
            <Text style={[styles.settingLabel, { color: colors.neutral.textPrimary }]}>{Strings.settings.notifications}</Text>
            <Switch
              value={settings.notifications}
              onValueChange={handleNotifications}
              trackColor={{ false: colors.neutral.border, true: colors.brand.primary }}
              thumbColor={colors.neutral.surface}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.neutral.border }]}
            onPress={() => setShowCurrencyPicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons name={Icons.currency as any} size={22} color={colors.brand.primary} />
            <Text style={[styles.settingLabel, { color: colors.neutral.textPrimary }]}>{Strings.settings.currency}</Text>
            <Text style={[styles.settingValue, { color: colors.neutral.textSecondary }]} numberOfLines={1}>
              {CURRENCY_LABELS[settings.currency]}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.settingRow, { borderBottomColor: colors.neutral.border }]}>
            <Ionicons name={settings.darkMode ? (Icons.moon as any) : (Icons.sunny as any)} size={22} color={colors.brand.primary} />
            <Text style={[styles.settingLabel, { color: colors.neutral.textPrimary }]}>{Strings.settings.theme}</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={handleDarkMode}
              trackColor={{ false: colors.neutral.border, true: colors.brand.primary }}
              thumbColor={colors.neutral.surface}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            onPress={() => setShowCategories(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="list-outline" size={22} color={colors.brand.primary} />
            <Text style={[styles.settingLabel, { color: colors.neutral.textPrimary }]}>{Strings.settings.categories}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Log Out */}
        <View style={styles.logOutWrap}>
          <TouchableOpacity
            style={[secondaryButton, styles.logOut, { borderColor: colors.brand.primary }]}
            onPress={handleLogOut}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name={Icons.logOut as any} size={20} color={colors.brand.primary} />
            <Text style={[styles.logOutText, { color: colors.brand.primary }]}>{Strings.settings.logOut}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Currency picker modal */}
      <Modal visible={showCurrencyPicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCurrencyPicker(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.neutral.surface }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: colors.neutral.textPrimary }]}>{Strings.settings.currency}</Text>
            {CURRENCIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.currencyOption, settings.currency === c && { backgroundColor: colors.neutral.bg }]}
                onPress={() => handleCurrency(c)}
              >
                <Text style={[styles.currencyOptionText, { color: colors.neutral.textPrimary }]}>{CURRENCY_LABELS[c]}</Text>
                {settings.currency === c && <Ionicons name="checkmark" size={22} color={colors.brand.primary} />}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Categories modal */}
      <Modal visible={showCategories} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCategories(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.neutral.surface }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: colors.neutral.textPrimary }]}>{Strings.settings.categories}</Text>
            <Text style={[styles.modalSubtitle, { color: colors.neutral.textSecondary }]}>
              Budget and transaction categories used in the app.
            </Text>
            {TRANSACTION_CATEGORIES.map((c) => (
              <View key={c} style={[styles.categoryRow, { borderBottomColor: colors.neutral.border }]}>
                <Text style={[styles.categoryName, { color: colors.neutral.textPrimary }]}>{c}</Text>
              </View>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeScreenView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: Space.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Space.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  logo: { width: 36, height: 36 },
  appName: { ...Typography.h2 },
  bellBtn: { padding: Space.xs },
  title: {
    ...Typography.h1,
    marginBottom: Space.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Space.lg,
    borderRadius: Radius.lg,
    marginBottom: Space.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Space.md,
  },
  profileInfo: { flex: 1 },
  profileName: { ...Typography.h3, marginBottom: Space.xs },
  profileEmail: { ...Typography.caption },
  editBtn: { padding: Space.xs },
  listCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Space.xl,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Space.lg,
    paddingHorizontal: Space.lg,
    gap: Space.md,
    borderBottomWidth: 1,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLabel: { ...Typography.body, flex: 1 },
  settingValue: { ...Typography.caption, marginRight: Space.xs, flexShrink: 1 },
  logOutWrap: {
    marginTop: Space.md,
    maxWidth: 200,
  },
  logOut: { alignSelf: 'stretch' },
  logOutText: { ...Typography.button },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Space.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: Radius.lg,
    padding: Space.lg,
  },
  modalTitle: { ...Typography.h2, marginBottom: Space.sm },
  modalSubtitle: { ...Typography.caption, marginBottom: Space.lg },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Space.md,
    paddingHorizontal: Space.lg,
    borderRadius: Radius.sm,
    marginBottom: Space.xs,
  },
  currencyOptionText: { ...Typography.body },
  categoryRow: {
    paddingVertical: Space.md,
    borderBottomWidth: 1,
  },
  categoryName: { ...Typography.body },
});
