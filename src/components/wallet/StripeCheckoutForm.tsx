import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess?: () => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        if (onSuccess) onSuccess();
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24, borderRadius: 12, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12, fontWeight: 600, fontSize: 22 }}>Card Payment</h2>
        <label style={{ fontWeight: 500, marginBottom: 6 }}>Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#333',
                '::placeholder': { color: '#aab7c4' },
                fontFamily: 'inherit',
                backgroundColor: '#f5f7fa',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #d0d5dd',
              },
              invalid: { color: '#fa755a' },
            },
          }}
        />
        <button
          type="submit"
          disabled={!stripe}
          style={{
            marginTop: 18,
            background: '#635bff',
            color: 'white',
            fontWeight: 600,
            border: 'none',
            borderRadius: 6,
            fontSize: 17,
            padding: '12px 0',
            cursor: !stripe ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 1px 6px rgba(99,91,255,0.08)'
          }}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default StripeCheckoutForm;