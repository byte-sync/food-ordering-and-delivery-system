import express = require('express');
import { createNotification } from '../controllers/notification.controller';

const router = express.Router();

router.post('/', createNotification);

export default router;