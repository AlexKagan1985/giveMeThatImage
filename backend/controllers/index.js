import { TestModel } from '../db/index.js';

export async function createTestObject(req, res) {
  const testObject = new TestModel({
    title: 'Test',
    description: 'Test description'
  });
  const result = await testObject.save();
  res.send(result);
}

