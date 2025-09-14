import type { ResearchPageData } from '../../types/research.js';

export const aviationData: ResearchPageData = {
  title: '航空グループ',
  keywords: [
    'Aviation Safety',
    'Air Traffic Control',
    'Industry-Academia-Government Collaboration',
    'Pilot',
    'Human Factors',
    'Resilience',
    'Safety II',
    'Competency',
    'Non-technical Skills',
    'Safety Culture',
    'Qualitative Research',
  ],
  introduction: {
    message:
      '本研究室は航空管制のヒューマンファクタに関して<br/>実践的・学術的研究を行っている日本で<span class="text-sm font-light">(ほぼ)</span>唯一の研究室です', // JavaScriptで動的に設定
    paragraphs: [
      '本研究室では10年以上前から航空関係のヒューマンファクタの研究を行ってきました。<br/>初期の研究では航空機のコックピットのインタフェースに関する研究をANA現役機長と共に行いました。その後、研究の軸足を航空管制分野に移し、現役の航空管制官との協力体制をつくり研究を行っています。<br/>航空管制に関しては研究を行う我々の方も高いレベルでの知識が要求されますが、行っている研究の内容は現場での教育に使えると評価されるほどのシステムを提案するなど、単なるアカデミック研究のレベルを超えた実践的な研究を行っています。<br/>航空管制におけるヒューマンファクタに関する研究は空の安全を守るために非常に重要な問題ですが人材的に不足しています。<br/>あなたも是非、本研究室で航空管制の研究をしてみませんか？',
      '本研究グループでは、航空分野をはじめとした大規模複雑システムにおけるさらなる安全性向上を目指し、Safety-Ⅱ実現に向けての鍵となる「レジリエンス」に関して、航空会社等との密接な連携を通じて、学術知にとどまらない実践的な研究を実施しています。以下に、本グループにおいて実際に行われている研究の一部を示します。',
    ],
  },
  researchItems: [
    {
      title: '航空会社との共同研究「ROM」',
      subTitle: 'Joint research with airline companies "ROM"',
      detail:
        '日本航空株式会社との共同研究により、Safety-IIという新たな安全の考えに基づいた"ROM(Resilience Operation Monitoring)"という新しい安全モニタリングプログラムの開発に取り組んでいます。従来は"うまくいかなかった事象"、つまり数少ない失敗事例に着目してきましたが、日常の運航の大多数である"うまくいった事象"の要因となった行動にも着目し分析をすることで、"成功を増やす事によって、より高い安全性の実現を目指す"新たな安全へのアプローチを研究しています。',
      hoverImage: {
        backgroundImage: '/research/aviation/_cockpit_color.jpg',
        hoverImage: '/research/aviation/_cockpit_monotone.jpg',
        backgroundAlt: 'Cockpit Color Image',
        hoverAlt: 'Cockpit Monotone Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: '運航乗務員のコンピテンシーに関する研究',
      subTitle: 'Research on flight crew competencies',
      detail:
        'Safety-IIでは、安全への人間のポジティブな寄与やそれに繋がる能力であるレジリエンスが重要視されています。インタビューや質的研究法を用いながら、運航乗務員(パイロット)がもつレジリエンスのためのコンピテンシーを体系化・可視化し、そこから得られる知見を今後の教育・訓練、ひいては、さらなる安全運航に活かすことを目指した実践的な研究を行なっています。',
      hoverImage: {
        backgroundImage: '/research/aviation/_professor2.jpg',
        hoverImage: '/research/aviation/_professor1.jpg',
        backgroundAlt: 'Professor2 Image',
        hoverAlt: 'Professor1 Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: 'チームレジリエンスとコミュニケーションに関する実験研究',
      subTitle: 'Experimental research on team resilience and communication',
      detail:
        '航空路管制業務をモデルとしたチームタスクシュミレータ(ASSIST)を用いて、様々なタイプの変動に対してレジリエントに対応できるチームの特徴を実験的に明らかにする研究を行なっています。特にチームのコミュニケーションに着目し、チームメンバー間での情報共有の量や質とチームパフォーマンスの関係を明らかにすることで、チームでオペレーションが行われる複雑システムにおける教育・訓練プログラムの一層の改善に資する知見の獲得を目指しています。',
      hoverImage: {
        backgroundImage: '/research/aviation/_ATC_radar.jpg',
        hoverImage: '/research/aviation/_ATC-Tower.jpg',
        backgroundAlt: 'ATC Radar Image',
        hoverAlt: 'ATC Tower Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: '失敗許容度とスキルの柔軟性に関する基礎研究',
      subTitle: 'Basic research on failure tolerance and skill flexibility',
      detail:
        '様々な複雑システムにおける安全対策として、「失敗の再発防止」が重視されてきました。安全に関わる失敗を防止することはもちろん重要ですが、より高い安全性の追求がより些細な失敗も許されない組織文化の形成につながれば、小さな失敗から学びを得てスキルを高める機会を得ることが困難となってしまいます。それは、システムのさらなる安全性向上に本当につながるのでしょうか？想定外の事態を含む様々な条件下でシステムの安全性を維持することに本当に貢献するのでしょうか？本研究では、それらの疑問に答えるための第一歩として、失敗に対する許容度の違いが、教育・訓練や経験を通じて獲得されるスキルの柔軟性に与える影響を独自のタスクシミュレーターを用いて研究しています。',
      hoverImage: {
        backgroundImage: '/research/aviation/_pilot.jpg',
        hoverImage: '/research/aviation/_cabin_Attendant.jpg',
        backgroundAlt: 'Pilot Image',
        hoverAlt: 'Cabin Attendant Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: 'オープンソースATCレーダーシミュレーター「Horus」の開発',
      subTitle: 'Development of open-source ATC radar simulator "Horus"',
      detail:
        '航空管制シミュレーション用のオープンソースプロジェクト<a href="https://github.com/Futty93/Horus" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">「Horus」</a>を開発しています。このプロジェクトでは、航空機のコンフリクト検出アルゴリズム、レーダー表示機能、基本的な航空機制御機能を実装しており、航空管制システムの基本的な仕組みを体験・理解するためのWebベースのシミュレーション環境を提供します。',
      hoverImage: {
        backgroundImage: '/research/aviation/_ATC_airport.png',
        hoverImage: '/research/aviation/_radar_room.png',
        backgroundAlt: 'ATC Airport Control Tower',
        hoverAlt: 'Radar Control Room',
        width: 400,
        height: 400,
      },
    },
  ],
  hasLanguageSelector: true,
};

export const aviationEnData: ResearchPageData = {
  title: 'Aviation Group',
  keywords: [
    'Aviation Safety',
    'Air Traffic Control',
    'Industry-Academia-Government Collaboration',
    'Pilot',
    'Human Factors',
    'Resilience',
    'Safety II',
    'Competency',
    'Non-technical Skills',
    'Safety Culture',
    'Qualitative Research',
  ],
  introduction: {
    message:
      'Takahashi Laboratory is one of the only laboratories in Japan<br/>that conducts practical and academic research on human factors in Air Traffic Control.',
    paragraphs: [
      'This research group aims to further improve the safety of large-scale complex systems, including those in the aviation field, and works closely with airlines and other organizations to conduct academic research on "resilience," which is the key to realizing Safety-II. We conduct practical research that goes beyond knowledge. Below are some of the research actually being conducted in this group.',
      'Takahashi Lab has been conducting research on aviation-related human factors for over 10 years. In our early research, we worked with current ANA pilots on aircraft cockpit interfaces. After that, We shifted the focus of my research to the field of air traffic control, and are conducting research in collaboration with active air traffic controllers. Although those of us who conduct research are required to have a high level of knowledge regarding air traffic control, the content of our research is not merely academic research, such as proposing a system that is highly evaluated as being usable for on-site education. We conduct practical research that goes beyond human factors in air traffic control. These issues are very important to protect air safety, but there is a shortage of human resources.<br/> Would you also like to study air traffic control at Takahashi Lab?',
    ],
  },
  researchItems: [
    {
      title: 'Joint research with airline companies ROM',
      subTitle: '航空会社との共同研究「ROM」',
      detail:
        'Through joint research with Japan Airlines Co., Ltd., we are developing a new safety monitoring program called "ROM (Resilience Operation Monitoring)" based on a new safety concept called Safety-II. Traditionally, we have focused on "events that did not go well", but by focusing on and analyzing the actions that were the cause of "successful events", which are the majority of daily operations, we are researching new approaches to safety that aim to achieve higher levels of safety by increasing success.',
      hoverImage: {
        backgroundImage: '/research/aviation/_cockpit_color.jpg',
        hoverImage: '/research/aviation/_cockpit_monotone.jpg',
        backgroundAlt: 'Cockpit Color Image',
        hoverAlt: 'Cockpit Monotone Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: 'Research on flight crew competencies',
      subTitle: '運航乗務員のコンピテンシーに関する研究',
      detail:
        'Safety-II emphasizes resilience, which is the positive human contribution to safety and the ability to do so. Using interviews and qualitative research methods, we will systematize and visualize the competencies for resilience possessed by flight crew members (pilots), and utilize the knowledge gained from this for future education and training, and ultimately for even safer flight operations. We are conducting practical research aimed at achieving this goal.',
      hoverImage: {
        backgroundImage: '/research/aviation/_professor2.jpg',
        hoverImage: '/research/aviation/_professor1.jpg',
        backgroundAlt: 'Professor2 Image',
        hoverAlt: 'Professor1 Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: 'Experimental research on team resilience and communication',
      subTitle: 'チームレジリエンスとコミュニケーションに関する実験研究',
      detail:
        'Using a team task simulator (ASSIST) modeled after air route control operations, we are conducting research to experimentally clarify the characteristics of teams that can respond resiliently to various types of fluctuations. By focusing in particular on team communication and clarifying the relationship between the quantity and quality of information sharing between team members and team performance, we will contribute to further improvements in education and training programs for complex systems operated by teams.',
      hoverImage: {
        backgroundImage: '/research/aviation/_ATC_radar.jpg',
        hoverImage: '/research/aviation/_ATC-Tower.jpg',
        backgroundAlt: 'ATC Radar Image',
        hoverAlt: 'ATC Tower Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: 'Basic research on failure tolerance and skill flexibility',
      subTitle: '失敗許容度とスキルの柔軟性に関する基礎研究',
      detail:
        'As a safety measure for various complex systems, "prevention of failures from recurring" has been emphasized. It is of course important to prevent safety-related failures, but if the pursuit of higher safety leads to the creation of an organizational culture where even the smallest failures are not tolerated, employees will not have the opportunity to learn from small failures and improve their skills. Will it really lead to further improvements in system security? Does it really contribute to maintaining system safety under various conditions, including unexpected events? In this study, as a first step toward answering these questions, we used a unique task simulator to study the impact that differences in tolerance for failure have on the flexibility of skills acquired through education, training, and experience.',
      hoverImage: {
        backgroundImage: '/research/aviation/_pilot.jpg',
        hoverImage: '/research/aviation/_cabin_Attendant.jpg',
        backgroundAlt: 'Pilot Image',
        hoverAlt: 'Cabin Attendant Image',
        width: 400,
        height: 400,
      },
    },
    {
      title: 'Development of open-source ATC radar simulator "Horus"',
      subTitle: 'オープンソースATCレーダーシミュレーター「Horus」の開発',
      detail:
        'We are developing <a href="https://github.com/Futty93/Horus" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">"Horus"</a>, an open-source air traffic control simulation project. This project implements aircraft conflict detection algorithms, radar display functionality, and basic aircraft control features, providing a web-based simulation environment for experiencing and understanding the fundamental mechanisms of air traffic control systems.',
      hoverImage: {
        backgroundImage: '/research/aviation/_ATC_airport.png',
        hoverImage: '/research/aviation/_radar_room.png',
        backgroundAlt: 'ATC Airport Control Tower',
        hoverAlt: 'Radar Control Room',
        width: 400,
        height: 400,
      },
    },
  ],
  hasLanguageSelector: true,
};
