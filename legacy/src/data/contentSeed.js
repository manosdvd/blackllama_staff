/**
 * Camp Lawton Staff Portal — Structured Content Seed
 *
 * Transitional scaffold only.
 *
 * This file mirrors the blueprint's target content model without replacing
 * the current runtime handbook/search implementation yet. It is intentionally
 * conservative: it names content categories and sample records, but it does
 * not provide detailed operational procedures. Official camp/council-approved
 * content should be imported later through the structured content pipeline.
 */

export const CONTENT_TYPES = Object.freeze({
  HANDBOOK_ARTICLE: 'handbook_article',
  POLICY_REFERENCE: 'policy_reference',
  SAFEGUARDING_REFERENCE: 'safeguarding_reference',
  EMERGENCY_REFERENCE: 'emergency_reference',
  LEGAL_POLICY: 'legal_policy',
  CAMP_CULTURE: 'camp_culture',
  SCHEDULE_REFERENCE: 'schedule_reference',
  SONGBOOK_ARTICLE: 'songbook_article',
  TRAINING_REFERENCE: 'training_reference',
  ONBOARDING_REFERENCE: 'onboarding_reference'
});

export const OFFLINE_PRIORITIES = Object.freeze({
  CRITICAL: 'critical',
  HIGH: 'high',
  NORMAL: 'normal',
  OPTIONAL: 'optional'
});

export const AUDIENCES = Object.freeze({
  PUBLIC: 'public',
  CANDIDATE: 'candidate',
  PARENT_GUARDIAN: 'parent_guardian',
  HIRED_STAFF: 'hired_staff',
  ACTIVE_STAFF: 'active_staff',
  ADULT_STAFF: 'adult_staff',
  ADMIN: 'admin'
});

export const CHECKLIST_TYPES = Object.freeze({
  REQUIRED_PAPERWORK: 'required_paperwork',
  PACKING_LIST: 'packing_list',
  ONBOARDING: 'onboarding',
  TRAINING_READINESS: 'training_readiness',
  ARRIVAL_PREP: 'arrival_prep',
  AREA_SETUP: 'area_setup'
});

export const TRAINING_MODULE_TYPES = Object.freeze({
  SCENARIO_CARDS: 'scenario_cards',
  QUIZ: 'quiz',
  BRANCHING_DECISION: 'branching_decision',
  MATCHING_GAME: 'matching_game',
  SEQUENCING_GAME: 'sequencing_game',
  FLASHCARDS: 'flashcards',
  ANIMATED_EXPLAINER: 'animated_explainer',
  CHECKLIST_WALKTHROUGH: 'checklist_walkthrough',
  SIMULATION: 'simulation'
});

export const REFERENCE_TYPES = Object.freeze({
  WEATHER: 'weather',
  MISSING_PERSON: 'missing_person',
  FIRE_WEATHER: 'fire_weather',
  WILDLIFE: 'wildlife',
  MEDICAL_SUPPORT: 'medical_support',
  SAFEGUARDING: 'safeguarding',
  GENERAL_SAFETY: 'general_safety'
});

