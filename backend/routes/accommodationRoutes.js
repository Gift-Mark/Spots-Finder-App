import express from 'express';
const router = express.Router();
import { 
  getAccommodations, 
  getFeaturedAccommodations, 
  getAccommodationZones 
} from '../controllers/accommodationController.js';

router.get('/', getAccommodations);
router.get('/featured', getFeaturedAccommodations);
router.get('/zones', getAccommodationZones);

export default router;