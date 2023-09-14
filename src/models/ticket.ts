import { isObject } from "../utils/helpers";
import { Film } from "./film";
import { Schedule } from "./schedule";
import { UserInfo } from "./user";

class Ticket {
  id?: string | undefined;
  roomId: string | null;
  userId: string | null;
  userInfo: UserInfo | null;
  filmId: string | null;
  filmInfo: Film | null;
  scheduleId: string | null;
  scheduleInfo: Schedule | null;
  seat: number[]; // vi tri ghe
  showTime: string; // gio chieu phim
  showDate: number; // ngay chieu phim
  price: number;
  paid: boolean;
  createdAt: number;

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args?.id ?? undefined;
    this.roomId = args?.roomId ?? '';

    this.userId = isObject(args.userId) ? new UserInfo(args.userId)?.id : (args?.userId ?? undefined);
    this.userInfo = isObject(args.userId) ? new UserInfo(args.userId) : (args?.userInfo ?? undefined);
    this.filmId = isObject(args.filmId) ? new Film(args.filmId)?.id : (args?.filmId ?? undefined);
    this.filmInfo = isObject(args.filmId) ? new Film(args.filmId) : (args?.filmInfo ?? undefined);
    this.scheduleId = isObject(args.scheduleId) ? new Schedule(args.scheduleId)?.id : (args?.scheduleId ?? undefined);
    this.scheduleInfo = isObject(args.scheduleId) ? new Schedule(args.scheduleId) : (args?.scheduleInfo ?? undefined);
    
    this.seat = args?.seat ?? [];
    this.showTime = args?.showTime ?? '';
    this.showDate = args?.showDate ?? 0;
    this.price = args?.price ?? 0;
    this.paid = args?.paid ?? false;
    this.createdAt = args?.createdAt ?? Date.now();
  }
}

/**
 * ticket :
 *
 * userid
 * filmid
 * seat: number[]
 * date :
 * time :
 *
 */

export { Ticket };
