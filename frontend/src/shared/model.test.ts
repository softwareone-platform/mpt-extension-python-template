import { formatParameterValue, formatReference, resolveAgreementId } from './model';

describe('agreement model helpers', () => {
  it('resolves agreement id from the Marketplace context agreement', () => {
    const result = resolveAgreementId({
      data: {
        agreement: {
          id: 'AGR-1234-5678-9012',
        },
      },
    });

    expect(result).toBe('AGR-1234-5678-9012');
  });

  it('trims agreement id from the Marketplace context agreement', () => {
    const result = resolveAgreementId({
      data: {
        agreement: {
          id: ' AGR-9876-5432-1098 ',
        },
      },
    });

    expect(result).toBe('AGR-9876-5432-1098');
  });

  it('returns an empty agreement id when the context agreement is missing', () => {
    const result = resolveAgreementId({});

    expect(result).toBe('');
  });

  it('formats a reference with both id and name', () => {
    const result = formatReference({ id: 'PRD-1', name: 'Product' });

    expect(result).toBe('Product (PRD-1)');
  });

  it('formats a reference with only an id', () => {
    const result = formatReference({ id: 'PRD-1' });

    expect(result).toBe('PRD-1');
  });

  it('formats a reference with only a name', () => {
    const result = formatReference({ name: 'Product' });

    expect(result).toBe('Product');
  });

  it('returns a fallback when the reference is empty', () => {
    const result = formatReference({});

    expect(result).toBe('Not available');
  });

  it('formats a string parameter value as-is', () => {
    expect(formatParameterValue('CC-42')).toBe('CC-42');
  });

  it('formats an object (e.g. address) parameter value by joining its fields', () => {
    const result = formatParameterValue({
      addressLine1: '123 Main St',
      addressLine2: '',
      city: 'Springfield',
      country: 'US',
      postCode: '12345',
      state: 'IL',
    });

    expect(result).toBe('123 Main St, Springfield, US, 12345, IL');
  });

  it('returns a fallback for an empty parameter value', () => {
    expect(formatParameterValue('')).toBe('—');
    expect(formatParameterValue(undefined)).toBe('—');
  });
});
