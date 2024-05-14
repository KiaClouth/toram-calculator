import { type dictionary } from "./type";
const dictionary: dictionary = {
  ui: {
    add: "添加",
    create: "创建",
    remove: "删除",
    update: "更新",
    open: "打开",
    upload: "上传",
    save: "保存",
    reset: "清空",
    modify: "修改",
    cancel: "取消",
    close: "关闭",
    searchPlaceholder: "这里是搜索框~",
    columnsHidden: "隐藏列",
    filter: "过滤",
    root: {
      home: "首页",
      monsters: "怪物",
      skills: "技能",
      equipments: "装备",
      crystas: "锻晶",
      pets: "宠物",
      items: "消耗品",
      character: "角色配置",
      comboAnalyze: "连击分析",
    },
    index: {
      goodMorning: "哦哈喵~ (=´ω｀=)",
      goodAfternoon: "下午好ヾ(=･ω･=)o",
      goodEvening: "晚上好(。-ω-)zzz",
    },
    monster: {
      pageTitle: "怪物信息表",
      discription: "表中记录的是1星状态下的定点王数据， 2 / 3 / 4 星的经验和HP为1星的 2 / 5 / 10 倍；物防、魔防、回避值为1星的 2 / 4 / 6 倍。",
      augmented: "是否展示全部星级数据",
      canNotModify: "系统生成，不可修改",
      monsterDegreeOfDifficulty: {
        0: "零星",
        1: "一星",
        2: "二星",
        3: "三星",
        4: "四星"
      },
      monsterForm: {
        discription: "上传定点boss数据时请使用一星数据，系统将按规则自动计算其余星级数据。",
      },
    },
    skill: {
      pageTitle: "技能信息表",
      discription: "此页面正在开发中，请勿使用",
    },
    analyze: {
      pageTitle: "流程计算器",
      discription: "正在开发中，请勿使用",
    }
  },
  db: {
    enums: {
      State: {
        PRIVATE: "自用",
        PUBLIC: "公开",
      },
      MonsterType: {
        COMMON_BOSS: "定点王",
        COMMON_MINI_BOSS: "野王",
        COMMON_MOBS: "小怪",
        EVENT_BOSS: "活动定点王",
        EVENT_MINI_BOSS: "活动野王",
        EVENT_MOBS: "活动小怪",
      },
      Element: {
        NO_ELEMENT: "无属性",
        DARK: "暗属性",
        EARTH: "地属性",
        FIRE: "火属性",
        LIGHT: "光属性",
        WATER: "水属性",
        WIND: "风属性",
      },
      SpecialAbiType: {
        NULL: "无",
        LUK: "幸运",
        CRI: "暴击",
        TEC: "技巧",
        MEN: "异抗"
      },
      MainWeaType: {
        NO_WEAPOEN: "空",
        ONE_HAND_SWORD: "单手剑",
        TWO_HANDS_SWORD: "双手剑",
        BOW: "弓",
        STAFF: "法杖",
        MAGIC_DEVICE: "魔导具",
        KNUCKLE: "拳套",
        HALBERD: "旋风枪",
        KATANA: "拔刀剑",
        BOWGUN: "弩"
      },
      SubWeaType: {
        NO_WEAPOEN: "空",
        ONE_HAND_SWORD: "单手剑",
        MAGIC_DEVICE: "魔导具",
        KNUCKLE: "拳套",
        KATANA: "拔刀剑",
        ARROW: "箭矢",
        DAGGER: "小刀",
        NINJUTSUSCROLL: "忍术卷轴",
        SHIELD: "盾牌"
      },
      BodyArmorType: {
        NORMAL: "一般",
        LIGHT: "轻化",
        HEAVY: "重化"
      },
      CrystalType: {
        GENERAL: "通用锻晶",
        WEAPONCRYSTAL: "武器锻晶",
        BODYCRYSTAL: "身体锻晶",
        ADDITIONALCRYSTAL: "追加锻晶",
        SPECIALCRYSTAL: "特殊锻晶"
      },
      SkillType: {
        ACTIVE_SKILL: "主动技能",
        PASSIVE_SKILL: "被动技能"
      },
      SkillTreeName: {
        BLADE: "剑系技能树",
        MAGIC: "魔法技能树",
        SHOT: "射击技能树",
        MARTIAL: "格斗技能树",
        DUALSWORD: "双剑技能树",
        HALBERD: "斧枪技能树",
        MONONOFU: "武士技能树",
        CRUSHER: "粉碎者技能树",
        SPRITE: "灵魂技能树"
      },
      UserRole: {
        USER: "常规用户",
        ADMIN: "管理员"
      },
      YieldType: {
        ImmediateEffect: "即时效果（仅作用一次）",
        PersistentEffect: "持续型效果（在被删除前，一直有效）"
      },
      WeaponElementDependencyType: {
        TRUE: "继承",
        FALSE: "不继承"
      },
      ComboType: {
        NULL: "未设置",
      },
      SkillExtraActionType: {
        None: "无",
        Chanting: "咏唱",
        Charging: "蓄力"
      }
    },
    models: {
      monster: {
        id: "ID",
        updatedByUserId: "更新者",
        state: "状态",
        name: "名称",
        monsterType: "类型",
        baseLv: "等级",
        experience: "经验",
        address: "所在地址",
        element: "元素属性",
        radius: "半径",
        maxhp: "最大HP",
        physicalDefense: "物理防御",
        physicalResistance: "物理抗性",
        magicalDefense: "魔法防御",
        magicalResistance: "魔法抗性",
        criticalResistance: "暴击抗性",
        avoidance: "回避值",
        dodge: "闪避率",
        block: "格挡率",
        normalAttackResistanceModifier: "一般惯性变动率",
        physicalAttackResistanceModifier: "物理惯性变动率",
        magicalAttackResistanceModifier: "魔法惯性变动率",
        difficultyOfTank: "难度：坦职",
        difficultyOfMelee: "难度：近战",
        difficultyOfRanged: "难度：远程",
        possibilityOfRunningAround: "好动程度",
        specialBehavior: "特殊说明",
        createdByUserId: "属于[ID]",
        viewCount: "被查看次数",
        usageCount: "被使用次数",
        createdAt: "创建于",
        updatedAt: "更新于",
        usageTimestamps: "被使用记录",
        viewTimestamps: "被查看记录",
        raters: "评分列表",
        dataSources: "数据来源"
      },
      skill: {
        id: "ID",
        state: "状态",
        name: "名称",
        createdByUserId: "创建者ID",
        updatedByUserId: "更新者ID",
        viewCount: "被查看次数",
        usageCount: "被使用次数",
        createdAt: "创建于",
        updatedAt: "更新于",
        usageTimestamps: "",
        viewTimestamps: "",
        skillType: "类型",
        level: "等级",
        skillTreeName: "所属技能树",
        weaponElementDependencyType: "属性是否继承武器",
        element: "自身元素属性",
        skillEffect: "技能效果",
        skillDescription: "技能说明"
      },
      user: {
        id: "账号ID",
        name: "用户名",
        email: "邮件地址",
        emailVerified: "邮件邀请时间",
        image: "头像",
        role: "身份类型"
      },
      skillEffect: {
        id: "ID",
        condition: "生效条件",
        description: "条件说明",
        actionBaseDurationFormula: "固定动作时长（帧）",
        actionModifiableDurationFormula: "可加速动作时长（帧）",
        skillExtraActionType: "额外动作",
        chargingBaseDurationFormula: "固定蓄力时长计算公式（秒）",
        chargingModifiableDurationFormula: "可加速蓄力时长计算公式（秒）",
        chantingBaseDurationFormula: "固定咏唱时长计算公式（秒）",
        chantingModifiableDurationFormula: "可加速咏唱时长计算公式（秒）",
        skillWindUpFormula: "技能前摇计算公式（秒）",
        skillRecoveryFormula: "技能后摇计算公式（秒）",
        belongToskillId: "所属技能",
        skillCost: "技能消耗",
        skillYield: "作用效果",
      },
      skillCost: {
        id: "ID",
        costFormula: "计算公式",
        skillEffectId: "所属技能效果",
        name: "名称"
      },
      skillYield: {
        id: "ID",
        name: "名称",
        yieldType: "效果类型",
        mutationTimingFormula: "效果发生变化的时机计算公式",
        yieldFormula: "效果计算公式",
        skillEffectId: "所属技能效果",
      }
    },
  },
};

export default dictionary;
