const { z } = require('zod');

const createReportSchema = z.object({
  type: z.enum(['review', 'user', 'post', 'language']),
  reason: z.string().min(5).max(200),
  description: z.string().max(2000).optional(),
  reportedUserId: z.string().uuid().optional(),
  reportedContent: z.string().max(5000).optional(),
});

const updateReportStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'resolved']),
});

module.exports = { createReportSchema, updateReportStatusSchema };
