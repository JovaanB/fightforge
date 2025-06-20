import { loadStripe } from "@stripe/stripe-js";

export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
};
