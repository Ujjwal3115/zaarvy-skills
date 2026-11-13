/**
 * Optimized Reference Fixture: Batched & Eager Loaded Queries (1 or 2 roundtrips max)
 */

import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';

const prisma = new PrismaClient();

// 1. Prisma Solution: Eager load relations via `include` with indexed filtering
export async function getUserProfilesWithPosts(tenantId: string) {
  // Exactly 1 roundtrip (or 2 batched roundtrips) regardless of user count
  return prisma.user.findMany({
    where: { tenantId },
    include: {
      posts: {
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      }
    }
  });
}

// 2. Mongoose Solution: Single query with populate & projection
export async function getOrderSummary(customerId: string) {
  const Order = mongoose.model('Order');

  // Single roundtrip using population
  return Order.find({ customer: customerId })
    .populate({
      path: 'productId',
      select: 'name price'
    })
    .lean();
}
