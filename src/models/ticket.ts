class Ticket {
  id?: string | undefined;
  userId: string | null;
  filmId: string | null;
  seat: number[]; // vi tri ghe
  showTime: number; // ngay, gio chieu phim
  price: number;
  createdAt: number;

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args?.id ?? undefined;
    this.userId = args?.userId ?? '';
    this.filmId = args?.filmId ?? '';
    this.seat = args?.seat ?? [];
    this.showTime = args?.showTime ?? 0;
    this.price = args?.price ?? 0;
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
