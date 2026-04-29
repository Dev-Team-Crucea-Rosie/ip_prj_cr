import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Camera } from 'expo-camera'
import colors from '../theme/colors'

const CameraPermissionScreen = () => {
  const [status, setStatus] = useState('undetermined')
  const [loading, setLoading] = useState(true)

  const loadPermissionStatus = async () => {
    setLoading(true)

    try {
      const permission = await Camera.getCameraPermissionsAsync()
      setStatus(permission.status)
    } catch {
      setStatus('denied')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPermissionStatus()
  }, [])

  const requestPermission = async () => {
    setLoading(true)

    try {
      const permission = await Camera.requestCameraPermissionsAsync()
      setStatus(permission.status)
    } catch {
      setStatus('denied')
    } finally {
      setLoading(false)
    }
  }

  const isGranted = status === 'granted'

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Camera Permission</Text>
      <Text style={styles.message}>
        {loading
          ? 'Checking camera permission...'
          : isGranted
            ? 'Camera permission granted.'
            : 'Camera permission denied or not granted yet.'}
      </Text>
      <Pressable style={styles.button} onPress={requestPermission}>
        <Text style={styles.buttonText}>Request Camera Permission</Text>
      </Pressable>
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
    gap: 12,
  },
  title: {
    color: colors.red,
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    color: colors.text,
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default CameraPermissionScreen
