import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import ButtonKvImage from "./buttons/ButtonKvImage";
import BackArrow from "../../assets/images/navigationAndSmall/btnTemplateViewBackArrow.svg";
// import { useNavigation } from "@react-navigation/native";
import ModalLoading from "./modals/ModalLoading";
import { useSelector } from "react-redux";

export default function TemplateViewWithTopChildren({
  children,
  navigation,
  topChildren,
  screenName,
  isVisibleModal = false,
  setDisplayModal = () => {},
  modalComponent = null,
  // isVisibleModalLoading = false,
  onBackPress = () => {
    return true;
  },
}) {
  const uploadReducer = useSelector((state) => state.upload);
  const handleBackPress = async () => {
    const goBack = onBackPress();
    if (goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <Image
          source={require("../../assets/images/imgBackgroundBottomFade.png")}
        />

        {navigation && (
          <View style={styles.btnBack}>
            <ButtonKvImage
              onPress={() => {
                handleBackPress();
              }}
            >
              <BackArrow style={styles.svgBackArrow} />
            </ButtonKvImage>
          </View>
        )}
        <View style={styles.vwLogoAndTopChildren}>
          <Image
            source={require("../../assets/images/KyberV2Shiny.png")}
            style={styles.imgLogo}
          />
          {screenName && <Text style={{ color: "white" }}>{screenName}</Text>}
          {topChildren}
        </View>
      </View>
      <View style={styles.containerBottom}>{children}</View>

      {isVisibleModal && (
        <TouchableWithoutFeedback onPress={() => setDisplayModal(false)}>
          <View style={styles.modalOverlay}>
            <View onStartShouldSetResponder={() => true}>{modalComponent}</View>
          </View>
        </TouchableWithoutFeedback>
      )}
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
    height: "35%",
  },
  btnBack: {
    position: "absolute",
    top: 50,
    left: 20,
  },

  vwLogoAndTopChildren: {
    position: "absolute",
    bottom: 0,

    alignItems: "center",
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
  },

  modalContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
