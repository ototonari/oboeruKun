import {
  Button,
  FormControl,
  Input,
  Modal,
  View,
  Text,
  TextArea,
} from "native-base";
import React, { useState } from "react";
import { ItemProps } from "./Action";
import { locale } from "../../Config/Locale";
import { Switch, StyleSheet } from "react-native";
import { UseCase } from "../../UseCase";

type Props = {
  item: ItemProps;
  onEdit: () => void;
  onCancel: () => void;
};

export const EditModal = ({ item, onEdit, onCancel }: Props) => {
  const { register } = locale;

  const [remind, setRemind] = useState(item.data.clone());
  const [canUseRange, setUseRange] = useState(remind.isUseRange());
  const [canUseMemo, setUseMemo] = useState(remind.isUseMemo());

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <Modal.Content h="90%" w="90%">
        <Modal.CloseButton />
        <Modal.Header>{remind.title}</Modal.Header>
        <Modal.Body>
          <FormControl isRequired isInvalid={!remind.validTitle()}>
            <FormControl.Label>{register.title}</FormControl.Label>
            <Input
              defaultValue={remind.title}
              value={remind.title}
              onChangeText={(text) => {
                setRemind(remind.setTitle(text));
              }}
            />
            <View style={{ height: 30 }}>
              <FormControl.ErrorMessage>
                title must set.
              </FormControl.ErrorMessage>
            </View>
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
                  if (!v) setRemind(remind.clearRange());
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
                    const n = Number(text);
                    setRemind(remind.setStartRange(n));
                  }}
                />
                <Text style={styles.rangeText}>〜</Text>
                <Input
                  keyboardType={"numeric"}
                  w={20}
                  defaultValue={String(remind.range.end)}
                  value={String(remind.range.end)}
                  onChangeText={(text) => {
                    const n = Number(text);
                    setRemind(remind.setEndRange(n));
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
                  if (!v) setRemind(remind.clearMemo());
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
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              mt="2"
              variant="ghost"
              colorScheme="blueGray"
              onPress={onCancel}
            >
              {register.cancel}
            </Button>
            <Button
              mt="2"
              w="60%"
              isDisabled={remind.areEqual(item.data)}
              onPress={async () => {
                await UseCase.updateRemind(item.id, remind, item.data);
                await onEdit();
              }}
            >
              {register.edit}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rangeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  rangeText: { fontSize: 20, marginLeft: 30, marginRight: 30 },
});
