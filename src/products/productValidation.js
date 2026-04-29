function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function parseAttributesJson(raw) {
  const value = raw && raw.trim() ? raw : '{}';

  try {
    const attributes = JSON.parse(value);

    if (!isPlainObject(attributes)) {
      return {
        attributes: null,
        error: 'Attributes must be a JSON object.',
      };
    }

    return {
      attributes,
      error: null,
    };
  } catch (error) {
    return {
      attributes: null,
      error: 'Attributes must be valid JSON.',
    };
  }
}

function validateProductInput(input) {
  const errors = [];
  const name = String(input.name || '').trim();
  const description = String(input.description || '').trim();
  const category = String(input.category || '').trim();
  const condition = String(input.condition || '').trim();
  const price = Number(input.price);
  const parsedAttributes = parseAttributesJson(input.attributes);

  if (!name) {
    errors.push('Name is required.');
  }

  if (!category) {
    errors.push('Category is required.');
  }

  if (!condition) {
    errors.push('Condition is required.');
  }

  if (!Number.isFinite(price)) {
    errors.push('Price must be a valid number.');
  }

  if (parsedAttributes.error) {
    errors.push(parsedAttributes.error);
  }

  if (errors.length > 0) {
    return {
      product: null,
      errors,
    };
  }

  return {
    product: {
      name,
      description,
      category,
      price,
      condition,
      attributes: parsedAttributes.attributes,
    },
    errors: [],
  };
}

module.exports = {
  parseAttributesJson,
  validateProductInput,
};
