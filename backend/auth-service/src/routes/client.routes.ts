import { Router } from 'express';
import { getClientInformation } from '../controllers/client.controller';

const router = Router();

// Client information endpoints
router.get('/info', getClientInformation);

export default router;