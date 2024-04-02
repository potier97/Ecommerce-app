export interface IContentDescriptionPdf {
  label?: string;
  value?: string;
  xValue?: number;
}

export interface IDescriptionPdf {
  title: string;
  titleFontSize: number;
  titleFont: string;
  descriptionPosition: number;
  yOffset: number;
  columns: number;
  //PERMITIR QUE SEA IContentDescriptionPdf o que este vacio
  content: IContentDescriptionPdf[];
  contentFontSize: number;
}
