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
import { StyleSheet, View, Switch } from "react-native";
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

type OptionProps = {
  titleHistory: string[];
  repeatSetting: RepeatSetting;
};

type LoadedState = {
  type: "Loaded";
} & OptionProps;

type ModalState = {
  type: "Modal";
  screen: "TitleSelect" | "NoticeSelect";
} & OptionProps;

type ViewState = InitState | LoadedState | ModalState;

export const RemindMe = ({ navigation }: Props) => {
  const { register } = locale;
  const [remind, setRemind] = useState(
    new Remind({ title: "", memo: "", range: { start: 1, end: 1 } })
  );
  const [viewState, setViewState] = useState<ViewState>({ type: "Init" });
  useEffect(() => {
    if (viewState.type === "Init") {
      Promise.all([getTitlesAsync(), getNoticeIntervals()]).then(
        ([titles, noticeIntervals]) => {
          const repeatSetting = new RepeatSetting({
            ownSettings: noticeIntervals,
          });
          setViewState({
            type: "Loaded",
            titleHistory: titles,
            repeatSetting: repeatSetting,
          });
        }
      );
    }
  });

  const [canUseRange, setUseRange] = useState(true);
  const [canUseMemo, setUseMemo] = useState(true);
  const [canUseRepeat, setUseRepeat] = useState(true);

  if (viewState.type === "Init") {
    return <Loading />;
  }

  const { repeatSetting, titleHistory } = viewState;

  const handleTitleSelect = (selected: string) => () => {
    setRemind(remind.setTitle(selected));
    setViewState({
      ...viewState,
      type: "Loaded",
    });
  };

  return (
    <Box flex="1">
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
                      onPress={() =>
                        setViewState({
                          ...viewState,
                          type: "Modal",
                          screen: "TitleSelect",
                        })
                      }
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
                  titles={titleHistory}
                  isOpen={
                    viewState.type === "Modal" &&
                    viewState.screen === "TitleSelect"
                  }
                  onPress={handleTitleSelect}
                  onClose={() =>
                    setViewState({
                      ...viewState,
                      type: "Loaded",
                    })
                  }
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
                    repeatSetting={repeatSetting}
                    onPress={(id) => {
                      setViewState({
                        ...viewState,
                        repeatSetting:
                          viewState.repeatSetting.setCurrentSetting(Number(id)),
                      });
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
                  repeatSetting,
                  canUseRange,
                  canUseMemo,
                  canUseRepeat
                );
                resetToHome(navigation);
                navigation.navigate(TabKey.Calendar);
              }}
              mt="2"
              w="75%"
            >
              {register.registerButton}
            </Button>
          </Button.Group>
        </Box>
      </Center>
    </Box>
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
  rangeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  rangeText: { fontSize: 20, marginLeft: 30, marginRight: 30 },
});
