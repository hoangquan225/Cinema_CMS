import { isObject } from "../utils/helpers";
import { Film } from "./film";

class Schedule {
    id?: string | undefined;
    filmId: string | null;
    filmInfo: Film | null;
    romId: string | null;
    showTime: [string];
    showDate: number;
    startTime: number;
    endTime: number;
    nSeat: number;
    createdAt: number;

    constructor(args?: any) {
        if (!args) {
            args = {};
        }
        this.id = args?._id ?? args?.id ?? undefined;
        this.filmId = isObject(args.filmId) ? new Film(args.filmId)?.id : (args?.filmId ?? undefined);
        this.filmInfo = isObject(args.filmId) ? new Film(args.filmId) : (args?.filmInfo ?? undefined);
        this.romId = args?.romId ?? 0;
        this.showTime = args?.showTime ?? [];
        this.showDate = args?.showDate ?? 0;
        this.startTime = args?.startTime ?? 0;
        this.endTime = args?.endTime ?? 0;
        this.nSeat = args?.nSeat ?? 0;
        this.createdAt = args?.createdAt ?? 0;
    }
}

export { Schedule };