export const contentSeed = {
  metadata: {
    name: 'Camp Lawton Staff Portal Structured Content Seed',
    status: 'transitional_scaffold',
    source: 'blueprint_overhaul_plan',
    notes: [
      'This file does not currently replace rawHandbook.js.',
      'Use this shape for future Supabase importer and offline search work.',
      'Do not treat this file as official policy content until reviewed by camp/council leadership.'
    ]
  },

  seasons: [
    {
      id: 'season-2026',
      year: 2026,
      name: 'Camp Lawton 2026',
      status: 'planning'
    }
  ],

  contentCategories: [
    {
      id: 'category-mission-control',
      title: 'Mission Control',
      slug: 'mission-control',
      sortOrder: 10,
      audience: AUDIENCES.HIRED_STAFF
    },
    {
      id: 'category-handbook',
      title: 'Staff Handbook',
      slug: 'staff-handbook',
      sortOrder: 20,
      audience: AUDIENCES.HIRED_STAFF
    },
    {
      id: 'category-policies',
      title: 'Policies and Procedures',
      slug: 'policies-and-procedures',
      sortOrder: 30,
      audience: AUDIENCES.HIRED_STAFF
    },
    {
      id: 'category-emergency',
      title: 'Emergency References',
      slug: 'emergency-references',
      sortOrder: 40,
      audience: AUDIENCES.HIRED_STAFF
    },
    {
      id: 'category-safeguarding',
      title: 'Safeguarding',
      slug: 'safeguarding',
      sortOrder: 50,
      audience: AUDIENCES.HIRED_STAFF
    },
    {
      id: 'category-onboarding',
      title: 'Onboarding',
      slug: 'onboarding',
      sortOrder: 60,
      audience: AUDIENCES.HIRED_STAFF
    },
    {
      id: 'category-training',
      title: 'Training Modules',
      slug: 'training-modules',
      sortOrder: 70,
      audience: AUDIENCES.HIRED_STAFF
    },
    {
      id: 'category-songbook',
      title: 'Songbook and Campfire',
      slug: 'songbook-and-campfire',
      sortOrder: 80,
      audience: AUDIENCES.HIRED_STAFF
    }
  ],

  contentItems: [
    {
      id: 'content-welcome',
      categoryId: 'category-handbook',
      title: 'Welcome',
      slug: 'welcome',
      contentType: CONTENT_TYPES.HANDBOOK_ARTICLE,
      summary: 'A plain-language welcome to the Camp Lawton staff portal and the purpose of the app.',
      keyPoints: [
        'This portal is a field-ready helper, not just a digital binder.',
        'Critical staff references should remain useful even when signal is weak.',
        'Official camp, council, ranger, and emergency instructions always supersede app content.'
      ],
      body: 'Welcome to the Camp Lawton Staff Portal. This app is intended to help staff prepare, learn, find answers, and stay oriented during the season. It should be practical, calm, mobile-friendly, and honest about what is live, cached, or unavailable.',
      offlinePriority: OFFLINE_PRIORITIES.HIGH,
      audience: AUDIENCES.HIRED_STAFF,
      sourcePath: 'seed.welcome',
      searchKeywords: ['welcome', 'portal', 'mission control', 'staff handbook']
    },
    {
      id: 'content-chain-of-command',
      categoryId: 'category-handbook',
      title: 'Chain of Command',
      slug: 'chain-of-command',
      contentType: CONTENT_TYPES.HANDBOOK_ARTICLE,
      summary: 'How staff should route questions, concerns, decisions, and urgent issues.',
      keyPoints: [
        'Use the chain of command unless safety requires immediate action.',
        'Area staff report to Area Directors; Area Directors report to the Program Director.',
        'Some operational teams may follow separate reporting lines.'
      ],
      body: 'The chain of command helps camp stay coordinated. It is not about ego; it is about clarity. When in doubt, ask your direct supervisor. When safety is involved, follow current camp leadership instructions.',
      offlinePriority: OFFLINE_PRIORITIES.HIGH,
      audience: AUDIENCES.HIRED_STAFF,
      sourcePath: 'seed.handbook.chain_of_command',
      searchKeywords: ['chain of command', 'leadership', 'program director', 'area director']
    },
    {
      id: 'content-stress-management',
      categoryId: 'category-handbook',
      title: 'Stress Management and Mental Health',
      slug: 'stress-management-and-mental-health',
      contentType: CONTENT_TYPES.HANDBOOK_ARTICLE,
      summary: 'Practical guidance for handling stress during intense camp weeks.',
      keyPoints: [
        'Stress is expected; suffering silently is not the standard.',
        'Use breaks, hydration, food, sleep, and adult support early.',
        'Ask for help before stress turns into unsafe or unkind behavior.'
      ],
      body: 'Camp work can be exhausting. Heat, altitude, noise, responsibility, homesickness, conflict, and lack of sleep can pile up fast. Ask for help early. A good staff member does not pretend to be invincible; a good staff member protects the mission by staying honest about their limits.',
      offlinePriority: OFFLINE_PRIORITIES.HIGH,
      audience: AUDIENCES.HIRED_STAFF,
      sourcePath: 'seed.handbook.stress_management',
      searchKeywords: ['stress', 'mental health', 'overwhelmed', 'burnout']
    }
  ],

  emergencyReferences: [
    {
      id: 'reference-weather',
      title: 'Weather Reference',
      slug: 'weather-reference',
      referenceType: REFERENCE_TYPES.WEATHER,
      summary: 'Placeholder for leadership-approved severe weather reference content.',
      offlinePriority: OFFLINE_PRIORITIES.CRITICAL,
      sourcePath: 'seed.references.weather',
      searchKeywords: ['weather', 'storm', 'lightning', 'forecast']
    },
    {
      id: 'reference-missing-person',
      title: 'Missing Person Reference',
      slug: 'missing-person-reference',
      referenceType: REFERENCE_TYPES.MISSING_PERSON,
      summary: 'Placeholder for leadership-approved missing person reference content.',
      offlinePriority: OFFLINE_PRIORITIES.CRITICAL,
      sourcePath: 'seed.references.missing_person',
      searchKeywords: ['missing person', 'lost camper', 'accountability']
    },
    {
      id: 'reference-fire-weather',
      title: 'Fire Weather Reference',
      slug: 'fire-weather-reference',
      referenceType: REFERENCE_TYPES.FIRE_WEATHER,
      summary: 'Placeholder for leadership-approved fire weather and evacuation awareness content.',
      offlinePriority: OFFLINE_PRIORITIES.CRITICAL,
      sourcePath: 'seed.references.fire_weather',
      searchKeywords: ['fire', 'smoke', 'evacuation', 'forest']
    },
    {
      id: 'reference-safeguarding',
      title: 'Safeguarding Reference',
      slug: 'safeguarding-reference',
      referenceType: REFERENCE_TYPES.SAFEGUARDING,
      summary: 'Placeholder for leadership-approved safeguarding and reporting reference content.',
      offlinePriority: OFFLINE_PRIORITIES.CRITICAL,
      sourcePath: 'seed.references.safeguarding',
      searchKeywords: ['safeguarding', 'youth protection', 'reporting', 'boundaries']
    }
  ],

  checklistTemplates: [
    {
      id: 'checklist-required-paperwork',
      title: 'Required Paperwork',
      description: 'Core paperwork and confirmations staff should complete before arrival.',
      checklistType: CHECKLIST_TYPES.REQUIRED_PAPERWORK,
      audience: AUDIENCES.HIRED_STAFF,
      offlinePriority: OFFLINE_PRIORITIES.HIGH,
      itemIds: [
        'checklist-item-application-confirmed',
        'checklist-item-medical-form-status',
        'checklist-item-code-of-conduct',
        'checklist-item-required-training'
      ]
    },
    {
      id: 'checklist-packing-list',
      title: 'Packing List',
      description: 'Practical gear and clothing reminders for mountain camp conditions.',
      checklistType: CHECKLIST_TYPES.PACKING_LIST,
      audience: AUDIENCES.HIRED_STAFF,
      offlinePriority: OFFLINE_PRIORITIES.HIGH,
      itemIds: [
        'checklist-item-warm-layers',
        'checklist-item-rain-gear',
        'checklist-item-water-bottle',
        'checklist-item-sun-protection'
      ]
    }
  ],

  checklistItems: [
    {
      id: 'checklist-item-application-confirmed',
      label: 'Application status confirmed',
      description: 'Confirm that your staff application has been received and reviewed as appropriate.',
      category: 'paperwork',
      isRequired: true,
      sourcePath: 'seed.checklists.required_paperwork.application_confirmed'
    },
    {
      id: 'checklist-item-medical-form-status',
      label: 'Medical form status confirmed',
      description: 'Confirm required medical form receipt/status. Do not store detailed medical information in the app unless formally approved.',
      category: 'paperwork',
      isRequired: true,
      sourcePath: 'seed.checklists.required_paperwork.medical_form_status'
    },
    {
      id: 'checklist-item-code-of-conduct',
      label: 'Code of Conduct acknowledged',
      description: 'Review and acknowledge the current staff Code of Conduct.',
      category: 'conduct',
      isRequired: true,
      sourcePath: 'seed.checklists.required_paperwork.code_of_conduct'
    },
    {
      id: 'checklist-item-required-training',
      label: 'Required training status confirmed',
      description: 'Confirm required training status according to current leadership instructions.',
      category: 'training',
      isRequired: true,
      sourcePath: 'seed.checklists.required_paperwork.required_training'
    },
    {
      id: 'checklist-item-warm-layers',
      label: 'Warm layers',
      description: 'Bring clothing suitable for cold mountain mornings and evenings.',
      category: 'clothing',
      isRequired: true,
      sourcePath: 'seed.checklists.packing.warm_layers'
    },
    {
      id: 'checklist-item-rain-gear',
      label: 'Rain gear',
      description: 'Bring practical rain protection for storms and monsoon conditions.',
      category: 'clothing',
      isRequired: true,
      sourcePath: 'seed.checklists.packing.rain_gear'
    },
    {
      id: 'checklist-item-water-bottle',
      label: 'Water bottle',
      description: 'Bring a durable water bottle and use it. Altitude is not impressed by confidence.',
      category: 'gear',
      isRequired: true,
      sourcePath: 'seed.checklists.packing.water_bottle'
    },
    {
      id: 'checklist-item-sun-protection',
      label: 'Sun protection',
      description: 'Bring sunscreen, hat, sunglasses, or other sun protection suitable for long outdoor days.',
      category: 'gear',
      isRequired: true,
      sourcePath: 'seed.checklists.packing.sun_protection'
    }
  ],

  trainingModules: [
    {
      id: 'training-safeguarding-boundaries',
      title: 'Safeguarding Boundary Scenarios',
      description: 'Short scenario-based training for safe staff communication and youth protection boundaries.',
      moduleType: TRAINING_MODULE_TYPES.SCENARIO_CARDS,
      relatedContentId: 'reference-safeguarding',
      requiredForRole: ['Staff'],
      offlinePriority: OFFLINE_PRIORITIES.CRITICAL,
      estimatedMinutes: 10,
      isRequired: true,
      content: {
        status: 'placeholder',
        note: 'Add leadership-approved scenario content later.'
      }
    },
    {
      id: 'training-campfire-planning',
      title: 'Campfire Planning Builder',
      description: 'A practical builder for campfire pacing, energy, transitions, and closing tone.',
      moduleType: TRAINING_MODULE_TYPES.CHECKLIST_WALKTHROUGH,
      relatedContentId: 'songbook-campfire-planning',
      requiredForRole: ['Program Staff'],
      offlinePriority: OFFLINE_PRIORITIES.NORMAL,
      estimatedMinutes: 12,
      isRequired: false,
      content: {
        status: 'placeholder',
        note: 'Add campfire planning prompts later.'
      }
    }
  ],

  songbookItems: [
    {
      id: 'songbook-campfire-planning',
      title: 'Campfire Planning Builder',
      slug: 'campfire-planning-builder',
      category: 'training',
      lyrics: '',
      teachingNotes: 'Use this as a planning reference for building campfire energy, pacing, and transitions.',
      performanceNotes: 'Start strong, vary energy, avoid dead air, and end with intention.',
      offlinePriority: OFFLINE_PRIORITIES.NORMAL,
      sourcePath: 'seed.songbook.campfire_planning'
    }
  ],

  leadershipContacts: [
    {
      id: 'leadership-camp-director-placeholder',
      displayName: 'Camp Director',
      roleTitle: 'Camp Director',
      programArea: 'Camp Leadership',
      contactType: 'role_placeholder',
      sortOrder: 10,
      isPublic: false,
      isStaffVisible: true,
      isAdminVisible: true,
      notes: 'Replace with current season leadership after approval.'
    },
    {
      id: 'leadership-program-director-placeholder',
      displayName: 'Program Director',
      roleTitle: 'Program Director',
      programArea: 'Program',
      contactType: 'role_placeholder',
      sortOrder: 20,
      isPublic: false,
      isStaffVisible: true,
      isAdminVisible: true,
      notes: 'Replace with current season leadership after approval.'
    }
  ],

  campContactInfo: [
    {
      id: 'camp-contact-current-placeholder',
      label: 'Camp Lawton Contact Information',
      addresseeTemplate: 'Staff Name, Staff',
      organization: 'Camp Lawton',
      addressLine1: '',
      addressLine2: '',
      city: 'Mount Lemmon',
      state: 'AZ',
      zip: '',
      phone: '',
      notes: 'Verify current official contact information before publishing.',
      isCurrent: false
    }
  ],

  glossaryTerms: [
    {
      term: 'Cached copy',
      definition: 'Information saved on this device from a previous successful sync. Useful, but possibly outdated.'
    },
    {
      term: 'Available offline',
      definition: 'This content should remain available after first successful sync, even without network service.'
    },
    {
      term: 'Needs connection',
      definition: 'This action requires the network before it can be completed or confirmed.'
    },
    {
      term: 'May be outdated',
      definition: 'The app cannot confirm this information is current. Check official leadership instructions when it matters.'
    }
  ]
};

