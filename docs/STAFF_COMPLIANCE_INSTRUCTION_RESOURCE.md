# Staff Compliance Instruction Resource

_Last updated: 2026-06-28_

This document is the implementation reference for turning the Scouting America summer camp staff compliance research into app behavior inside `blackllama_staff`.

It is written for developers, content editors, and camp administrators. It is not legal advice, payroll advice, or a substitute for current NCAP standards, Scouting America policy, council direction, Pima County requirements, Arizona law, federal law, or insurer requirements.

## Core product rule

The Camp Lawton Staff Portal may **teach, explain, remind, link, collect status, and route users to the right authority**.

The portal must **not claim to certify** any official external credential unless Camp Lawton/Catalina Council is actually the issuing authority and the required instructor/approver records exist.

### Certification authority rules

| Requirement type | App may do | App must not do |
|---|---|---|
| Scouting America Safeguarding Youth / Youth Protection | Explain why it is required, link to the official training, capture certificate metadata, allow upload for admin review, show expiration/renewal status | Certify, recreate, replace, scrape, iframe, or mark official completion without official evidence |
| NCAP-required Scouting America trainings | Link to official or council-approved course, track evidence, track expiration, record verified status | Pretend an internal module satisfies NCAP unless the council has approved that exact module/process |
| National Camping School | Link to official NCS resources and record certificate details | Certify NCS completion |
| CPR/AED, First Aid, Lifeguard, Food Handler, Pool Operator, NRA/USA Archery/COPE/climbing/etc. | Track provider, certificate, dates, file evidence, and approver | Issue those credentials unless the council is the actual approved provider |
| Internal Camp Lawton orientation, handbook acknowledgement, area walkthroughs, quizzes, mock scenarios | Deliver and certify internal completion | Label internal completion as an official Scouting America or government credential |
| Government employment, tax, payroll, I-9, E-Verify, workers comp, mandated reporting, Pima County permits | Provide checklists and links; route to authorized HR/admin systems | Collect SSNs/tax documents/medical details in the prototype; give legal/payroll advice as final authority |

Recommended UI copy:

> This module helps you understand the requirement. Official certification must be completed through the linked authority and verified by camp leadership.

## Required external training bridge

### Safeguarding Youth / Youth Protection

Safeguarding Youth is the clearest boundary case. The portal should provide a requirement card with:

