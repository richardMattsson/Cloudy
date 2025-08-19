import { useContext } from 'react';
import {
  Pressable,
  Image,
  StyleSheet,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { TempUnitContext } from '../TempUnitContext';
import cog from '../assets/cog-white.png';

function SettingsButton() {
  const { tempUnit, setTempUnit } = useContext(TempUnitContext);

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Avbryt',

          tempUnit === 'celsius'
            ? 'Ändra till Fahrenheit'
            : 'Ändra till Celsius',
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
    Platform.OS === 'ios' && (
      <Pressable onPress={onPress}>
        <Image style={styles.cogImage} source={cog} />
      </Pressable>
    )
  );
}

export default SettingsButton;

const styles = StyleSheet.create({
  cogImage: {
    width: 30,
    height: 30,
    marginTop: 50,
  },
});
