import axios from "axios";

const stripe = Stripe(
  "pk_test_51H8d74FmUbSKgcnDoAE4iN5AZePmYvaf7EQMXE6Y8X5w241L03PTozOKG1LcAcWqI7mlbQJARbz9UqsDzXgjqVxJ00I3N2fitL"
);

import { showAlert } from "./alerts";

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};