import express from 'express';
const router = express.Router();
import { 
  getAccommodations, 
  getFeaturedAccommodations,
  getAccommodationBySlug,
  getAccommodationZones 
} from '../controllers/accommodationController.js';

router.get('/', getAccommodations);
router.get('/featured', getFeaturedAccommodations);
router.get('/zones', getAccommodationZones);
router.get('/:slug', getAccommodationBySlug);

export default router;