export function getCriticalOfflineContent(seed = contentSeed) {
  return {
    contentItems: seed.contentItems.filter(item => item.offlinePriority === OFFLINE_PRIORITIES.CRITICAL),
    emergencyReferences: seed.emergencyReferences.filter(item => item.offlinePriority === OFFLINE_PRIORITIES.CRITICAL),
    trainingModules: seed.trainingModules.filter(item => item.offlinePriority === OFFLINE_PRIORITIES.CRITICAL)
  };
}

export function buildSearchSeed(seed = contentSeed) {
  const contentResults = seed.contentItems.map(item => ({
    id: item.id,
    title: item.title,
    type: item.contentType,
    summary: item.summary,
    keywords: item.searchKeywords || [],
    offlinePriority: item.offlinePriority,
    sourcePath: item.sourcePath
  }));

  const emergencyResults = seed.emergencyReferences.map(item => ({
    id: item.id,
    title: item.title,
    type: CONTENT_TYPES.EMERGENCY_REFERENCE,
    summary: item.summary,
    keywords: item.searchKeywords || [],
    offlinePriority: item.offlinePriority,
    sourcePath: item.sourcePath,
    safetyPriority: true
  }));

  const checklistResults = seed.checklistItems.map(item => ({
    id: item.id,
    title: item.label,
    type: 'checklist_item',
    summary: item.description,
    keywords: [item.category, item.label],
    offlinePriority: OFFLINE_PRIORITIES.HIGH,
    sourcePath: item.sourcePath
  }));

  return [...emergencyResults, ...contentResults, ...checklistResults];
}
