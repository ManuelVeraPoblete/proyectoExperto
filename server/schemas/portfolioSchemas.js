const { z } = require('zod');

const portfolioItemSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  date: z.string().optional(),
});

const reactSchema = z.object({
  reaction: z.enum(['heart', 'like', 'clap', 'dislike']),
});

const reviewSchema = z.object({
  comment: z.string().min(5).max(1000),
  rating: z.number().min(1).max(5),
});

module.exports = { portfolioItemSchema, reactSchema, reviewSchema };
