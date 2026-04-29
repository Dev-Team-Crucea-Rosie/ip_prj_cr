import { FlatList, StyleSheet, Text, View } from 'react-native'
import colors from '../theme/colors'

const statusLabel = (status) => {
  if (status === 'in_progress') {
    return 'In Progress'
  }

  if (status === 'done') {
    return 'Done'
  }

  return 'Pending'
}

const TaskCard = ({ task }) => (
  <View style={styles.card}>
    <Text style={styles.description}>{task.description}</Text>
    <Text style={styles.meta}>Status: {statusLabel(task.status)}</Text>
    <Text style={styles.meta}>Event: {task.eventName || `#${task.eventId}`}</Text>
  </View>
)

const TaskListScreen = ({ tasks }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <TaskCard task={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No tasks assigned yet.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    color: colors.red,
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    gap: 10,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  description: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
  },
  empty: {
    color: colors.muted,
    fontSize: 14,
    paddingTop: 8,
  },
})

export default TaskListScreen
