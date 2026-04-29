const { deriveFacets } = require('./facetService');
const productRepository = require('./productRepository');
const { validateProductInput } = require('./productValidation');

const emptyProduct = {
  name: '',
  description: '',
  category: '',
  price: '',
  condition: '',
  attributes: {},
};

function serialiseAttributes(product) {
  return JSON.stringify(product.attributes || {}, null, 2);
}

function viewModelFromProduct(product) {
  return {
    ...product,
    attributesJson: serialiseAttributes(product),
  };
}

function parseFacets(query) {
  const keys = [].concat(query.facetKey || []);
  const values = [].concat(query.facetValue || []);
  const facets = [];
  const seenKeys = new Set();
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = values[i];
    if (!key || value === undefined || value === '') {
      continue;
    }
    if (seenKeys.has(key)) {
      continue;
    }
    seenKeys.add(key);
    facets.push({ key, value });
  }
  return facets;
}

async function index(req, res, next) {
  try {
    const filters = {
      category: req.query.category || '',
      facets: parseFacets(req.query),
    };
    const [categories, productsForFacets, products] = await Promise.all([
      productRepository.listCategories(),
      filters.category
        ? productRepository.listProductsByCategory(filters.category)
        : Promise.resolve([]),
      productRepository.listProducts(filters),
    ]);

    res.render('products/index', {
      title: 'Products',
      products,
      categories,
      facets: deriveFacets(productsForFacets),
      filters,
    });
  } catch (error) {
    next(error);
  }
}

function newProductForm(req, res) {
  res.render('products/form', {
    title: 'New Product',
    product: {
      ...emptyProduct,
      attributesJson: '{}',
    },
    errors: [],
    action: '/products',
    method: 'POST',
  });
}

async function create(req, res, next) {
  try {
    const result = validateProductInput(req.body);

    if (result.errors.length > 0) {
      res.status(400).render('products/form', {
        title: 'New Product',
        product: {
          ...req.body,
          attributesJson: req.body.attributes || '{}',
        },
        errors: result.errors,
        action: '/products',
        method: 'POST',
      });
      return;
    }

    const product = await productRepository.createProduct(result.product);
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const product = await productRepository.getProductById(req.params.id);
    if (!product) {
      res.status(404).send('Product not found.');
      return;
    }

    res.render('products/detail', {
      title: product.name,
      product,
      attributesJson: serialiseAttributes(product),
    });
  } catch (error) {
    next(error);
  }
}

async function editForm(req, res, next) {
  try {
    const product = await productRepository.getProductById(req.params.id);
    if (!product) {
      res.status(404).send('Product not found.');
      return;
    }

    res.render('products/form', {
      title: `Edit ${product.name}`,
      product: viewModelFromProduct(product),
      errors: [],
      action: `/products/${product._id}?_method=PUT`,
      method: 'POST',
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = validateProductInput(req.body);

    if (result.errors.length > 0) {
      res.status(400).render('products/form', {
        title: 'Edit Product',
        product: {
          ...req.body,
          _id: req.params.id,
          attributesJson: req.body.attributes || '{}',
        },
        errors: result.errors,
        action: `/products/${req.params.id}?_method=PUT`,
        method: 'POST',
      });
      return;
    }

    const updated = await productRepository.updateProduct(req.params.id, result.product);
    if (!updated) {
      res.status(404).send('Product not found.');
      return;
    }

    res.redirect(`/products/${req.params.id}`);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await productRepository.deleteProduct(req.params.id);
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  newProductForm,
  create,
  detail,
  editForm,
  update,
  remove,
};

