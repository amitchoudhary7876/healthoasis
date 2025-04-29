import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';

const StripeAddMoney = ({ email }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState(null);
  const [amount, setAmount] = useState('');

  const handleStartPayment = async () => {
    const res = await fetch('/api/enhanced-wallet/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), email }),
    });
    const data = await res.json();
    setClientSecret(data.clientSecret);
    setStripePromise(loadStripe(data.publishableKey));
  };

  return (
    <div style={{marginTop: 16}}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{marginRight: 8}}
      />
      <button onClick={handleStartPayment} disabled={!amount}>
        Add Money with Stripe
      </button>

      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeCheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default StripeAddMoney;