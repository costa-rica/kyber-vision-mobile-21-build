import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";
import ButtonKvStd from "../buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "../buttons/ButtonKvNoDefaultTextOnly";
import { useState } from "react";

export default function ModalAddPlayer({ addPlayerToTeam }) {
  const [playerObject, setPlayerObject] = useState({
    firstName: "",
    lastName: "",
    shirtNumber: null,
    position: "",
    positionAbbreviation: "",
  });

  const [positionArray, setPositionArray] = useState([
    { position: "Outside hitter", positionAbbreviation: "OH", selected: false },
    { position: "Middle blocker", positionAbbreviation: "MB", selected: false },
    { position: "Setter", positionAbbreviation: "SET", selected: false },
    { position: "Opposite", positionAbbreviation: "OPP", selected: false },
    { position: "Libero", positionAbbreviation: "L", selected: false },
    { position: "Flex", positionAbbreviation: "Flex", selected: false },
  ]);

  const handleSelectedPosition = (positionItem) => {
    const tempArray = [...positionArray];
    tempArray.forEach((item) => {
      if (item.position === positionItem.position) {
        item.selected = !item.selected;
      } else {
        item.selected = false;
      }
    });
    setPositionArray(tempArray);
    setPlayerObject({
      ...playerObject,
      position: positionItem.position,
      positionAbbreviation: positionItem.positionAbbreviation,
    });
  };

  const validatePlayer = () => {
    const { firstName, lastName, shirtNumber } = playerObject;

    if (!firstName.trim()) {
      alert("Please enter a player name.");
      return false;
    }

    if (!lastName.trim()) {
      alert("Please enter a player name.");
      return false;
    }

    const shirtNumberStr = shirtNumber?.toString() || "";
    const isValidNumber = /^\d{1,2}$/.test(shirtNumberStr);

    if (!isValidNumber) {
      alert("Shirt number must be 1 or 2 digits.");
      return false;
    }

    return true;
  };

  return (
    <View style={styles.modalContent}>
      {/* <Text style={{ fontSize: 18, marginBottom: 20 }}>Add Player</Text> */}
      <View style={styles.containerTop}>
        <View style={styles.vwInputs}>
          <View style={styles.vwInputGroupFirstName}>
            <View style={styles.vwInputGroupLabelMultipleFonts}>
              <Text style={styles.txtInputGroupLabel}>First Name</Text>
            </View>
            <View style={styles.vwInputWrapper}>
              <TextInput
                placeholder="Earvin"
                placeholderTextColor="gray"
                value={playerObject.firstName}
                onChangeText={(text) =>
                  setPlayerObject({ ...playerObject, firstName: text })
                }
                style={
                  playerObject.name === ""
                    ? styles.txtPlaceholder
                    : styles.txtInputRegular
                }
              />
            </View>
          </View>
          <View style={styles.vwInputGroupShirtNumber}>
            <View style={styles.vwInputGroupLabelMultipleFontsSuperScript}>
              <Text style={styles.txtInputGroupLabel}>N</Text>
              <Text style={styles.txtInputGroupLabelSuperScript}>o</Text>
            </View>
            <View style={styles.vwInputWrapper}>
              <TextInput
                placeholder="9"
                placeholderTextColor="gray"
                value={playerObject.shirtNumber}
                onChangeText={(text) =>
                  setPlayerObject({ ...playerObject, shirtNumber: text })
                }
                style={
                  playerObject.shirtNumber === ""
                    ? styles.txtPlaceholder
                    : styles.txtInputRegularShirtNumber
                }
              />
            </View>
          </View>
          <View style={styles.vwInputGroupLastName}>
            <View style={styles.vwInputGroupLabelMultipleFonts}>
              <Text style={styles.txtInputGroupLabel}>Last Name</Text>
            </View>
            <View style={styles.vwInputWrapper}>
              <TextInput
                placeholder="Ngapeth"
                placeholderTextColor="gray"
                value={playerObject.lastName}
                onChangeText={(text) =>
                  setPlayerObject({ ...playerObject, lastName: text })
                }
                style={
                  playerObject.name === ""
                    ? styles.txtPlaceholder
                    : styles.txtInputRegular
                }
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.containerMiddle}>
        {positionArray.map((item, index) => (
          <ButtonKvNoDefaultTextOnly
            onPress={() => {
              handleSelectedPosition(item);
            }}
            styleView={
              item.selected ? styles.btnPositionSelected : styles.btnPosition
            }
            styleText={
              item.selected
                ? styles.btnPositionTextSelected
                : styles.btnPositionText
            }
            key={index}
          >
            {item.position}
          </ButtonKvNoDefaultTextOnly>
        ))}
      </View>
      <View style={styles.containerBottom}>
        <ButtonKvStd
          onPress={() => {
            if (validatePlayer()) {
              addPlayerToTeam(playerObject);
            }
          }}
          style={styles.btnAddPlayer}
        >
          Add Player
        </ButtonKvStd>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    // width: "80%",
    width: Dimensions.get("window").width * 0.95,
    // height: Dimensions.get("window").height * 0.5,
    padding: 2,
    backgroundColor: "#D9CDD9",
    borderRadius: 10,
    alignItems: "center",
  },
  // ------------
  // Container Top
  // ------------
  containerTop: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  vwInputs: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    // gap: 10,
  },

  vwInputGroupFirstName: {
    alignItems: "flex-start",
    width: "80%",
  },
  vwInputGroupLastName: {
    alignItems: "flex-start",
    width: "100%",
  },
  vwInputGroupShirtNumber: {
    width: "15%",
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 10,
  },
  vwInputGroupLabelMultipleFonts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  vwInputGroupLabelMultipleFontsSuperScript: {
    flexDirection: "row",
    alignItems: "flex-start",
    // justifyContent: "space-between",
    // justifyContent: "center",
    // backgroundColor: "red",
    width: "100%",
  },
  txtInputGroupLabelRequired: {
    color: "red",
  },
  txtInputGroupLabelSuperScript: {
    fontSize: 8,
    // verticalAlign: "super",
  },
  vwInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 30,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  // txtInput: {
  //   flex: 1,
  //   paddingVertical: 15,
  //   paddingHorizontal: 10,
  //   color: "black",
  //   fontStyle: "italic",
  // },
  txtPlaceholder: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    color: "gray",
    fontStyle: "italic",
  },
  txtInputRegular: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    color: "black",
    fontStyle: "normal",
  },
  txtInputRegularShirtNumber: {
    flex: 1,
    height: 45,
    width: 20,
    // paddingVertical: 15,
    // paddingHorizontal: 10,
    color: "black",
    fontStyle: "normal",
  },
  txtInputShirtNumber: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 3,
    color: "black",
    fontStyle: "italic",
    textAlign: "center",
  },
  txtInputGroupLabel: {
    fontSize: 14,
    color: "#5B5B5B",
    paddingLeft: 15,
  },
  vwIconButton: {
    padding: 5,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },

  // ------------
  // Container Middle
  // ------------
  containerMiddle: {
    // height: 100,
    width: "100%",
    // borderWidth: 1,
    // borderColor: "gray",
    // borderStyle: "dashed",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    // paddingVertical: 10,
    marginTop: 15,
  },
  btnPosition: {
    // width: "100%",
    // width: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  btnPositionSelected: {
    // width: "100%",
    // width: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#806181",
  },
  btnPositionText: {
    color: "black",
    fontSize: 16,
    // fontWeight: "bold",
  },
  btnPositionTextSelected: {
    color: "white",
    fontSize: 16,
    // fontWeight: "bold",
  },

  // ------------
  // Container Bottom
  // ------------
  containerBottom: {
    marginTop: 30,
    marginBottom: 15,
  },
  btnAddPlayer: {
    backgroundColor: "#806181",
  },
});
