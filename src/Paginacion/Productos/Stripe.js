import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Stripe.css';
import { baseURL } from '../../api.js';

const Stripe = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardData, setCardData] = useState({
    cardNumber: '**** **** **** ****',
    cardExpiry: 'MM/YY',
    cardCvc: 'CVC',
  });

  const handleChange = (event) => {
    if (event.error) {
      console.error(event.error.message);
      return;
    }

    setCardData((prev) => ({
      ...prev,
      cardNumber: event.cardNumber || prev.cardNumber,
      cardExpiry: event.cardExpiry || prev.cardExpiry,
      cardCvc: event.cardCvc || prev.cardCvc,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      const { id } = paymentMethod;

      try {
        const response = await fetch(`${baseURL}/payment_stripe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, amount: 1000 }), // Ajusta el monto según sea necesario
        });

        const paymentResult = await response.json();

        if (paymentResult.success) {
          console.log('Payment successful', paymentResult.payment);
        } else {
          console.error('Payment failed', paymentResult.error);
        }
      } catch (error) {
        console.error('Error sending payment request', error);
      }
    }
  };

  return (
    <div className="stripe-container">
      <div className="stripe-card">
        <h2>Complete Your Payment</h2>
        <div className="card-preview">
          <div className="card">
            <div className="card-header">Credit Card</div>
            <div className="card-body">
              <div className="card-number">{cardData.cardNumber}</div>
              <div className="card-expiry-cvc">
                <div className="card-expiry">{cardData.cardExpiry}</div>
                <div className="card-cvc">{cardData.cardCvc}</div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card-element-container">
            <CardElement onChange={handleChange} />
          </div>
          <button type="submit" disabled={!stripe}>Pay</button>
        </form>
      </div>
    </div>
  );
};

export default Stripe;
