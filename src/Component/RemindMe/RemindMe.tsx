import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  VStack,
  Text,
  ScrollView,
  TextArea,
  Select,
  CheckIcon,
  ChevronDownIcon,
  Actionsheet,
} from "native-base";
import { locale } from "../../Config/Locale";
import {StyleSheet, View, Switch, Alert} from "react-native";
import { Remind, RepeatSetting } from "./lib";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../Router";
import { getNoticeIntervals, getTitlesAsync } from "../../IO/SQLite";
import { Loading } from "../BackGround";
import { str2int } from "../../Config/Libs";
import { resetToHome } from "../../Config/RouterLib";
import { TabKey } from "../../Config/Const";
import {UseCase} from "../../UseCase";

type Props = NativeStackScreenProps<RootStackParamList, "RemindMe">;

type InitState = {
  type: "Init";
};

const initState: InitState = {type: 'Init'};

type LoadedState = {
  type: "Loaded";
}

type TitleHistoryState = {
  titleHistory: string[];
} & LoadedState | InitState;

type RepeatState = {
  repeatSetting: RepeatSetting;
} & LoadedState | InitState;

type ModalState = {
  type: "Default" | "TitleSelect" | "NoticeSelect"
}

export const RemindMe = ({ navigation }: Props) => {
  const { register } = locale;
  const [remind, setRemind] = useState(
    new Remind({ title: "", memo: "", range: { start: 1, end: 1 } })
  );
  const [titleHistory, setHistory] = useState<TitleHistoryState>(initState);
  const [repeat, setRepeat] = useState<RepeatState>(initState);
  const [modal, setModal] = useState<ModalState>({type: "Default"});

  useEffect(() => {
    if (titleHistory.type === "Init") {
      getTitlesAsync().then((titleHistory) => setHistory({type: "Loaded", titleHistory}));
    }

    if (repeat.type === "Init") {
      getNoticeIntervals().then((noticeIntervals) => setRepeat({
        type: "Loaded",
        repeatSetting: new RepeatSetting({ownSettings: noticeIntervals})
      }))
    }
  });

  const [canUseRange, setUseRange] = useState(true);
  const [canUseMemo, setUseMemo] = useState(true);
  const [canUseRepeat, setUseRepeat] = useState(true);

  if (titleHistory.type === "Init" || repeat.type === "Init") {
    return <Loading />;
  }

  const handleTitleSelect = (selected: string) => () => {
    setRemind(remind.setTitle(selected));
    setModal({type: "Default"});
  };

  return (
    <View style={styles.topContainer}>
      <ScrollView>
        <Center>
          <Box safeArea p="1" w="90%" py="1">
            <VStack space={2} mt="5">
              <FormControl isRequired isInvalid={!remind.validTitle()}>
                <FormControl.Label>{register.title}</FormControl.Label>
                <Input
                  defaultValue={remind.title}
                  value={remind.title}
                  onChangeText={(text) => {
                    setRemind(remind.setTitle(text));
                  }}
                  InputRightElement={
                    <Button
                      style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                      w="15%"
                      h="100%"
                      onPress={() => setModal({type: "TitleSelect"})}
                    >
                      <ChevronDownIcon size="5" />
                    </Button>
                  }
                />
                <View style={{ height: 30 }}>
                  <FormControl.ErrorMessage pl="1">
                    {register.errTitle}
                  </FormControl.ErrorMessage>
                </View>

                <TitleSelector
                  titles={titleHistory.titleHistory}
                  isOpen={
                    modal.type === "TitleSelect"
                  }
                  onPress={handleTitleSelect}
                  onClose={() => setModal({type: "Default"})}
                />
              </FormControl>
              <FormControl mt="3">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <FormControl.Label>{register.page}</FormControl.Label>
                  <Switch
                    value={canUseRange}
                    onValueChange={(v) => {
                      setUseRange(v);
                    }}
                  />
                </View>
                {canUseRange ? (
                  <View style={styles.rangeView}>
                    <Input
                      keyboardType={"numeric"}
                      w={20}
                      defaultValue={String(remind.range.start)}
                      value={String(remind.range.start)}
                      onChangeText={(text) => {
                        setRemind(remind.setStartRange(str2int(text)));
                      }}
                    />
                    <Text style={styles.rangeText}>〜</Text>
                    <Input
                      keyboardType={"numeric"}
                      w={20}
                      defaultValue={String(remind.range.end)}
                      value={String(remind.range.end)}
                      onChangeText={(text) => {
                        setRemind(remind.setEndRange(str2int(text)));
                      }}
                    />
                  </View>
                ) : null}
              </FormControl>
              <FormControl mt="3">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <FormControl.Label>{register.memo}</FormControl.Label>
                  <Switch
                    value={canUseMemo}
                    onValueChange={(v) => {
                      setUseMemo(v);
                    }}
                  />
                </View>
                {canUseMemo ? (
                  <TextArea
                    h={20}
                    onChangeText={(text) => setRemind(remind.setMemo(text))}
                    defaultValue={remind.memo}
                    value={remind.memo}
                  />
                ) : null}
              </FormControl>
              <FormControl mt="3">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <FormControl.Label>{register.repeat}</FormControl.Label>
                  <Switch
                    value={canUseRepeat}
                    onValueChange={(v) => {
                      setUseRepeat(v);
                    }}
                  />
                </View>
                {canUseRepeat ? (
                  <NoticeSelecter
                    repeatSetting={repeat.repeatSetting}
                    onPress={(id) => {
                      setRepeat({
                        type: "Loaded",
                        repeatSetting: repeat.repeatSetting.setCurrentSetting(Number(id))
                      })
                    }}
                  />
                ) : null}
              </FormControl>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
      <Center>
        <Box p="1" w="90%" py="2">
          <Button.Group space={2}>
            <Button
              mt="2"
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => navigation.goBack()}
            >
              {register.cancel}
            </Button>
            <Button
              isDisabled={!remind.isValid()}
              onPress={async () => {
                await UseCase.registerRemind(
                  remind,
                  repeat.repeatSetting,
                  canUseRange,
                  canUseMemo,
                  canUseRepeat
                );
                Alert.alert(register.done, "", [
                  {
                    text: "OK",
                    onPress: () => {
                      resetToHome(navigation);
                      navigation.navigate(TabKey.Calendar);
                    },
                  },
                ]);
              }}
              mt="2"
              w="75%"
            >
              {register.registerButton}
            </Button>
          </Button.Group>
        </Box>
      </Center>
    </View>
  );
};

