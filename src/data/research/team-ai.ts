import type { ResearchPageData } from '../../types/research.js';

export const teamAiData: ResearchPageData = {
  title: 'AIグループ',
  keywords: [
    'Driving simulator',
    'Heart Rate Variability',
    'Frustration',
    'Machine Learning',
    'Adaptive Automation',
    'Physiological Indicator',
    'Automatic Operation',
    'AI',
  ],
  introduction: {
    message:
      'ドライビングシミュレータなど<br/>自動車に関する研究を行っています。',
    paragraphs: [
      '高度自動化されたシステムと人間が上手く協調できるようなヒューマンマシンインタフェースの研究を行っています。',
      '本研究室では、高度自動運転時代に向けた人間中心設計に基づく自動運転システムの研究を行っています。',
      'ドライビングシミュレータを利用し、実験的手法により、高度に自動化されたシステムの安全性向上に取り組んでいます。',
    ],
  },
  researchItems: [
    {
      title: 'ドライバのフラストレーション感情と運転行動の関係',
      subTitle: 'Relationship between driver frustration and driving behavior',
      detail:
        '運転中にフラストレーション感情を抱いたドライバは、そうでないドライバと比較して、車間距離を短くする等の攻撃的な運転を行うことが知られている。本研究ではドライビングシミュレータ実験を行い、フラストレーション感情が運転行動に及ぼす影響を明らかにすることを目的としている。',
      hoverImage: {
        backgroundImage: '/research/team-ai/_koureisya_drive1.jpg',
        hoverImage: '/research/team-ai/_koureisya_drive2.jpg',
        backgroundAlt: 'フラストレーション研究',
        hoverAlt: 'フラストレーション研究',
        width: 400,
        height: 400,
      },
    },
    {
      title: '高齢ドライバの運転能力評価手法に関する研究',
      subTitle:
        'Research on driving ability evaluation methods for elderly drivers',
      detail:
        '高齢化社会を迎えた我が国では高齢ドライバの事故が社会問題となっている。そこで本研究では、高齢ドライバに特有な運転行動特性を明らかにし、高齢ドライバの運転能力を適切に評価する手法の開発を目的としている。',
      image: {
        src: '/research/team-ai/_team-ai-simulator-1.png',
        alt: '高齢ドライバ研究1',
        width: 400,
        height: 400,
      },
    },
    {
      title: '感情と運転パフォーマンスの関係',
      subTitle: 'Relationship between emotion and driving performance',
      detail:
        '近年、運転者の感情が運転行動に与える影響について注目されている。本研究では、運転前の感情状態が運転パフォーマンスに及ぼす影響を明らかにすることを目的として、ドライビングシミュレータ実験を行っている。',
      hoverImage: {
        backgroundImage: '/research/team-ai/_frustration_drive.jpg',
        hoverImage: '/research/team-ai/_smile_drive.jpg',
        backgroundAlt: 'フラストレーション研究',
        hoverAlt: 'フラストレーション研究',
        width: 400,
        height: 400,
      },
    },
  ],
  hasLanguageSelector: false,
};
