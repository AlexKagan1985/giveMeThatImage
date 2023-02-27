import { createTestObject } from '../controllers/index.js';
import express from "express";
export const router = express.Router();

export function testMe(a) {
  return a + a;
}
router.get('/', (req, res) => {
  res.send('Hello World!');
})

router.get('/test', createTestObject);

