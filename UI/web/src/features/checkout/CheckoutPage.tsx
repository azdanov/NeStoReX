import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Loader } from "../../app/layout/Loader.tsx";
import { useGetCurrentUserQuery } from "../account/accountApi.ts";
import { Checkout } from "./Checkout.tsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function CheckoutPage() {
  const { isLoading: isUserLoading } = useGetCurrentUserQuery();

  if (isUserLoading) {
    return <Loader message="Checkout loading..." />;
  }

  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
}
