import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51QF3chCvxZHaSJsjDfWiFTS4igwtGqq44xhKpVHZfwoHEFFUhsH5oJg8qmNpkD5grmEy0LSyHecDONgRRa6HBIqc00UUpDtZQR',
);

export const bookProduct = async (productId) => {
  try {
    // get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${productId}`,
    );
    console.log(session);
    // create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
