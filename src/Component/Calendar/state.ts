import {CalendarItemsProps} from "./Action";

type InitState = {
  type: 'Init'
}

export const initState: InitState = {
  type: "Init"
}

type BasicState = {
  type: 'Basic',
  items: CalendarItemsProps,
  targetDay: Date
}

type EditableState = {
  type: 'Editable',
  itemId: number,
  itemKey: string,
  items: CalendarItemsProps,
  targetDay: Date
}

export type ViewState = InitState | BasicState | EditableState
