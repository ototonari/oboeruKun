import {Button, FormControl, Input, Modal, View, Text, TextArea} from "native-base";
import React, {useState} from "react";
import {ItemProps} from "./Action";
import {IRemind, Remind, updateRemindBody} from "../RemindMe/lib";
import {locale} from "../../Config/Locale";
import {Switch, StyleSheet} from "react-native";

type Props = {
  item: ItemProps;
  onEdit: () => void;
  onCancel: () => void;
}

const itemToRemindProps = (item: ItemProps): IRemind => {
  return {
    title: item.title,
    range: item.page ? {
      start: item.page.startPage,
      end: item.page.endPage
    } : {start: 0, end: 0},
    memo: item.memo ?? ""
  }
}

export const EditModal = ({item, onEdit, onCancel}: Props) => {
  const {register} = locale;

  const [remind, setRemind] = useState(new Remind(itemToRemindProps(item)));
  const [canUseRange, setUseRange] = useState(remind.isUseRange());
  const [canUseMemo, setUseMemo] = useState(remind.isUseMemo());

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header >
          {remind.title}
        </Modal.Header>
        <Modal.Body>
          <FormControl isRequired isInvalid={!remind.validTitle()}>
            <FormControl.Label>{register.title}</FormControl.Label>
            <Input
              defaultValue={remind.title}
              value={remind.title}
              onChangeText={(text) => {
                setRemind(remind.setTitle(text))
              }}
            />
            <View style={{height: 30}} >
              <FormControl.ErrorMessage>
                title must set.
              </FormControl.ErrorMessage>
            </View>
          </FormControl>
          <FormControl mt="3">
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <FormControl.Label>{register.page}</FormControl.Label>
              <Switch value={canUseRange} onValueChange={setUseRange} />
            </View>
            {canUseRange ? (
              <View style={styles.rangeView}>
                <Input
                  keyboardType={"numeric"}
                  w={20}
                  defaultValue={String(remind.range.start)}
                  value={String(remind.range.start)}
                  onChangeText={(text) => {
                    const n = Number(text)
                    setRemind(remind.setStartRange(n))
                  }}
                />
                <Text style={styles.rangeText}>
                  〜
                </Text>
                <Input
                  keyboardType={"numeric"}
                  w={20}
                  defaultValue={String(remind.range.end)}
                  value={String(remind.range.end)}
                  onChangeText={(text) => {
                    const n = Number(text)
                    setRemind(remind.setEndRange(n))
                  }}
                />
              </View>
            ) : null}
          </FormControl>
          <FormControl mt="3">
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <FormControl.Label>{register.memo}</FormControl.Label>
              <Switch value={canUseMemo} onValueChange={setUseMemo} />
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
              variant="ghost"
              colorScheme="blueGray"
              onPress={onCancel}
            >
              Cancel
            </Button>
            <Button
              onPress={async() => {
                await updateRemindBody(item.id, remind);
                onEdit()
              }}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

const styles = StyleSheet.create({
  rangeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  rangeText: { fontSize: 20, marginLeft: 30, marginRight: 30 }
})