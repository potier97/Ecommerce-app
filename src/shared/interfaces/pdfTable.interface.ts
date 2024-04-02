export interface IPdfTable<T> {
  title: string;
  titleFontSize: number;
  subtitle: string;
  subtitleFontSize: number;
  header: string[];
  headerFontSize: number;
  headerFontFamily: string;
  contentFontSize: number;
  contentFontFamily: string;
  spacing: number[];
  initWidth: number[];
  nameRow: string[];
  aling: string[];
  yOffset: number;
  xInit: number;
  resumeRows: number;
  tablePosition: number;
  content: T[];
}
