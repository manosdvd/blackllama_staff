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
  documentStoragePath?: string;
  verifierUserId?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}
