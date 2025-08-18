import { useContext } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  ActionSheetIOS,
} from 'react-native';
import { TempUnitContext } from '../TempUnitContext';

function SettingsButton() {
  const { tempUnit, setTempUnit } = useContext(TempUnitContext);

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Cancel',

          tempUnit === 'celsius' ? 'Change to Fahrenheit' : 'Change to Celsius',
          // 'Reset',
        ],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
        }
      }
    );
  return (
    <View style={styles.containerSettingBtn}>
      <Pressable onPress={onPress} style={styles.settingBtn}>
        <Text style={styles.textSearchButton}>Inställningar</Text>
      </Pressable>
    </View>
  );
}

export default SettingsButton;

const styles = StyleSheet.create({
  containerSettingBtn: {
    alignItems: 'center',
  },
  settingBtn: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '30%',
  },
});
