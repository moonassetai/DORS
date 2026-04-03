import type { SafetyConfig, SafetyCheck } from './types.js';

interface CategoryPatterns {
  category: string;
  patterns: RegExp[];
  levels: Set<string>;
}

const CATEGORIES: CategoryPatterns[] = [
  {
    category: 'weapons_creation',
    patterns: [
      /how\s+to\s+(make|build|create|construct|assemble)\s+(a\s+)?(bomb|explosive|weapon|firearm|gun)/i,
      /instructions?\s+for\s+(building|making|creating)\s+(a\s+)?(bomb|explosive|weapon)/i,
      /synthesiz(e|ing)\s+(explosive|chemical\s+weapon|nerve\s+agent|poison\s+gas)/i,
      /3d\s+print(ed|ing)?\s+(gun|firearm|weapon)/i,
      /improvised\s+explosive/i,
      /manufacture\s+(ammunition|explosives|weapons)/i,
    ],
    levels: new Set(['permissive', 'standard', 'strict']),
  },
  {
    category: 'csam',
    patterns: [
      /child\s+(sexual|porn|exploitation|abuse\s+material)/i,
      /minor\s+(sexual|explicit|nude)/i,
      /underage\s+(sexual|porn|explicit|nude)/i,
      /csam/i,
      /sexual(ly)?\s+(exploit|abuse)\s+(child|minor|kid)/i,
    ],
    levels: new Set(['permissive', 'standard', 'strict']),
  },
  {
    category: 'pii_exfiltration',
    patterns: [
      /exfiltrat(e|ing|ion)\s+(personal|user|customer)\s+(data|information|records)/i,
      /steal\s+(personal|user|private)\s+(data|info|information|identity)/i,
      /scrape\s+(social\s+security|ssn|credit\s+card|passport)/i,
      /harvest\s+(email|phone|address|credential)/i,
      /dump\s+(user|customer|employee)\s+(database|records|data)/i,
    ],
    levels: new Set(['standard', 'strict']),
  },
  {
    category: 'malware_creation',
    patterns: [
      /writ(e|ing)\s+(a\s+)?(virus|trojan|worm|ransomware|malware|keylogger|rootkit)/i,
      /create\s+(a\s+)?(botnet|backdoor|exploit|payload)/i,
      /how\s+to\s+(hack|breach|penetrate)\s+(a\s+)?(server|system|network|database)/i,
      /bypass\s+(antivirus|security|firewall|authentication)/i,
      /inject(ion)?\s+(sql|code|command|shell)/i,
      /reverse\s+shell/i,
    ],
    levels: new Set(['standard', 'strict']),
  },
  {
    category: 'self_harm_promotion',
    patterns: [
      /how\s+to\s+(commit|attempt)\s+suicide/i,
      /methods?\s+(of|for)\s+(suicide|self.harm|killing\s+(yourself|oneself))/i,
      /encourage\s+(self.harm|suicide|cutting)/i,
      /pro.ana|pro.mia|thinspo/i,
    ],
    levels: new Set(['standard', 'strict']),
  },
];

const STRICT_EXTRA: CategoryPatterns[] = [
  {
    category: 'social_engineering',
    patterns: [
      /phishing\s+(email|template|page|attack)/i,
      /social\s+engineer(ing)?\s+(attack|technique|script)/i,
      /impersonat(e|ing)\s+(authority|police|support|admin)/i,
      /craft\s+(a\s+)?scam/i,
    ],
    levels: new Set(['strict']),
  },
  {
    category: 'deception',
    patterns: [
      /generate\s+(fake|forged|fraudulent)\s+(document|id|certificate|diploma)/i,
      /deepfake\s+(video|audio|image)/i,
      /counterfeit/i,
      /forge\s+(a\s+)?(signature|document|identity)/i,
    ],
    levels: new Set(['strict']),
  },
];

export class ThreeLawsEngine {
  private config: SafetyConfig;
  private activeCategories: CategoryPatterns[];

  constructor(config: SafetyConfig) {
    this.config = config;

    const allCategories = [...CATEGORIES, ...STRICT_EXTRA];

    // Filter categories active for this level
    this.activeCategories = allCategories.filter((cat) => {
      // If explicitly blocked, always include
      if (this.config.blockedCategories.includes(cat.category)) {
        return true;
      }
      return cat.levels.has(this.config.level);
    });
  }

  check(input: string): SafetyCheck {
    for (const cat of this.activeCategories) {
      for (const pattern of cat.patterns) {
        if (pattern.test(input)) {
          return {
            allowed: false,
            reason: `Input matches blocked category: ${cat.category}`,
            category: cat.category,
          };
        }
      }
    }

    return { allowed: true };
  }
}
