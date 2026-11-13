import React from 'react';

export const UserDashboard = () => {
  // Correct client usage
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // HIGH SECURITY VIOLATION: Secret key exposed with client-side prefix
  const stripeSecret = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

  // MISSING from .env.example: Sentry DSN without client prefix
  const sentryDsn = process.env.SENTRY_DSN;

  return (
    <div className="dashboard">
      <h1>API Endpoint: {apiUrl}</h1>
      {stripeSecret && <p>Warning: Secret key exposed</p>}
    </div>
  );
};
