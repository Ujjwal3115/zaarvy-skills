/**
 * Anti-Pattern Test Fixture: Leaky N+1 Database Queries
 */

import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';

const prisma = new PrismaClient();

// 1. Prisma Anti-Pattern: N+1 inside Promise.all mapping
export async function getUserProfilesWithPosts(tenantId: string) {
  // 1 Query to get N users
  const users = await prisma.user.findMany({
    where: { tenantId }
  });

  // N additional queries fired in parallel! (1 + N queries)
  const results = await Promise.all(
    users.map(async (user) => {
      const posts = await prisma.post.findMany({
        where: { authorId: user.id, isPublished: true }
      });
      return {
        ...user,
        posts
      };
    })
  );

  return results;
}

// 2. Mongoose Anti-Pattern: N+1 inside sequential for..of loop
export async function getOrderSummary(customerId: string) {
  const Order = mongoose.model('Order');
  const Product = mongoose.model('Product');

  // 1 Query to get orders
  const orders = await Order.find({ customer: customerId });

  const summary = [];
  // N queries fired sequentially in event loop
  for (const order of orders) {
    const product = await Product.findById(order.productId);
    summary.push({
      orderId: order._id,
      productName: product?.name,
      amount: order.amount
    });
  }

  return summary;
}