function TitleSelector({
  titles,
  isOpen,
  onPress,
  onClose,
}: {
  titles: string[];
  isOpen: boolean;
  onPress: (selected: string) => () => void;
  onClose: () => void;
}) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <ScrollView style={{ maxHeight: 200 }}>
          {titles.map((title) => (
            <Select.Item
              onPress={onPress(title)}
              label={title}
              value={title}
              key={title}
            />
          ))}
        </ScrollView>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

function NoticeSelecter({
  repeatSetting,
  onPress,
}: {
  repeatSetting: RepeatSetting;
  onPress: (value: string) => void;
}) {
  const selectedValue = String(repeatSetting.getCurrentSetting().id);
  return (
    <Select
      variant="underlined"
      selectedValue={selectedValue}
      _selectedItem={{
        bg: "emerald.500",
        endIcon: <CheckIcon size="5" />,
      }}
      mt={1}
      onValueChange={onPress}
    >
      {repeatSetting.ownSettings.map((setting) => (
        <Select.Item
          label={setting.name}
          value={String(setting.id)}
          key={setting.name}
        />
      ))}
    </Select>
  );
}

const styles = StyleSheet.create({
  topContainer: {flex: 1},
  rangeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  rangeText: { fontSize: 20, marginLeft: 30, marginRight: 30 },
});
