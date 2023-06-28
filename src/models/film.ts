import AppConfig from '../common/config';

class Film {
  id?: string | undefined;
  name: string; //
  slug?: string;
  description: string;//
  content: string;
  videoUrl: string;//
  thumbnail: string;//
  category: number[];//
  director: string[]; // Đạo diễn
  actor: string[];//
  language: string;//
  startTime: number;//
  endTime: number;//
  heartTotal?: number;
  status: number;//
  runningTime: number;//
  schedule?: {
    [date: number]: [number];//
  };

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args?.id ?? undefined;
    this.name = args?.name ?? '';
    this.slug = args?.slug ?? '';
    this.description = args?.description ?? '';
    this.content = args?.content ?? '';
    this.videoUrl = args?.videoUrl ?? '';
    this.thumbnail = args?.thumbnail ?? '';
    this.category = args?.category ?? [];
    this.director = args?.director ?? [];
    this.actor = args?.actor ?? [];
    this.language = args?.language ?? '';
    this.startTime = args?.startTime ?? 0;
    this.runningTime = args?.runningTime ?? 0;
    this.endTime = args?.endTime ?? 0;
    this.heartTotal = args?.heartTotal ?? 0;
    this.status = args?.status ?? AppConfig.FilmsStatus.DRAFT;
    this.schedule = args?.schedule ?? {};
  }
}

export { Film };
