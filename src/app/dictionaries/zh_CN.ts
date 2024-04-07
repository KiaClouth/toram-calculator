import { type dictionary } from "./type";
const dictionary: dictionary = {
  ui: {
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
      searchPlaceholder: "这里是搜索框~",
      upload: "上传怪物数据",
      save: "保存",
      reset: "清空",
      modify: "修改",
      cancel: "取消",
      close: "关闭",
      pageTitle: "怪物信息表",
      discription: "啊啦啦啦啦，这里是本页的描述信息。但是还没有想好写什么~",
      columnsHidden: "隐藏列",
      filter: "过滤",
    },
    skill: {
      searchPlaceholder: "这里是搜索框~",
      upload: "上传技能数据",
      save: "保存",
      reset: "清空",
      modify: "修改",
      cancel: "取消",
      close: "关闭",
      pageTitle: "技能信息表",
      discription: "啊啦啦啦啦，这里是本页的描述信息。但是还没有想好写什么~",
      columnsHidden: "隐藏列",
      filter: "过滤",
    },
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
      ModifiersName: {
        STR: "",
        INT: "",
        VIT: "",
        AGI: "",
        DEX: "",
        MAX_HP: "",
        MAX_MP: "",
        AGGRO: "",
        WEAPON_RANGE: "",
        NATYRAL_HP_REGEN: "",
        NATURAL_MP_REGEN: "",
        PHYSICAL_ATK: "",
        MAGICAL_ATK: "",
        WEAPON_ATK: "",
        UNSHEATHE_ATK: "",
        PHYSICAL_PIERCE: "",
        MAGICAL_PIERCE: "",
        CRITICAL_RATE: "",
        CRITICAL_DAMAGE: "",
        MAGIC_CRT_CONVERSION_RATE: "",
        MAGIC_CRT_DAMAGE_CONVERSION_RATE: "",
        SHORT_RANGE_DAMAGE: "",
        LONG_RANGE_DAMAGE: "",
        STRONGER_AGAINST_NETURAL: "",
        STRONGER_AGAINST_LIGHT: "",
        STRONGER_AGAINST_DARK: "",
        STRONGER_AGAINST_WATER: "",
        STRONGER_AGAINST_FIRE: "",
        STRONGER_AGAINST_EARTH: "",
        STRONGER_AGAINST_WIND: "",
        STABILITY: "",
        ACCURACY: "",
        ADDITIONAL_PHYSICS: "",
        ADDITIONAL_MAGIC: "",
        ANTICIPATE: "",
        GUARD_BREAK: "",
        REFLECT: "",
        ABSOLUTA_ACCURACY: "",
        ATK_UP_STR: "",
        ATK_UP_INT: "",
        ATK_UP_VIT: "",
        ATK_UP_AGI: "",
        ATK_UP_DEX: "",
        MATK_UP_STR: "",
        MATK_UP_INT: "",
        MATK_UP_VIT: "",
        MATK_UP_AGI: "",
        MATK_UP_DEX: "",
        ATK_DOWN_STR: "",
        ATK_DOWN_INT: "",
        ATK_DOWN_VIT: "",
        ATK_DOWN_AGI: "",
        ATK_DOWN_DEX: "",
        MATK_DOWN_STR: "",
        MATK_DOWN_INT: "",
        MATK_DOWN_VIT: "",
        MATK_DOWN_AGI: "",
        MATK_DOWN_DEX: "",
        PHYSICAL_DEF: "",
        MAGICAL_DEF: "",
        PHYSICAL_RESISTANCE: "",
        MAGICAL_RESISTANCE: "",
        NEUTRAL_RESISTANCE: "",
        LIGHT_RESISTANCE: "",
        DARK_RESISTANCE: "",
        WATER_RESISTANCE: "",
        FIRE_RESISTANCE: "",
        EARTH_RESISTANCE: "",
        WIND_RESISTANCE: "",
        DODGE: "",
        AILMENT_RESISTANCE: "",
        BASE_GUARD_POWER: "",
        GUARD_POWER: "",
        BASE_GUARD_RECHARGE: "",
        GUARD_RECHANGE: "",
        EVASION_RECHARGE: "",
        PHYSICAL_BARRIER: "",
        MAGICAL_BARRIER: "",
        FRACTIONAL_BARRIER: "",
        BARRIER_COOLDOWN: "",
        REDUCE_DMG_FLOOR: "",
        REDUCE_DMG_METEOR: "",
        REDUCE_DMG_PLAYER_EPICENTER: "",
        REDUCE_DMG_FOE_EPICENTER: "",
        REDUCE_DMG_BOWLING: "",
        REDUCE_DMG_BULLET: "",
        REDUCE_DMG_STRAIGHT_LINE: "",
        REDUCE_DMG_CHARGE: "",
        ABSOLUTE_DODGE: "",
        ASPD: "",
        CSPD: "",
        MSPD: "",
        DROP_RATE: "",
        REVIVE_TIME: "",
        FLINCH_UNAVAILABLE: "",
        TUMBLE_UNAVAILABLE: "",
        STUN_UNAVAILABLE: "",
        INVINCIBLE_AID: "",
        EXP_RATE: "",
        PET_EXP: "",
        ITEM_COOLDOWN: "",
        RECOIL_DAMAGE: "",
        GEM_POWDER_DROP: ""
      },
      ModifiersValueType: {
        FLAT_BONUS: "",
        PERCENTAGE_BONUS: ""
      },
      SpecialAbiType: {
        NULL: "",
        LUC: "",
        CRI: "",
        TEC: "",
        MEN: ""
      },
      MainWeaType: {
        NO_WEAPOEN: "",
        ONE_HAND_SWORD: "",
        TWO_HANDS_SWORD: "",
        BOW: "",
        STAFF: "",
        MAGIC_DEVICE: "",
        KNUCKLE: "",
        HALBERD: "",
        KATANA: ""
      },
      SubWeaType: {
        NO_WEAPOEN: "",
        ONE_HAND_SWORD: "",
        MAGIC_DEVICE: "",
        KNUCKLE: "",
        KATANA: "",
        ARROW: "",
        DAGGER: "",
        NINJUTSUSCROLL: "",
        SHIELD: ""
      },
      BodyArmorType: {
        NORMAL: "",
        LIGHT: "",
        HEAVY: ""
      },
      CrystalType: {
        GENERAL: "",
        WEAPONCRYSTAL: "",
        BODYCRYSTAL: "",
        ADDITIONALCRYSTAL: "",
        SPECIALCRYSTAL: ""
      },
      SkillType: {
        BUFF: "",
        DAMAGE: ""
      },
      SkillTreeName: {
        SWORLD: "",
        MAGIC: ""
      }
    },
    models: {
      monster: {
        id: "ID",
        updatedByUserId: "更新者",
        state: "状态",
        name: "名称",
        monsterType: "类型",
        baseLv: "零星等级",
        experience: "四星经验",
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
        viewTimestamps: "被查看记录"
      },
      skill: {
        id: "",
        state: "",
        name: "",
        type: "",
        mpCost: "",
        mpGain: "",
        hpCost: "",
        hpGain: "",
        createdByUserId: "",
        updatedByUserId: "",
        viewCount: "",
        usageCount: "",
        createdAt: "",
        updatedAt: "",
        usageTimestamps: "",
        viewTimestamps: "",
        level: "",
        treeName: ""
      }
    },
  },
};

export default dictionary;
