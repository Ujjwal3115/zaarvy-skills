import express from 'express';

const app = express();
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

// MISSING from .env.example: Stripe webhook secret
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// MISSING from .env.example: Redis cache connection
const redisUrl = process.env.REDIS_CACHE_URL;

if (!dbUrl || !jwtSecret) {
  throw new Error('Missing critical configuration in process.env');
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
