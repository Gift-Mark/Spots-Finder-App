import express from 'express';
import { getTravelContentBySlug } from '../controllers/travelContentController.js';

const router = express.Router();

router.get('/:slug', getTravelContentBySlug);

export default router;