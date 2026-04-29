const { ObjectId } = require('mongodb');

const { buildAttributeFilter } = require('./facetService');
const { getProductsCollection } = require('../db/mongo');

function toObjectId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

function buildProductFilter(filters = {}) {
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }

  return {
    ...query,
    ...buildAttributeFilter(filters.facets),
  };
}

async function listProducts(filters = {}) {
  return getProductsCollection()
    .find(buildProductFilter(filters))
    .sort({ createdAt: -1 })
    .toArray();
}

async function listProductsByCategory(category) {
  if (!category) {
    return [];
  }

  return getProductsCollection()
    .find({ category })
    .sort({ createdAt: -1 })
    .toArray();
}

async function listCategories() {
  const categories = await getProductsCollection().distinct('category');
  return categories.sort((left, right) => left.localeCompare(right));
}

async function getProductById(id) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return null;
  }

  return getProductsCollection().findOne({ _id: objectId });
}

async function createProduct(productInput) {
  const now = new Date();
  const product = {
    ...productInput,
    createdAt: now,
    updatedAt: now,
  };

  const result = await getProductsCollection().insertOne(product);
  return {
    ...product,
    _id: result.insertedId,
  };
}

async function updateProduct(id, productInput) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return false;
  }

  const result = await getProductsCollection().updateOne(
    { _id: objectId },
    {
      $set: {
        ...productInput,
        updatedAt: new Date(),
      },
    },
  );

  return result.matchedCount > 0;
}

async function deleteProduct(id) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return false;
  }

  const result = await getProductsCollection().deleteOne({ _id: objectId });
  return result.deletedCount > 0;
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  listProductsByCategory,
};

