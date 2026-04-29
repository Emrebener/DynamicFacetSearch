const {
  deriveFacets,
  buildAttributeFilter,
} = require('../src/products/facetService');

describe('facet service', () => {
  test('derives unique facet values from product attributes', () => {
    const facets = deriveFacets([
      {
        attributes: {
          brand: 'Sony',
          noiseCancelling: true,
        },
      },
      {
        attributes: {
          brand: 'Bose',
          noiseCancelling: true,
        },
      },
    ]);

    expect(facets).toEqual([
      { key: 'brand', values: ['Bose', 'Sony'] },
      { key: 'noiseCancelling', values: ['true'] },
    ]);
  });

  test('flattens array values when deriving facets', () => {
    const facets = deriveFacets([
      {
        attributes: {
          connection: ['Bluetooth', '3.5mm'],
        },
      },
      {
        attributes: {
          connection: ['Bluetooth', 'USB-C'],
        },
      },
    ]);

    expect(facets).toEqual([
      { key: 'connection', values: ['3.5mm', 'Bluetooth', 'USB-C'] },
    ]);
  });

  test('builds exact-match filter for a dynamic string attribute', () => {
    expect(buildAttributeFilter([{ key: 'brand', value: 'Sony' }])).toEqual({
      'attributes.brand': 'Sony',
    });
  });

  test('converts obvious boolean and number filter values', () => {
    expect(buildAttributeFilter([{ key: 'noiseCancelling', value: 'true' }])).toEqual({
      'attributes.noiseCancelling': true,
    });
    expect(buildAttributeFilter([{ key: 'ramGb', value: '16' }])).toEqual({
      'attributes.ramGb': 16,
    });
  });

  test('combines multiple facet filters into a single query', () => {
    expect(
      buildAttributeFilter([
        { key: 'brand', value: 'Sony' },
        { key: 'noiseCancelling', value: 'true' },
      ]),
    ).toEqual({
      'attributes.brand': 'Sony',
      'attributes.noiseCancelling': true,
    });
  });

  test('skips facets with empty key or value and handles non-array input', () => {
    expect(buildAttributeFilter([])).toEqual({});
    expect(buildAttributeFilter(undefined)).toEqual({});
    expect(
      buildAttributeFilter([
        { key: '', value: 'Sony' },
        { key: 'brand', value: '' },
        { key: 'colour', value: 'red' },
      ]),
    ).toEqual({ 'attributes.colour': 'red' });
  });
});

