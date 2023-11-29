import Stripe from "stripe";

const stripeConfig: any = {
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, stripeConfig);

export default stripe;
