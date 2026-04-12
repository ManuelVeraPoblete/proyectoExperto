const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/{userId}/avatar:
 *   post:
 *     summary: Sube o reemplaza el avatar del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar actualizado
 */
router.post('/:userId/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;
