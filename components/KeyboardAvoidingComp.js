import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function KeyboardAvoidingViewComp({ children }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {children}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardAvoidingViewComp;
