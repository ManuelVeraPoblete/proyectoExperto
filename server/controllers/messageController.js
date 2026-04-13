const { Op, literal } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get distinct contacts (the "other" user in each conversation)
    const [rows] = await Message.sequelize.query(
      `SELECT
         contact_id,
         MAX(last_time) AS last_time,
         SUM(unread) AS unread_count
       FROM (
         SELECT
           receiverId AS contact_id,
           MAX(createdAt) AS last_time,
           0 AS unread
         FROM messages WHERE senderId = :userId
         GROUP BY receiverId
         UNION ALL
         SELECT
           senderId AS contact_id,
           MAX(createdAt) AS last_time,
           SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) AS unread
         FROM messages WHERE receiverId = :userId
         GROUP BY senderId
       ) t
       GROUP BY contact_id
       ORDER BY last_time DESC`,
      { replacements: { userId } }
    );

    const contactIds = rows.map(r => r.contact_id);
    if (contactIds.length === 0) return res.json([]);

    const users = await User.findAll({
      where: { id: contactIds },
      attributes: ['id', 'nombres', 'apellidos', 'email'],
    });

    const userMap = {};
    users.forEach(u => { userMap[u.id] = u; });

    // Get last message per conversation
    const conversations = await Promise.all(rows.map(async (row) => {
      const lastMsg = await Message.findOne({
        where: {
          [Op.or]: [
            { senderId: userId, receiverId: row.contact_id },
            { senderId: row.contact_id, receiverId: userId },
          ],
        },
        order: [['createdAt', 'DESC']],
      });
      return {
        contact: userMap[row.contact_id],
        lastMessage: lastMsg,
        unreadCount: parseInt(row.unread_count) || 0,
      };
    }));

    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    const receiver = await User.findByPk(receiverId);
    if (!receiver) return next(new AppError('Destinatario no encontrado', 404));
    if (senderId === receiverId) return next(new AppError('No puedes enviarte mensajes a ti mismo', 400));

    const message = await Message.create({ senderId, receiverId, content });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    await Message.update(
      { is_read: true },
      { where: { senderId: otherUserId, receiverId: userId, is_read: false } }
    );

    res.json({ message: 'Mensajes marcados como leídos' });
  } catch (err) {
    next(err);
  }
};
