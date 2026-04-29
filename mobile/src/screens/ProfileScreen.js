import { StyleSheet, Text, View } from 'react-native'
import colors from '../theme/colors'

const ProfileScreen = ({ volunteer }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Volunteer Profile</Text>
      <View style={styles.row}>
        <Text style={styles.label}>First Name</Text>
        <Text style={styles.value}>{volunteer.firstName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Last Name</Text>
        <Text style={styles.value}>{volunteer.lastName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{volunteer.email}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{volunteer.phone}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  title: {
    color: colors.red,
    fontSize: 20,
    fontWeight: '700',
  },
  row: {
    gap: 2,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
})

export default ProfileScreen
