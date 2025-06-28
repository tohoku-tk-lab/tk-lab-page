import type { ImageMetadata } from 'astro';

export interface FeatureCardItem {
  icon: string;
  title: string;
  description: string;
  href: string;
  ariaLabel: string;
}

export interface ResearchGroupItem {
  title: string;
  groupNumber: string;
  href: string;
  image: {
    src: ImageMetadata;
    alt: string;
  };
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

export interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

export interface HomepageData {
  hero: {
    title: string;
    subtitle: string;
    image: {
      src: ImageMetadata;
      alt: string;
    };
  };
  featureCards: FeatureCardItem[];
  researchGroups: ResearchGroupItem[];
  aboutFeatures: AboutFeature[];
  youtube: {
    id: string;
  };
}
