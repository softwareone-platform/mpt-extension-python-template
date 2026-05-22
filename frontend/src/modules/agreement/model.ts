export interface Reference {
  id?: string;
  name?: string;
}

export interface AgreementSyncResult {
  assets: number;
  buyer?: Reference;
  client?: Reference;
  id: string;
  lines: number;
  name?: string;
  product?: Reference;
  seller?: Reference;
  status?: string;
  subscriptions: number;
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