- Requirement title: `Safeguarding Youth / Youth Protection`
- Authority: `Scouting America`
- Official information page: [Scouting America Youth Protection](https://www.scouting.org/training/youth-protection/)
- Official training hub: [My.Scouting.org](https://my.scouting.org/)
- Status values: `not_started`, `linked_out`, `self_reported_complete`, `certificate_uploaded`, `admin_verified`, `rejected`, `expired`
- Evidence fields: certificate file, completion date, expiration date if printed, member ID/reference number if provided, admin verifier, verification timestamp
- UI copy: `Camp Lawton cannot certify Safeguarding Youth inside this app. Complete it through My.Scouting.org, then upload or show your certificate for verification.`

Do not hard-code a two-year renewal cycle. Store the certificate’s displayed expiration date when available. Scouting America’s current public page says Safeguarding Youth training is required for registered volunteers and must be taken every year, so the app should re-check the official page every season before generating current-year copy.

### Peer-on-peer abuse training

Scouting America’s current Youth Protection page says the online `Peer-On-Peer Abuse` course supersedes the previous facilitated `Understanding and Preventing Youth-on-Youth Abuse` course and is tailored to camp and NYLT staff for NCAP SQ-402.B.2.

The portal should:

- Link users to the official or council-approved course location when available.
- Store it as a separate requirement from Safeguarding Youth.
- Allow internal reinforcement scenarios, but label them as **practice**, not the official course.

## Implementation model

Build around requirements, not one giant checklist.

```ts
export type ComplianceAuthority =
  | 'scouting_america'
  | 'ncap'
  | 'council'
  | 'camp_lawton'
  | 'pima_county'
  | 'arizona'
  | 'federal'
  | 'third_party';

export type ComplianceStatus =
  | 'not_applicable'
  | 'not_started'
  | 'in_progress'
  | 'linked_out'
  | 'self_reported_complete'
  | 'evidence_uploaded'
  | 'pending_admin_review'
  | 'admin_verified'
  | 'rejected'
  | 'expired'
  | 'blocked';

export interface ComplianceRequirement {
  id: string;
  title: string;
  category: string;
  authority: ComplianceAuthority[];
  officialLinks: Array<{
    label: string;
    url: string;
    purpose: 'official_policy' | 'official_training' | 'form' | 'government_rule' | 'local_permit' | 'reference';
  }>;
  appCanCertify: boolean;
  appCanTeachSupplemental: boolean;
  appliesTo: string[];
  requiredEvidence: string[];
  timing: string;
  blockingRule?: string;
  expirationRule?: string;
  seasonalReviewRequired: boolean;
  privacyLevel: 'public_reference' | 'staff_only' | 'admin_only' | 'health_confidential' | 'hr_confidential';
}

export interface StaffComplianceEvidence {
  staffProfileId: string;
  requirementId: string;
  status: ComplianceStatus;
  evidenceKind:
    | 'certificate'
    | 'signed_acknowledgement'
    | 'external_completion'
    | 'admin_observed'
    | 'form_received'
    | 'license_number'
    | 'not_stored_in_app';
  issuer?: string;
  completionDate?: string;
  expirationDate?: string;
  documentStoragePath?: string; // private bucket only, never public
  verifierUserId?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}
```

### Blocking rule pattern

| Level | Meaning | Example |
|---|---|---|
| `hard_block` | Staff cannot begin service or role assignment until resolved | Safeguarding Youth, registration, adult background clearance, missing AHMR |
| `role_block` | Staff can be employed but cannot work a specific role/activity | Aquatics Director credential, range credential, food handler card |
| `schedule_block` | Staff can work, but scheduler must prevent illegal shifts/tasks | 14–15-year-old labor hour limits |
| `admin_warning` | Requires admin review before season or inspection | permit deadlines, payroll setup, staff training plan |
| `reference_only` | App provides policy reference but does not store personal evidence | incident reporting, sunscreen policy, code of conduct |

## MVP screens and behaviors

### Staff onboarding dashboard

Group cards by:

1. Scouting registration and safeguarding
2. Employment and payroll
3. Medical and emergency readiness
4. Required trainings
5. Role-specific credentials
6. Conduct and digital boundaries
7. Local health/sanitation requirements where applicable

Each card should show: required/conditional/optional status, who it applies to, authority, action required, official link, evidence required, verifier, status, due date, and expiration.

### External requirement card

Use a reusable `<ExternalRequirementCard />` with:

- Large `Go to official training` button.
- Secondary `I completed this` button that moves status to `self_reported_complete`, not `verified`.
- Upload/record evidence flow.
- Admin verification step.
- A clear statement that the app is not the certifying platform.

### Internal learning modules

Internal modules are useful and should focus on Camp Lawton procedures, where to report, scenario practice, and how to find official resources. Use completion language like `Camp Lawton module complete`, not official certificate language.

### Admin verification queue

Admins need staff name, requirement, uploaded evidence, completion date, expiration date, claimed issuer, role impact, approve/reject buttons, rejection reason, and audit log entry. Verification must be auditable. No silent status changes.

### Role assignment guardrails

When assigning a staff member to a role, check age minimum, registration, Safeguarding status, adult/background status where applicable, role credentials, AHMR received status, youth labor scheduling constraints, and council approval if required.

Never rely on CSS/UI hiding for protection. Use server-side checks and Supabase Row Level Security when this moves beyond prototype.

## Requirement groups

### A. Scouting registration and screening

Use as hard blocks before staff service.

| ID | Requirement | App instruction |
|---|---|---|
| `NCAP-SQ-401-001` | Register all camp staff annually in the correct camp staff category | Track registration category, submitted date, approved/current status, and season year. Block service if not current. |
| `NCAP-SQ-401-002` | Turning-18 staff pathway | Flag anyone whose 18th birthday falls during the season. Require adult pathway planning and background process tracking. |
| `NCAP-SQ-401-003` | Contractor/outside provider screening | Require contractor roster and screening/contract evidence before site/youth access. |
| `SCOUTING-BG-001` | Adult application/background/reference/VSD | For 18+ staff, track adult application, criminal background check authorization/adjudication, Volunteer Screening Database clearance, and YP status. |

Links:

- [Youth Protection and Adult Leadership](https://www.scouting.org/health-and-safety/gss/gss01/)
- [Adult Leader Selection Process](https://www.scouting.org/about/youth-safety/adult-leader-selection-process/)
- [My.Scouting.org](https://my.scouting.org/)

### B. Safeguarding and youth protection

| ID | Requirement | App instruction |
|---|---|---|
| `SCOUTING-YPT-001` | Safeguarding Youth / Youth Protection | Link to official Scouting America training. Track certificate evidence. Do not certify in-app. |
| `AZ-MANDATED-REPORTING-001` | Arizona child abuse/neglect reporting | Provide emergency/action reference. Make clear reporting cannot be delegated. Include Arizona DCS and law enforcement routing. |
| `NCAP-SQ-402-CORE-001` | Peer-on-peer abuse and other core NCAP trainings | Treat official/council course completion as external evidence; internal scenarios are supplemental practice only. |

Links:

- [Scouting America Youth Protection](https://www.scouting.org/training/youth-protection/)
- [My.Scouting.org](https://my.scouting.org/)
- [Guide to Safe Scouting: Youth Protection and Adult Leadership](https://www.scouting.org/health-and-safety/gss/gss01/)
- [Arizona DCS: Report Child Abuse](https://dcs.az.gov/report-child-abuse)

### C. Staff training plan and completion

| ID | Requirement | App instruction |
|---|---|---|
| `NCAP-SQ-402-PLAN-001` | Written staff training plan | Store/upload the approved annual training plan. Include position-specific syllabus links and council approval record. |
| `NCAP-SQ-402-LONGTERM-001` | Long-term camp staff training hours | Track at least 28 instructional hours before long-term camp operation. Do not count setup, moving inventory, tent pitching, or administrative labor as instructional hours. |
| `NCAP-SQ-402-DAYCAMP-001` | Day camp training hours | Track 4 hours for single-day day camp leadership or 8 hours for longer day camps where applicable. |
| `NCAP-SQ-402-FIRSTAID-001` | Staff first aid / CPR-AED coverage | Dashboard should calculate both 50% staff coverage and 1:25 trained staff/adult volunteer to camper ratio. |
| `NCAP-SQ-402-SHARED-001` | Shared staff orientation | If a person works across camp types/programs, require cross-program briefing status. |

Links:

- [2026 NCAP Standards PDF](https://www.scouting.org/wp-content/uploads/2025/12/2026-NCAP-Standards-v2.pdf)
- [National Camping School](https://www.scouting.org/outdoor-programs/national-camping-school/)

### D. Medical and health records

| ID | Requirement | App instruction |
|---|---|---|
| `NCAP-HS-503-001` | Annual Health and Medical Record | Track received status and required parts. Staff staying/serving over 72 hours need Parts A, B, and C. Day/shorter contexts may need A and B. |
| `NCAP-HS-503-002` | AHMR confidentiality | Do not store medical details in normal app tables. If digital evidence is stored, use private storage, strict RLS, audit logs, emergency access procedures, and health-confidential access. |
| `NCAP-HS-504-001` | Medical screening on arrival | Add check-in task for qualified adult screening, medication review, and secure medication storage log. |
| `NCAP-HS-505-001` | Council health supervisor policies | Track annual written medical policy review and approval by council health supervisor. |

Links:

- [Scouting America Annual Health and Medical Record](https://www.scouting.org/health-and-safety/ahmr/)
- [National Camping School AHMR references](https://www.scouting.org/outdoor-programs/national-camping-school/)

Privacy rule: the app should usually store `AHMR received: yes/no`, `parts present`, `reviewed_by`, `reviewed_at`, and `storage_location`, not diagnosis, medication, allergy, or health history fields.

### E. Age, youth labor, and scheduling

| ID | Requirement | App instruction |
|---|---|---|
| `NCAP-SQ-401-AGE-001` | NCAP minimum staff ages | Role engine must know minimum age by position. |
| `FED-DOL-CHILD-LABOR-001` | Federal hours limits for 14–15-year-old paid employees | Scheduler must block shifts outside legal hours and excessive daily/weekly totals. |
| `AZ-CHILD-LABOR-001` | Arizona youth employment rules | Apply stricter federal/state rule. Do not treat parent permission as a waiver. |

Operational guardrail:

- 14–15-year-old paid staff generally cannot be scheduled before 7:00 a.m.
- From June 1 through Labor Day, do not schedule them after 9:00 p.m.
- During school-year rules, do not schedule them after 7:00 p.m.
- Prevent hazardous duty assignment for under-16 staff.

Links:

- [U.S. DOL Child Labor Fact Sheet #43](https://www.dol.gov/agencies/whd/fact-sheets/43-child-labor-non-agriculture)
- [Arizona Youth Employment Hours Restrictions](https://www.azica.gov/labor-youth-employment-hours-restrictions)
- [Arizona Youth Employment FAQ](https://www.azica.gov/labor-youth-employment-frequently-asked-questions)

### F. Employment, payroll, tax, and HR

The app can assist onboarding, but the prototype must not become the payroll/tax system.

| ID | Requirement | App instruction |
|---|---|---|
| `FED-I9-001` | Form I-9 completion | Provide HR checklist/status only. Link to USCIS. Do not collect I-9 documents in this app unless council explicitly approves a compliant HR workflow. |
| `AZ-EVERIFY-001` | Arizona E-Verify | Track employer/admin completion status if applicable. |
| `IRS-PAYROLL-001` | Federal W-4 and withholding | Route to HR/payroll system. Do not give individualized tax advice. |
| `IRS-PAYROLL-002` | Payroll tax reporting and W-2/1099 distinction | Track employee classification decisions as admin-only notes; route actual filing to payroll professionals. |
| `AZ-WITHHOLDING-001` | Arizona Form A-4 | Link form/process; track received status in HR view. |
| `AZ-NEW-HIRE-001` | Arizona new hire reporting | Admin checklist due within required reporting window. |
| `AZ-WAGE-001` | Arizona/current local minimum wage | Store season/year wage floor in config. Do not hard-code old rates. |
| `AZ-SICK-001` | Arizona earned paid sick time | Track through payroll/timekeeping, not through a gamified training UI. |
| `AZ-PAYDAYS-001` | Arizona fixed paydays | HR reference only. |
| `AZ-WC-001` | Workers' compensation | Admin requirement; not a staff-facing task except injury reporting instructions. |

Links:

- [USCIS Form I-9](https://www.uscis.gov/i-9)
- [IRS Publication 15](https://www.irs.gov/publications/p15)
- [IRS Form 941](https://www.irs.gov/forms-pubs/about-form-941)
- [Arizona Withholding Tax](https://azdor.gov/business/withholding-tax)
- [Arizona New Hire Reporting](https://des.az.gov/services/employment/unemployment-employer/employer-requirements-record-keeping)
- [Arizona E-Verify statute](https://www.azleg.gov/ars/23/00214.htm)
- [Arizona Attorney General: Legal Arizona Workers Act](https://www.azag.gov/civil-rights/legal-az-workers-act/employers)
- [Arizona 2026 Minimum Wage Notice](https://www.azica.gov/sites/default/files/2025-10/2026%20Minimum%20Wage.pdf)
- [Arizona earned paid sick time statute](https://www.azleg.gov/ars/23/00372.htm)
- [Arizona workers' compensation FAQ](https://www.azica.gov/sites/default/files/migrated_pdf/Claims_FAQs_WorkersCompensation.pdf)

### G. Local permits, food, sanitation, and pools

These are mostly admin/camp operations requirements, not general staff tasks.

| ID | Requirement | App instruction |
|---|---|---|
| `PIMA-CHFS-001` | Pima County permits/inspections | Admin dashboard should track annual camp/food/pool permit status, submission date, inspection status, and posted-license confirmation. |
| `PIMA-FOOD-001` | Food service certification | Kitchen/food program staff roles should require Food Handler or CFPM evidence as applicable. |
| `PIMA-POOL-001` | Certified pool operator | Aquatics/pool operation should require operator evidence where applicable. |
| `OSHA-HEAT-001` | Heat illness prevention | Add field-ready heat safety reference and staff training acknowledgement. |

Links:

- [Pima County Permitting & Inspections](https://www.pima.gov/2266/Permitting-Inspections)
- [Pima County Food Code § 8.08.050](https://codelibrary.amlegal.com/codes/pimacounty/latest/pimacounty_az/0-0-0-3381)
- [Pima County Food & Pool Certification](https://www.pima.gov/2053/Food-Pool-Certification)
- [Pima County Pool Code § 8.32.240](https://codelibrary.amlegal.com/codes/pimacounty/latest/pimacounty_az/0-0-0-4286)
- [OSHA Heat: Water. Rest. Shade.](https://www.osha.gov/heat-exposure/water-rest-shade)

### H. Role-specific qualifications

The app should prevent accidental role assignment when credentials are missing.

| Role | Minimum app rule |
|---|---|
| Camp Director | 21+, proper current NCS certificate for camp type, no other duties where NCAP says so |
| Program Director | 21+, proper current NCS certificate for camp type, no other duties where NCAP says so |
| Short-term Camp Administrator | 21+, accepted NCS/short-term administrator training |
| Lead Ranger/Superintendent | 21+, ranger credentials, continuing education, first aid/CPR-AED, Hazardous Weather |
| Assistant Ranger | 18+, qualifications as applicable |
| Camp Health Officer | 18+, CHO training, EMS-response-time-dependent medical/first aid credentials, backup coverage |
| Aquatics Director | 21+, BSA Aquatics Instructor/NCS or approved waiver, lifeguard, first aid, CPR/AED Professional Rescuer/equivalent |
| Lifeguard | Certification plus local competency check. Certification alone is not enough. 15-year-old paid lifeguards limited to pools; non-pool swimming lifeguards 16+. |
| Range/Target Supervisor | Use the NCAP Range Supervision Chart; archery typically 18+, firearms/pellet generally 21+ with discipline-specific credentials |
| COPE/Climbing | Level I generally 18+; Level II/director generally 21+ with applicable credentials |
| Trek Director/Staff | Director generally 21+; staff generally 18+; wilderness first aid/CPR-AED where required |
| Adventure program staff | Match the Authorization to Operate, variance, and activity-specific staff plan |
| Ecology/Conservation, Outdoor Skills, First-Year Camper | Track NCS or approved equivalent/waiver |
| Food Service Supervisor | Track local/Pima County certification or accepted manager credential |
| International/J-1 Staff | Track sponsor/council approval, visa/program limitations, tax handling, and Scouting America international restrictions |

Links:

- [National Camping School](https://www.scouting.org/outdoor-programs/national-camping-school/)
- [2026 NCAP Standards PDF](https://www.scouting.org/wp-content/uploads/2025/12/2026-NCAP-Standards-v2.pdf)
- [Range & Target Activities](https://www.scouting.org/outdoor-programs/range-target-activities/)

### I. Conduct, devices, and digital boundaries

Make these searchable policy references and staff acknowledgement items.

Minimum content:

- Scouter Code of Conduct
- no alcohol, illegal drugs, marijuana, controlled substances, pornography, hazing, bullying, harassment, weapons, or unsafe behavior
- tobacco/vape restrictions per current Scouting/council/camp policy
- no one-on-one adult/youth digital messaging
- private online communications must include another registered leader or parent/guardian
- no smartphones/cameras/drones/etc. where privacy is expected
- staff forum must have no DMs, no anonymous posting, no disappearing messages, moderation logs, and report/escalation controls

Links:

- [Guide to Safe Scouting: Youth Protection and Adult Leadership](https://www.scouting.org/health-and-safety/gss/gss01/)
- [Scouter Code of Conduct](https://www.scouting.org/health-and-safety/gss/bsa-scouter-code-of-conduct/)
- [Incident Reporting](https://www.scouting.org/health-and-safety/incident-report/)

## Suggested seed records

```ts
export const complianceRequirementsSeed: ComplianceRequirement[] = [
  {
    id: 'SCOUTING-YPT-001',
    title: 'Safeguarding Youth / Youth Protection',
    category: 'youth_protection',
    authority: ['scouting_america'],
    officialLinks: [
      {
        label: 'Scouting America Youth Protection information',
        url: 'https://www.scouting.org/training/youth-protection/',
        purpose: 'official_policy',
      },
      {
        label: 'My.Scouting.org training hub',
        url: 'https://my.scouting.org/',
        purpose: 'official_training',
      },
    ],
    appCanCertify: false,
    appCanTeachSupplemental: true,
    appliesTo: ['all camp staff where required', 'all registered adult leaders'],
    requiredEvidence: ['certificate or official completion record', 'completion date', 'expiration date if available'],
    timing: 'Before registration/service; renew according to current Scouting America policy and certificate expiration.',
    blockingRule: 'hard_block if missing, unverified, or expired before/during season',
    expirationRule: 'Use certificate expiration when present; otherwise require annual season review.',
    seasonalReviewRequired: true,
    privacyLevel: 'admin_only',
  },
  {
    id: 'NCAP-SQ-402-LONGTERM-001',
    title: 'Long-term camp staff training hours',
    category: 'training',
    authority: ['ncap', 'council'],
    officialLinks: [
      {
        label: '2026 NCAP Standards',
        url: 'https://www.scouting.org/wp-content/uploads/2025/12/2026-NCAP-Standards-v2.pdf',
        purpose: 'official_policy',
      },
    ],
    appCanCertify: true,
    appCanTeachSupplemental: true,
    appliesTo: ['long-term camp staff'],
    requiredEvidence: ['training agenda', 'attendance roster', 'hours log', 'NCS-trained supervisor record'],
    timing: 'Before long-term camp program operation.',
    blockingRule: 'hard_block if required instructional hours are incomplete',
    expirationRule: 'Season-specific.',
    seasonalReviewRequired: true,
    privacyLevel: 'admin_only',
  },
  {
    id: 'NCAP-HS-503-001',
    title: 'Annual Health and Medical Record',
    category: 'health_forms',
    authority: ['scouting_america', 'ncap', 'council'],
    officialLinks: [
      {
        label: 'Scouting America AHMR',
        url: 'https://www.scouting.org/health-and-safety/ahmr/',
        purpose: 'form',
      },
    ],
    appCanCertify: false,
    appCanTeachSupplemental: false,
    appliesTo: ['all staff', 'participants', 'adult leaders'],
    requiredEvidence: ['received status', 'parts present', 'provider signature where Part C is required'],
    timing: 'Before/on arrival; accessible while person is in attendance.',
    blockingRule: 'hard_block if missing required AHMR parts',
    expirationRule: 'Use current AHMR/council rules; Part C generally current within 12 months for long-term use.',
    seasonalReviewRequired: true,
    privacyLevel: 'health_confidential',
  },
];
```

## Source registry

These are the source links from the 2026 Pima County / Arizona summer camp staff requirements compilation. Re-check all links before every season and whenever Scouting America releases updated NCAP standards or training names.

| ID | Publisher | Link | Type |
|---|---|---|---|
| `SRC_NCAP_2026` | Scouting America | [2026 National Camp Accreditation Program Standards](https://www.scouting.org/wp-content/uploads/2025/12/2026-NCAP-Standards-v2.pdf) | Scouting America accreditation standard |
| `SRC_SCOUTING_YPT_GSS` | Scouting America Guide to Safe Scouting | [Youth Protection and Adult Leadership](https://www.scouting.org/health-and-safety/gss/gss01/) | Scouting America policy |
| `SRC_SCOUTING_ADULT_SELECTION` | Scouting America | [Adult Leader Selection Process](https://www.scouting.org/about/youth-safety/adult-leader-selection-process/) | Scouting America policy |
| `SRC_SCOUTING_AHMR` | Scouting America | [Annual Health and Medical Record](https://www.scouting.org/health-and-safety/ahmr/) | Scouting America health form policy |
| `SRC_SCOUTING_NCS` | Scouting America | [National Camping School](https://www.scouting.org/outdoor-programs/national-camping-school/) | Scouting America training |
| `SRC_IRS_PUB15_2026` | Internal Revenue Service | [Publication 15 (2026), Employer's Tax Guide](https://www.irs.gov/publications/p15) | federal tax guidance |
| `SRC_IRS_FORM941` | Internal Revenue Service | [About Form 941](https://www.irs.gov/forms-pubs/about-form-941) | federal tax filing guidance |
| `SRC_USCIS_I9` | U.S. Citizenship and Immigration Services | [Form I-9](https://www.uscis.gov/i-9) | federal employment eligibility |
| `SRC_DOL_CHILD_LABOR` | U.S. Department of Labor | [Fact Sheet #43: Child Labor](https://www.dol.gov/agencies/whd/fact-sheets/43-child-labor-non-agriculture) | federal labor guidance |
| `SRC_DOL_SEASONAL_EXEMPTION` | U.S. Department of Labor | [Fact Sheet #18: Seasonal Amusement/Recreational Establishments](https://www.dol.gov/agencies/whd/fact-sheets/18-flsa-seasonal-amusement) | federal wage and hour guidance |
| `SRC_OSHA_HEAT` | OSHA | [Heat: Water. Rest. Shade.](https://www.osha.gov/heat-exposure/water-rest-shade) | federal workplace safety guidance |
| `SRC_AZ_CHILD_LABOR_HOURS` | Industrial Commission of Arizona | [Youth Employment Hours Restrictions](https://www.azica.gov/labor-youth-employment-hours-restrictions) | Arizona labor guidance |
| `SRC_AZ_CHILD_LABOR_FAQ` | Industrial Commission of Arizona | [Youth Employment FAQ](https://www.azica.gov/labor-youth-employment-frequently-asked-questions) | Arizona labor guidance |
| `SRC_AZ_MIN_WAGE_2026` | Industrial Commission of Arizona | [2026 Arizona Minimum Wage Notice](https://www.azica.gov/sites/default/files/2025-10/2026%20Minimum%20Wage.pdf) | Arizona wage guidance |
| `SRC_AZ_PAID_SICK_TIME` | Arizona Legislature | [A.R.S. § 23-372 Accrual of earned paid sick time](https://www.azleg.gov/ars/23/00372.htm) | Arizona statute |
| `SRC_AZ_WITHHOLDING` | Arizona Department of Revenue | [Arizona Withholding Tax](https://azdor.gov/business/withholding-tax) | Arizona tax guidance |
| `SRC_AZ_NEW_HIRE` | Arizona Department of Economic Security | [Employer Requirements / New Hires](https://des.az.gov/services/employment/unemployment-employer/employer-requirements-record-keeping) | Arizona employer guidance |
| `SRC_AZ_WORKERS_COMP` | Industrial Commission of Arizona | [Workers' Compensation FAQ](https://www.azica.gov/sites/default/files/migrated_pdf/Claims_FAQs_WorkersCompensation.pdf) | Arizona workers' compensation guidance |
| `SRC_AZ_EVERIFY_STATUTE` | Arizona Legislature | [A.R.S. § 23-214 Verification of employment eligibility](https://www.azleg.gov/ars/23/00214.htm) | Arizona statute |
| `SRC_AZ_EVERIFY_AG` | Arizona Attorney General | [Legal Arizona Workers Act - Employers](https://www.azag.gov/civil-rights/legal-az-workers-act/employers) | Arizona employer guidance |
| `SRC_AZ_DCS_REPORTING` | Arizona DCS / Arizona Legislature | [Report Child Abuse](https://dcs.az.gov/report-child-abuse) | Arizona child safety reporting |
| `SRC_PIMA_CHFS_PERMITS` | Pima County | [Permitting & Inspections](https://www.pima.gov/2266/Permitting-Inspections) | Pima County permitting guidance |
| `SRC_PIMA_FOOD_CODE` | Pima County Code | [Pima County Code § 8.08.050](https://codelibrary.amlegal.com/codes/pimacounty/latest/pimacounty_az/0-0-0-3381) | Pima County code |
| `SRC_PIMA_POOL_CERTIFICATION` | Pima County | [Food & Pool Certification](https://www.pima.gov/2053/Food-Pool-Certification) | Pima County guidance |
| `SRC_PIMA_POOL_CODE` | Pima County Code | [Pima County Code § 8.32.240](https://codelibrary.amlegal.com/codes/pimacounty/latest/pimacounty_az/0-0-0-4286) | Pima County code |

## Data-safety notes for this repo

The current repository README already says the prototype must not collect real staff, candidate, parent/guardian, medical, or application data yet. Keep that rule. Build the compliance model first with seed data and fake/test users.

Before real use, the portal needs:

- Supabase RLS for every compliance and evidence table
- private storage buckets for uploaded evidence
- admin-only access to HR compliance data
- health-confidential access boundaries for AHMR/medical status
- audit logs for every verification action
- seasonal archive/rollover plan
- stale-content labels for cached compliance references
- a governance process for updating links and requirement copy

## Annual update checklist

Before each camp season:

1. Download/review the current NCAP standards.
2. Confirm current Scouting America training names and renewal cycles.
3. Confirm My.Scouting.org links and whether direct course links still work.
4. Confirm council-specific registration categories and background check process.
5. Confirm AHMR version and council health supervisor policy.
6. Confirm Arizona minimum wage, earned sick time, youth labor, E-Verify, new hire reporting, and workers comp requirements.
7. Confirm IRS/USCIS links and payroll workflow.
8. Confirm Pima County permit, food, pool, and inspection requirements.
9. Update season-specific config instead of hard-coding values in components.
10. Have the Camp Director/Program Director/HR/council designee sign off on the app’s current compliance copy.

## Bottom line

The staff portal should be the calm, clear trail map through the mess.

It should never pretend to be the mountain, the council, Scouting America, Pima County, Arizona, the IRS, USCIS, OSHA, or the Department of Labor.
