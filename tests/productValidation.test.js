const {
  validateProductInput,
  parseAttributesJson,
} = require('../src/products/productValidation');

describe('product validation', () => {
  test('normalises valid product input', () => {
    const result = validateProductInput({
      name: 'ThinkPad X1',
      description: 'Compact business laptop',
      category: 'Laptops',
      price: '899.99',
      condition: 'Used',
      attributes: '{"brand":"Lenovo","ramGb":16}',
    });

    expect(result.errors).toEqual([]);
    expect(result.product).toEqual({
      name: 'ThinkPad X1',
      description: 'Compact business laptop',
      category: 'Laptops',
      price: 899.99,
      condition: 'Used',
      attributes: {
        brand: 'Lenovo',
        ramGb: 16,
      },
    });
  });

  test('rejects missing name', () => {
    const result = validateProductInput({
      name: '',
      description: 'Compact business laptop',
      category: 'Laptops',
      price: '899.99',
      condition: 'Used',
      attributes: '{"brand":"Lenovo"}',
    });

    expect(result.errors).toContain('Name is required.');
    expect(result.product).toBeNull();
  });

  test('rejects invalid price', () => {
    const result = validateProductInput({
      name: 'ThinkPad X1',
      description: 'Compact business laptop',
      category: 'Laptops',
      price: 'not-a-price',
      condition: 'Used',
      attributes: '{"brand":"Lenovo"}',
    });

    expect(result.errors).toContain('Price must be a valid number.');
    expect(result.product).toBeNull();
  });

  test('requires attributes JSON to be a plain object', () => {
    expect(parseAttributesJson('["brand", "Lenovo"]')).toEqual({
      attributes: null,
      error: 'Attributes must be a JSON object.',
    });
  });
});

