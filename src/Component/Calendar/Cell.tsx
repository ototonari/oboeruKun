import React, { useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { ItemProps } from "./Action";
import { locale } from "../../Config/Locale";
import { Icon, Pressable } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { UseCase } from "../../UseCase";

interface CellPropsI {
  item: ItemProps;
  onEdit: (id: number, key: string) => void;
  onComplete: () => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const ACTIONS_WIDTH = 150;
const ACTIONS_TIME = 250;

function expandAnimation(value: Animated.Value) {
  Animated.timing(value, {
    toValue: -ACTIONS_WIDTH,
    duration: ACTIONS_TIME,
    useNativeDriver: true,
  }).start();
}

function closeAnimaiton(value: Animated.Value) {
  Animated.timing(value, {
    toValue: 0,
    duration: ACTIONS_TIME,
    useNativeDriver: true,
  }).start();
}

function Cell(props: CellPropsI) {
  const { data } = locale;
  const { item, onEdit, onComplete } = props;
  const { data: remind } = item;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedStyle = { transform: [{ translateX: animatedValue }] };
  const [isExpand, setExpand] = useState(false);

  const _onComplete = async () => {
    await UseCase.completeNotice(item.id, item.noticeDate);
    await onComplete();
  };

  const _onEdit = () => {
    setExpand(false);
    closeAnimaiton(animatedValue);
    onEdit(item.id, item.noticeDate);
  };

  const onTapItem = () => {
    if (!isExpand) {
      expandAnimation(animatedValue);
    } else {
      closeAnimaiton(animatedValue);
    }
    setExpand(!isExpand);
  };

  return (
    <Animated.View
      style={[
        styles.cellPosition,
        { flexDirection: "row", alignItems: "center" },
        animatedStyle,
      ]}
    >
      <TouchableOpacity onPress={onTapItem}>
        <View style={[styles.item, { width: SCREEN_WIDTH }]}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {remind.title}
          </Text>
          {remind.isUseRange() ? (
            <Text>
              {data.page}: {remind.range.start} ~ {remind.range.end}
            </Text>
          ) : null}
          {remind.isUseMemo() ? (
            <Text>
              {data.memo}: {remind.memo}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <Pressable mr="25" onPress={_onEdit}>
          <Icon
            as={AntDesign}
            name="edit"
            size="6"
            color="emerald.500"
            onPress={_onEdit}
          />
        </Pressable>
        <Pressable onPress={_onComplete}>
          <Icon
            onPress={_onComplete}
            as={AntDesign}
            name="checkcircle"
            size="6"
            color="emerald.500"
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
  },
  cellPosition: {
    position: "relative",
    top: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    height: "100%",
    width: ACTIONS_WIDTH,
    left: SCREEN_WIDTH,
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute",
  },
});

export default Cell;
