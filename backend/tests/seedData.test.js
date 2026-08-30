const test = require('node:test');
const assert = require('node:assert/strict');

const { seedIfEmpty, defaultProducts } = require('../config/seedData');

test('seedIfEmpty inserts default products when the collection is empty', async () => {
  const calls = { insertMany: 0, createUser: 0 };

  const Product = {
    countDocuments: async () => 0,
    insertMany: async (products) => {
      calls.insertMany = products.length;
      return products;
    },
  };

  const User = {
    countDocuments: async () => 0,
    create: async () => {
      calls.createUser += 1;
      return { _id: 'user-1' };
    },
  };

  const result = await seedIfEmpty({ Product, User });

  assert.equal(result.seeded, true);
  assert.equal(calls.insertMany, defaultProducts.length);
  assert.equal(calls.createUser, 2);
});
