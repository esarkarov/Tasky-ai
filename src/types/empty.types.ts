interface IImg {
  src: string;
  width: number;
  height: number;
}

export interface IEmptyStateContent {
  img?: IImg;
  title: string;
  description: string;
}
