import { useContext, useState } from 'react';
import {
  Pressable,
  Image,
  StyleSheet,
  Platform,
  ActionSheetIOS,
  Modal,
  Alert,
  View,
  Text,
} from 'react-native';
import { TempUnitContext } from '../contexts/TempUnitContext';
import cog from '../assets/cog-white.png';

function SettingsButton() {
  const { tempUnit, setTempUnit } = useContext(TempUnitContext);

  const [modalVisible, setModalVisible] = useState(false);

  function onChange() {
    setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
    setModalVisible(!modalVisible);
  }

  const onPressIOS = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Avbryt',
          tempUnit === 'celsius'
            ? 'Ändra till Fahrenheit'
            : 'Ändra till Celsius',
        ],
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
        }
      }
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Pressable onPress={onPressIOS}>
          <Image style={styles.cogImage} source={cog} />
        </Pressable>
      )}
      {Platform.OS === 'android' && (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={[styles.button, styles.buttonChange]}
                  onPress={onChange}
                >
                  <Text style={styles.textStyle}>
                    {tempUnit === 'celsius'
                      ? 'Ändra till Fahrenheit, F°'
                      : 'Ändra till Celsius, C°'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Avbryt</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image style={styles.cogImage} source={cog} />
          </Pressable>
        </>
      )}
    </>
  );
}

export default SettingsButton;

const styles = StyleSheet.create({
  cogImage: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#021d2cff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    gap: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonChange: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    width: 195,
    borderColor: 'green',
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    width: 100,
    borderWidth: 2,
    borderColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
