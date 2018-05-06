import { deleteNotice, getAllNoticeDate } from "../database";
import { cancelNotification } from "../notification";

export function cancel(target, id, notificationId) {
  const self = target
  deleteNotice(id, notificationId, cancelNotification)
  getAllNoticeDate(self)
}