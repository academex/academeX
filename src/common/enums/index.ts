export enum Role {
  ADMIN = 'admin',
  STAFF = 'staff',
  USER = 'user',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ticket status
export enum Status {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'reserved',
  CLOSED = 'closed',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DES_ACTIVE = 'des_active',
}
