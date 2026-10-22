'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PaymentReviewButtons({ paymentId }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  async function review(status) {
    setMessage('Saving…');
    const response = await fetch(`/api/payments/${paymentId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error || 'Unable to update payment.');
      return;
    }
    setMessage(status === 'VERIFIED' ? 'Verified' : 'Rejected');
    router.refresh();
  }
  return <div className="action-row"><button type="button" className="button button-primary button-small" onClick={() => review('VERIFIED')}>Verify</button><button type="button" className="button button-secondary button-small" onClick={() => review('REJECTED')}>Reject</button>{message && <small>{message}</small>}</div>;
}
