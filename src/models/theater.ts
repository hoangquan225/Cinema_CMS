class Theater {
    id?: string | undefined;
    name: string;
    nRoom: number;
    createdAt: number;
    type: number;//1: Thanh xuan, 2: Long Bien, 3: Royal city, 4: Time City, 5: Ha Dong, 6: Giai Phong
    provinceCode: string;
    location: string; //1: Thanh xuan, 2: Long Bien, 3: Royal city, 4: Time City, 5: Ha Dong, 6: Giai Phong

    constructor(args?: any) {
        if (!args) {
            args = {};
        }
        this.id = args?._id ?? args?.id ?? undefined;
        this.nRoom = args?.nRoom ?? 0;
        this.createdAt = args?.createdAt ?? 0;
        this.type = args?.type ?? null;
        this.provinceCode = args?.provinceCode ?? "";
        this.name = args?.name ?? "";
        this.location = args?.location ?? "";
    }
}

export { Theater };

