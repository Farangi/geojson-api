import { Router } from 'express';
import { evaluateGeoJson } from '../controllers/geoJson';

const router = Router();

// Get geoJson
router.get('/', evaluateGeoJson)

export default router;
