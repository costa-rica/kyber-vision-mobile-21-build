import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import ButtonKvImage from "./buttons/ButtonKvImage";
import BackArrow from "../../assets/images/navigationAndSmall/btnTemplateViewBackArrow.svg";
import { useNavigation } from "@react-navigation/native";
import KyberVisionLogoCrystal from "../../assets/images/KyberVisionLogoCrystal.svg";
import ModalLoading from "./modals/ModalLoading";
import { useSelector } from "react-redux";
export default function TemplateViewWithTopChildrenSmall({
  children,
  navigation,
  topChildren,
  sizeOfLogo = 40,
  topHeight = "15%",
  screenName,
  modalComponentAndSetterObject = {
    modalComponent: null,
    useState: false,
    useStateSetter: () => {},
  },
  // onBackPress = () => {},
  onBackPress = () => {
    return true;
  },
}) {
  const uploadReducer = useSelector((state) => state.upload);
  // const handleBackPress = async () => {
  //   onBackPress();
  //   navigation.goBack();
  // };
  const handleBackPress = async () => {
    const goBack = await onBackPress();
    if (goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.containerTop, { height: topHeight }]}>
        <Image
          source={require("../../assets/images/imgBackgroundBottomFade.png")}
        />

        {navigation && (
          <View style={styles.btnBack}>
            <ButtonKvImage
              onPress={async () => {
                await handleBackPress();
              }}
            >
              <BackArrow style={styles.svgBackArrow} />
            </ButtonKvImage>
          </View>
        )}
        <View style={styles.vwLogoTopRight}>
          <KyberVisionLogoCrystal width={sizeOfLogo} height={sizeOfLogo} />
        </View>
        <View style={styles.vwTopChildren}>
          {screenName && <Text style={{ color: "white" }}>{screenName}</Text>}
          {topChildren}
        </View>
      </View>
      <View style={styles.containerBottom}>{children}</View>
      {modalComponentAndSetterObject.useState && (
        <TouchableWithoutFeedback
          onPress={() => modalComponentAndSetterObject.useStateSetter(false)}
        >
          <View style={styles.modalOverlay}>
            <View onStartShouldSetResponder={() => true}>
              {modalComponentAndSetterObject.modalComponent}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* {isVisibleModal && (
        <TouchableWithoutFeedback onPress={() => setDisplayModal(false)}>
          <View style={styles.modalOverlay}>
            <View onStartShouldSetResponder={() => true}>{modalComponent}</View>
          </View>
        </TouchableWithoutFeedback>
      )} */}
      {/* {isVisibleModalLoading && ( */}
      {uploadReducer.uploadReducerLoading && (
        <View style={styles.modalOverlay}>
          <ModalLoading />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerTop: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  btnBack: {
    position: "absolute",
    top: 50,
    left: 10,
  },
  vwLogoTopRight: {
    position: "absolute",
    top: 30,
    right: 10,
    // backgroundColor: "red",
  },
  vwTopChildren: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    // justifyContent: "center",
    // flexDirection: "row",
    // gap: 20,
  },
  containerBottom: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  // ------------
  // Modal
  // ------------

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  modalContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
});
