import {Button, FormControl, Input, Modal, View, Text, TextArea} from "native-base";
import React, {useState} from "react";
import {ItemProps} from "./Action";
import {IRemind, IRemindUsageSituation, Remind} from "../RemindMe/lib";
import {locale} from "../../Config/Locale";
import {StyleSheet} from "react-native";

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
  const usage = {
    canUseRange: item.page !== null,
    canUseMemo: item.memo !== null
  }

  const [remind, setRemind] = useState(new Remind(itemToRemindProps(item)));

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>
          {remind.title}
        </Modal.Header>
        <Modal.Body>
          <FormControl isRequired isInvalid={!remind.isValid()}>
            <FormControl.Label>{register.title}</FormControl.Label>
            <Input
              defaultValue={remind.title}
              value={remind.title}
              onChangeText={(text) => {
                setRemind(remind.setTitle(text))
              }}
            />
            <FormControl.ErrorMessage>
              only appear when FormControl have isInvalid props.
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>{register.page}</FormControl.Label>
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
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>{register.memo}</FormControl.Label>
            <TextArea
              h={20}
              onChangeText={(text) => setRemind(remind.setMemo(text))}
              defaultValue={remind.memo}
              value={remind.memo}
            />
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
              onPress={onCancel}
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