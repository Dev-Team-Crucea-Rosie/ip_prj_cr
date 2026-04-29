import { useMemo, useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable } from 'react-native'
import CameraPermissionScreen from './src/screens/CameraPermissionScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import TaskListScreen from './src/screens/TaskListScreen'
import { tasks, volunteer } from './src/data/mockData'
import colors from './src/theme/colors'

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'camera', label: 'Camera' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('profile')

  const content = useMemo(() => {
    if (activeTab === 'tasks') {
      return <TaskListScreen tasks={tasks} />
    }

    if (activeTab === 'camera') {
      return <CameraPermissionScreen />
    }

    return <ProfileScreen volunteer={volunteer} />
  }, [activeTab])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>CR S3 Mobile</Text>
        <Text style={styles.headerSubtitle}>Volunteer Management</Text>

        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab

            return (
              <Pressable
                key={tab.key}
                style={[styles.tabButton, isActive ? styles.tabButtonActive : null]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive ? styles.tabTextActive : null]}>{tab.label}</Text>
              </Pressable>
            )
          })}
        </View>

        {content}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 14,
  },
  headerTitle: {
    fontSize: 24,
    color: colors.red,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButtonActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  tabText: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: colors.surface,
  },
})
