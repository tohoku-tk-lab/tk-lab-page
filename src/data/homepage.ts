// Images
import balloonUnsplash from '../pages/_balloon-unsplash.jpg';
import carUnsplash from '../pages/_car-unsplash.jpg';
import city2Unsplash from '../pages/_city2-unsplash.jpg';
import cockpitUnsplash from '../pages/_cockpit-unsplash.jpg';
import type { HomepageData } from '../types/homepage.js';

export const homepageData: HomepageData = {
  hero: {
    title: '人間と機械の望ましい関係を目指して',
    subtitle:
      '高橋・狩川研究室では、人間が安全性確保において主要な役割を果たす大規模・複雑システムの安全性向上に向けた実践的な研究を行っています。',
    image: {
      src: city2Unsplash,
      alt: '都市の画像',
    },
  },
  featureCards: [
    {
      icon: 'mdi:magnify',
      title: '研究内容',
      description: '高橋・狩川研の研究内容を知る',
      href: '#research',
      ariaLabel: '研究内容について',
    },
    {
      icon: 'mdi:newspaper',
      title: 'ニュース',
      description: '高橋・狩川研の最近の様子を知る',
      href: '#news',
      ariaLabel: '新着情報',
    },
    {
      icon: 'mdi:information-slab-circle-outline',
      title: '特徴',
      description: '高橋・狩川研はこんな研究室です',
      href: '#aboutUs',
      ariaLabel: '研究室の特徴',
    },
  ],
  researchGroups: [
    {
      title: '航空',
      groupNumber: 'Group 01',
      href: '/research/aviation/',
      image: {
        src: cockpitUnsplash,
        alt: 'Cockpit Photo From Unsplash',
      },
    },
    {
      title: 'AI',
      groupNumber: 'Group 02',
      href: '/research/team-ai/',
      image: {
        src: carUnsplash,
        alt: 'Photo by Unsplash',
      },
    },
    {
      title: '認知',
      groupNumber: 'Group 03',
      href: '/research/cognitive/',
      image: {
        src: balloonUnsplash,
        alt: 'Photo by Unsplash',
      },
    },
  ],
  aboutFeatures: [
    {
      icon: 'mdi:plane-car',
      title:
        '航空システム、原子力プラント等の大規模複雑システムを対象にした実践的な研究',
      description: '',
    },
    {
      icon: 'mdi:worker',
      title: '人間の認知モデルや行動経済学的視点に基づく安全性向上に関する研究',
      description: '',
    },
    {
      icon: 'mdi:head-question-outline',
      title:
        '視覚系情報・心拍変動・脳活動等の生体情報に基づく人間状態推定技術の開発',
      description: '',
    },
    {
      icon: 'mdi:account-multiple-plus',
      title:
        '主観的リスク認知の考え方に基づく先端技術（AI,原子力）の社会受容に関する研究',
      description: '',
    },
  ],
  youtube: {
    id: 'nue-bLFGKK8',
  },
};

// アイコンサイズの定数
export const ICON_SIZE_BIG = 64;
