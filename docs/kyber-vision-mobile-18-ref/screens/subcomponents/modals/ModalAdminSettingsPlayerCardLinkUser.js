import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import ButtonKvStd from "../buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "../buttons/ButtonKvNoDefaultTextOnly";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateSquadMembersArray } from "../../../reducers/team";

export default function ModalAdminSettingsPlayerCardLinkUser({
  playerObject,
  setIsVisibleLinkUserModal,
  setPlayerObject,
}) {
  const userReducer = useSelector((state) => state.user);
  const teamReducer = useSelector((state) => state.team);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  // const [userObject, setUserObject] = useState(null);
  const [userObject, setUserObject] = useState(playerObject);
  const [filteredUsersArray, setFilteredUsersArray] = useState(
    teamReducer.squadMembersArray
  );
  const [isAlreadyLinked, setIsAlreadyLinked] = useState(playerObject.isUser);

  const filterUsers = (searchTerm) => {
    const filteredUsers = teamReducer.squadMembersArray.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsersArray(filteredUsers);
  };

  const handleLinkUser = () => {
    if (isAlreadyLinked) {
      Alert.alert(
        "Confirm Link User",
        `Are you sure you want to link ${userObject.username} to ${playerObject.firstName} ${playerObject.lastName}?`,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Link",
            onPress: () => sendLinkUserRequest(),
          },
        ]
      );
    } else if (userObject?.isPlayer) {
      Alert.alert(
        "User is already linked",
        `User ${userObject.username} is already linked to ${userObject.playerId}.`,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Re-link",
            onPress: () => sendLinkUserRequest(),
          },
        ]
      );
    } else {
      sendLinkUserRequest();
    }
  };

  const sendLinkUserRequest = async () => {
    const bodyObj = {
      playerId: playerObject.id,
      userId: userObject.userId,
    };

    const response = await fetch(
      // `${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/link-user-to-team-as-player`,
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-player-user/link-user-to-player`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`,
        },
        body: JSON.stringify(bodyObj),
      }
    );

    console.log("Received response:", response.status);
    let resJson = null;
    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      resJson = await response.json();
    }

    if (response.ok && resJson) {
      // Make alert close the modal
      Alert.alert(
        "User linked successfully",
        "", // optional message
        [
          {
            text: "OK",
            onPress: () => {
              const tempObject = {
                ...playerObject,
                username: userObject.username,
                userId: userObject.userId,
                isUser: true,
                // isUser: userObject.isUser,
                // role: userObject.role,
              };

              setPlayerObject(tempObject);
              const tempSquadMembersArray = teamReducer.squadMembersArray.map(
                (user) => {
                  if (user.id === userObject.id) {
                    return userObject;
                  }
                  return user;
                }
              );
              dispatch(updateSquadMembersArray(tempSquadMembersArray));
              setIsVisibleLinkUserModal(false);
            },
          },
        ]
      );
    } else {
      const errorMessage =
        resJson?.error ||
        `There was a server error (and no resJson): ${response.status}`;
      alert(errorMessage);
    }
    // };
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.vwModalTitle}>
        <Text style={styles.txtModalTitle}>
          Link{" "}
          <Text style={styles.txtModalTitleTeamName}>
            {playerObject.firstName} {playerObject.lastName}
          </Text>{" "}
          to:
        </Text>
      </View>

      <View style={styles.vwInputAndButton}>
        <View style={styles.vwInputWithLabel}>
          <View style={styles.vwInputWithLabelForUnderline}>
            <Text style={styles.txtInputLabel}>username:</Text>
            <TextInput
              placeholder="volleyballer01"
              style={styles.txtInputSearchTerm}
              value={searchTerm}
              onChangeText={(searchTerm) => {
                setSearchTerm(searchTerm);
                filterUsers(searchTerm);
              }}
            />
          </View>
        </View>
        <ButtonKvNoDefaultTextOnly
          onPress={() => {
            // console.log("Yes ....");
            if (userObject?.username) {
              // onPressYes(userObject);
              handleLinkUser();
            } else {
              Alert.alert("Username is required");
            }
          }}
          styleView={styles.btnLinkUser}
          styleText={styles.txtBtnLinkUser}
        >
          {isAlreadyLinked ? "Re-link" : "Link"}
        </ButtonKvNoDefaultTextOnly>
        {/* <Text style={{ fontSize: 10 }}>{JSON.stringify(userObject)}</Text> */}
      </View>
      <View style={styles.vwUsersFlatListContainer}>
        <FlatList
          data={filteredUsersArray}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.touchableOpacityUserRow,
                userObject?.userId === item.userId &&
                  styles.touchableOpacityUserRowSelected,
              ]}
              onPress={() => setUserObject(item)}
            >
              <Text
                style={[
                  styles.txtUserItem,
                  userObject?.userId === item.userId &&
                    styles.txtUserItemSelected,
                ]}
              >
                {item.username}
              </Text>
              <Text style={styles.txtUserId}>user id: {item.userId}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    // justifyContent: "center",
    padding: 10,
    backgroundColor: "#D9CDD9",
    zIndex: 1,
  },
  // Make the title inline
  vwModalTitle: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    flexShrink: 1,
  },
  txtModalTitle: {
    fontSize: 18,
    textAlign: "center",
  },
  txtModalTitleTeamName: {
    textDecorationLine: "underline",
    textDecorationColor: "black", // optional, defaults to text color
  },
  vwInputAndButton: {
    width: "100%",
    gap: 10,
    marginTop: 10,
    alignItems: "center",
  },
  vwInputWithLabel: {
    backgroundColor: "white",
    padding: 5,
    width: "100%",
  },

  vwInputWithLabelForUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: "#806181",
    // marginBottom: 10,
  },
  txtInputLabel: {
    // fontSize: 16,
    // marginBottom: 5,
    color: "gray",
  },
  txtInputSearchTerm: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 5,
    // textDecorationLine: "underline",
  },
  btnLinkUser: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 20,
    color: "white",
    backgroundColor: "#E8E8E8",
    borderColor: "#806181",
    borderWidth: 2,
    padding: 5,
  },
  txtBtnLinkUser: {
    fontSize: 24,
    color: "#806181",
    justifyContent: "center",
    alignItems: "center",
  },
  vwUsersFlatListContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    // alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    // height: 200,
  },

  touchableOpacityUserRow: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    // height: 40,
    justifyContent: "space-between",
    // alignItems: "center",
    // backgroundColor: "green",
    // borderBottomWidth: 1,
    // borderBottomColor: "#806181",
  },
  touchableOpacityUserRowSelected: {
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  txtUserItem: {
    fontSize: 16,
    color: "black",
    // backgroundColor: "red",
  },
  txtUserItemSelected: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  txtUserId: {
    // fontSize: 16,
    color: "gray",
    fontStyle: "italic",
    // backgroundColor: "red",
  },
});
