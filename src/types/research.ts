export interface ResearchItem {
  title: string;
  subTitle: string;
  detail: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  hoverImage?: {
    backgroundImage: string;
    hoverImage: string;
    backgroundAlt: string;
    hoverAlt: string;
    width?: number;
    height?: number;
  };
}

export interface ResearchPageData {
  title: string;
  keywords: string[];
  introduction: {
    message?: string;
    paragraphs: string[];
  };
  researchItems: ResearchItem[];
  hasLanguageSelector?: boolean;
  customScripts?: string[];
}
