import type { ResearchPageData } from '../../types/research.js';

export const cognitiveData: ResearchPageData = {
  title: '認知グループ',
  keywords: [
    'Cognitive Bias',
    'Risk Taking Propensity',
    'Danger Sensitivity',
    'Social Acceptance',
    'Nuclear Power',
    'Resilience',
    'Safety Culture',
    'Qualitative Research',
  ],
  introduction: {
    paragraphs: [
      '社会システムは人間と機械がそのほとんどを担っており、安全な状態を維持するためには機械だけでなく人間の特性を知る必要があります。本研究グループでは、認知科学・人体生理学を社会システムの安全性向上のために応用することを目的とした研究を行っています。',
    ],
  },
  researchItems: [
    {
      title: '思考レベルの認知過程',
      subTitle: 'Thinking level cognitive process',
      detail:
        '複雑・動的な環境における人間のパフォーマンスを向上させるために，思考レベルの認知メカニズムを明らかにする研究を行なっています．実際のタスクにおける思考プロセスと，それに対応する脳活動（fNIRS）をリアルタイムで同時に取得することで，複雑・動的な状況における思考プロセスの特徴やそれに対応する脳内の活動を明らかにしています．',
      isLeft: false,
      image: {
        src: '/research/cognitive/_bart.png',
        alt: 'BART',
        width: 400,
        height: 400,
      },
    },
    {
      title: 'リスク認知に関する研究',
      subTitle: 'Research on risk perception',
      detail:
        '人はリスクをどのように認知し，それに対してどのような行動をとるのでしょうか．リスク認知の個人差やその要因について，行動実験とfNIRS等を用いた脳科学的手法により研究を行なっています．特に、原子力発電に対するリスク認知について詳しく調べています．',
      isLeft: true,
      image: {
        src: '/research/cognitive/_image2.png',
        alt: 'リスク認知研究',
        width: 400,
        height: 400,
      },
    },
    {
      title: '認知バイアスとは何か',
      subTitle: 'What is cognitive bias',
      detail:
        '人間の判断は必ずしも合理的ではありません．認知バイアスと呼ばれる判断の偏りが生じることがあります．このような認知バイアスがどのような条件で生じるのか，それを軽減する方法はあるのかについて，行動実験により研究を行なっています．',
      isLeft: false,
      image: {
        src: '/research/cognitive/_image.png',
        alt: '認知バイアス研究',
        width: 400,
        height: 400,
      },
    },
  ],
  hasLanguageSelector: false,
};
