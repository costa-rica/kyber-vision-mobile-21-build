import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from "react-native";
import ButtonKvImage from "./buttons/ButtonKvImage";
import ButtonKvNoDefault from "./buttons/ButtonKvNoDefault";
import BackArrow from "../../assets/images/navigationAndSmall/btnTemplateViewBackArrow.svg";
import { useNavigation } from "@react-navigation/native";
import KyberVisionLogoCrystal from "../../assets/images/KyberVisionLogoCrystal.svg";
import BtnCircleQuestionMark from "../../assets/images/btnCircleQuestionMark.svg";
import ModalLoading from "./modals/ModalLoading";
import { useSelector } from "react-redux";
export default function TemplateViewWithTopChildrenSmallLandscape({
  children,
  navigation,
  topChildren,
  sizeOfLogo = 30,
  topHeight = 1,
  screenName,
  modalComponentAndSetterObject = {
    modalComponent: null,
    useState: false,
    useStateSetter: () => {},
  },
  onBackPress = () => {},
}) {
  // const uploadReducer = useSelector((state) => state.upload);
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

  // styles
  const stylesContainerTop = {
    position: "relative",
    height: topHeight,
    // height: 80,
    width: "100%",
  };
  // const stylesVwTopContent = {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   width: "100%",
  //   // height: 100,
  //   flexDirection: "row",
  //   // backgroundColor: "red",
  //   // zIndex: 1,
  //   // alignItems: "center",
  //   // justifyContent: "center",
  // };
  const stylesVwBackgroundTopLeftImage = {
    width: Dimensions.get("window").width * 0.3,
    height: "100%",
    borderBottomRightRadius: 10,
    overflow: "hidden",
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "red",
  };
  const stylesVwBackgroundTopRightImage = {
    width: Dimensions.get("window").width * 0.1,
    height: "100%",
    justifyContent: "flex-end",
    borderBottomLeftRadius: 10,
    overflow: "hidden",
  };

  return (
    <View style={styles.container}>
      <View style={stylesContainerTop}>
        {/* <View style={styles.vwBackgroundTop}></View> */}
        <View style={styles.vwBackgroundTop}>
          <View style={stylesVwBackgroundTopLeftImage}>
            <Image
              source={require("../../assets/images/imgBackgroundBottomFade.png")}
              style={styles.imgBackgroundTop}
            />
            <View style={styles.vwOpaqueCover} />

            <View style={styles.vwForegroundTopLeftImage}>
              <View style={styles.btnBack}>
                <ButtonKvImage
                  onPress={() => {
                    handleBackPress();
                  }}
                >
                  <BackArrow style={styles.svgBackArrow} />
                </ButtonKvImage>
              </View>
              <View style={styles.vwLogoAndLiveScriptingText}>
                <View style={styles.vwLogoCrystal}>
                  <KyberVisionLogoCrystal
                    width={sizeOfLogo}
                    height={sizeOfLogo}
                  />
                </View>
                <View style={styles.vwLiveScriptingText}>
                  <Text style={styles.txtLiveScripting}>Live Scripting</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.vwTopContent}>{topChildren}</View>
          <View style={stylesVwBackgroundTopRightImage}>
            <Image
              source={require("../../assets/images/imgBackgroundBottomFade.png")}
              style={styles.imgBackgroundTop}
              // resizeMode="center"
            />
            <View style={styles.vwBtnCircleQuestionMark}>
              <ButtonKvNoDefault
                onPress={() => {
                  alert("What do we put here ?");
                }}
                styleView={styles.btnCircleQuestionMark}
              >
                <BtnCircleQuestionMark width={40} height={40} />
              </ButtonKvNoDefault>
            </View>
            <View style={styles.vwOpaqueCover} />
          </View>
        </View>
        {/* <View style={stylesVwTopContent}>
          <View style={styles.btnBack}>
            <ButtonKvImage
              onPress={() => {
                handleBackPress();
              }}
            >
              <BackArrow style={styles.svgBackArrow} />
            </ButtonKvImage>
          </View>
        </View> */}
        {/* )} */}
      </View>
      <View style={styles.containerBottom}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // containerTop: {
  //   height: 1,
  // },
  vwBackgroundTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    backgroundColor: "#806181",
  },
  vwForegroundTopLeftImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 3,
  },
  vwOpaqueCover: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.5,
  },

  vwLogoAndLiveScriptingText: {
    flexDirection: "row",
    gap: 10,
  },
  txtLiveScripting: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  vwTopContent: {
    // backgroundColor: "red",
    flex: 1,
    // height: "100%",
    // width: "100%",
  },

  vwBtnCircleQuestionMark: {
    position: "absolute",
    top: 5,
    right: 30,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  btnCircleQuestionMark: {
    // position: "absolute",
    // top: 5,
    // right: 30,
    // zIndex: 3,
    backgroundColor: "transparent",
  },

  containerBottom: {
    flex: 1,
    // backgroundColor: "blue",
    // height: 100,
    flexDirection: "row",
  },
});
