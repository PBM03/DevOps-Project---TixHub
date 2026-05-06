import express from 'express';
import { getAllUsers, updateUserRole, deleteUser, getDashboardStats } from '../controllers/admin.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;