class Schedule {
    id?: string | undefined;
    filmId: string | null;
    romId: string | null;
    showTime: [string];
    seat: number;

    constructor(args?: any) {
        if (!args) {
            args = {};
        }
        this.id = args?._id ?? args?.id ?? undefined;
        this.filmId = args?.filmId ?? '';
        this.romId = args?.romId ?? 0;
        this.showTime = args?.showTime ?? [];
        this.seat = args?.seat ?? 0;
    }
}

export { Schedule };

