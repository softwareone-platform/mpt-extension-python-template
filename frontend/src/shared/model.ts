export interface Reference {
  id?: string;
  name?: string;
}

export interface AgreementParameter {
  externalId?: string;
  name?: string;
  // Marketplace parameter values can be strings or structured objects
  // (e.g. an address: { addressLine1, city, country, ... }).
  value?: unknown;
}

export interface AgreementParameters {
  fulfillment?: AgreementParameter[];
  ordering?: AgreementParameter[];
}

export type AgreementCollection = number | unknown[];

export interface AgreementSyncResult {
  assets: AgreementCollection;
  buyer?: Reference;
  client?: Reference;
  currency?: string;
  id: string;
  licensee?: Reference;
  lines: AgreementCollection;
  name?: string;
  order?: Reference;
  parameters?: AgreementParameters;
  product?: Reference;
  seller?: Reference;
  status?: string;
  subscriptions: AgreementCollection;
}

export interface ApiResponse<T> {
  data: T;
}

export interface AgreementContext {
  data?: {
    agreement?: Reference;
  };
}

export function resolveAgreementId(context?: AgreementContext): string {
  return context?.data?.agreement?.id?.trim() ?? '';
}

export function formatReference(reference?: Reference): string {
  if (!reference?.id && !reference?.name) return 'Not available';
  if (reference.id && reference.name) return `${reference.name} (${reference.id})`;
  return reference.name ?? reference.id ?? 'Not available';
}

export function formatParameterValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (typeof value === 'object') {
    const parts = Object.values(value as Record<string, unknown>)
      .filter((part) => part !== null && part !== undefined && part !== '' && typeof part !== 'object')
      .map((part) => String(part));
    return parts.length > 0 ? parts.join(', ') : '—';
  }
  return String(value);
}

export function formatCollectionCount(value: AgreementCollection | null | undefined): string {
  if (Array.isArray(value)) {
    return String(value.length);
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return '—';
}
