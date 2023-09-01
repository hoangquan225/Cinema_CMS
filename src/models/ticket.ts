class Ticket {
  id?: string | undefined;
  userId: string | null;
  filmId: string | null;
  roomId: string | null;
  seat: number[]; // vi tri ghe
  showTime: number; // ngay, gio chieu phim
  price: number;
  paid: boolean;
  createdAt: number;

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args?.id ?? undefined;
    this.userId = args?.userId ?? '';
    this.filmId = args?.filmId ?? '';
    this.roomId = args?.roomId ?? '';
    this.seat = args?.seat ?? [];
    this.showTime = args?.showTime ?? 0;
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
