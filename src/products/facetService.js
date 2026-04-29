function stringifyFacetValue(value) {
  return String(value);
}

function parseFacetValue(value) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return value;
}

function deriveFacets(products) {
  const facetValuesByKey = new Map();

  for (const product of products) {
    const attributes = product.attributes || {};

    for (const [key, rawValue] of Object.entries(attributes)) {
      if (!facetValuesByKey.has(key)) {
        facetValuesByKey.set(key, new Set());
      }

      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      for (const value of values) {
        facetValuesByKey.get(key).add(stringifyFacetValue(value));
      }
    }
  }

  return [...facetValuesByKey.entries()]
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, values]) => ({
      key,
      values: [...values].sort((left, right) => left.localeCompare(right)),
    }));
}

function buildAttributeFilter(facets) {
  if (!Array.isArray(facets)) {
    return {};
  }

  const query = {};
  for (const { key, value } of facets) {
    if (!key || value === undefined || value === null || value === '') {
      continue;
    }
    query[`attributes.${key}`] = parseFacetValue(value);
  }
  return query;
}

module.exports = {
  deriveFacets,
  buildAttributeFilter,
};
