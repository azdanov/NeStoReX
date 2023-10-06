import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeElementType } from "@stripe/stripe-js";
import { StripeElementChangeEvent } from "@stripe/stripe-js/types/stripe-js/elements/base";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import { Loader } from "../../app/layout/Loader.tsx";
import { useGetCurrentUserQuery } from "../account/accountApi.ts";
import { useCreateOrderMutation } from "../order/orderApi.ts";
import { AddressForm } from "./AddressForm";
import { PaymentForm } from "./PaymentForm";
import { Review } from "./Review";

const steps = ["Shipping address", "Review your order", "Payment details"];

const lastStep = steps.length - 1;

const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  saveAddress: z.boolean(),
});

const reviewSchema = z.object({});

const cardSchema = z.object({
  nameOnCard: z.string().min(1, "Card name is required"),
});

const validationSchema = [addressSchema, reviewSchema, cardSchema];

interface FormValues
  extends z.infer<typeof addressSchema>,
    z.infer<typeof cardSchema> {}

export function Checkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [createOrder] = useCreateOrderMutation();
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();

  const stripe = useStripe();
  const elements = useElements();
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [cardState, setCardState] = useState<{
    elementError: { [key in StripeElementType]?: string };
  }>({ elementError: {} });
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      ...user?.address,
      saveAddress: false,
    },
    mode: "all",
    resolver: zodResolver(validationSchema[currentStep]),
  });

  useEffect(() => {
    if (user?.address) {
      methods.reset({
        ...methods.getValues(),
        ...user?.address,
        saveAddress: false,
      });
    }
  }, [methods, user]);

  function onCardInputChange(event: StripeElementChangeEvent) {
    setCardState({
      ...cardState,
      elementError: {
        ...cardState.elementError,
        [event.elementType]: event.error?.message,
      },
    });
    setCardComplete({ ...cardComplete, [event.elementType]: event.complete });
  }

  async function handleSubmit(data: FormValues) {
    try {
      setCreatingOrder(true);

      const orderResult = await createOrder({
        saveAddress: data.saveAddress,
        address: {
          fullName: data.fullName,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: data.country,
        },
      }).unwrap();

      const cardElement = elements!.getElement(CardNumberElement)!;
      const paymentResult = await stripe!.confirmCardPayment(
        orderResult.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: data.nameOnCard,
            },
          },
        },
      );

      console.log(paymentResult);

      if (paymentResult.paymentIntent?.status === "succeeded") {
        setOrderNumber(orderResult.orderId);
        setPaymentSucceeded(true);
        setPaymentMessage(
          "Thank you for your order - we have received your payment",
        );
      } else {
        setPaymentMessage(paymentResult.error!.message!);
        setPaymentSucceeded(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingOrder(false);
    }
  }

  const handleNext: SubmitHandler<FormValues> = async () => {
    if (!methods.formState.isValid) return;

    if (currentStep < lastStep) {
      methods.reset({ ...methods.getValues() }, { keepValues: true });
      setCurrentStep((step) => step + 1);
    }

    if (currentStep === lastStep) {
      if (!stripe || !elements) {
        return toast.error("Stripe is not loaded. Please try again.");
      }
      await handleSubmit(methods.getValues());
      setCurrentStep((step) => step + 1);
    }
  };

  function handleBack() {
    setCurrentStep((step) => step - 1);
  }

  function submitDisabled() {
    return currentStep === lastStep
      ? !cardComplete.cardCvc ||
          !cardComplete.cardExpiry ||
          !cardComplete.cardNumber ||
          !methods.formState.isValid
      : !methods.formState.isValid;
  }

  if (isUserLoading) {
    return <Loader message="Checkout loading..." />;
  }

  return (
    <FormProvider {...methods}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={currentStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((value) => (
            <Step key={value}>
              <StepLabel>{value}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {currentStep < steps.length ? (
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {currentStep == 0 && <AddressForm />}
              {currentStep == 1 && <Review />}
              {currentStep == 2 && (
                <PaymentForm
                  cardState={cardState}
                  onCardInputChange={onCardInputChange}
                />
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {currentStep != 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={creatingOrder}
                  disabled={submitDisabled()}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {currentStep == lastStep ? "Place order" : "Next"}
                </LoadingButton>
              </Box>
            </form>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                {paymentMessage}
              </Typography>
              {paymentSucceeded ? (
                <Typography variant="subtitle1">
                  Your order number is #{orderNumber}. We have not emailed your
                  order confirmation, and will not send you an update when your
                  order has shipped as this is a fake store!
                </Typography>
              ) : (
                <Button variant="contained" onClick={handleBack}>
                  Go back and try again
                </Button>
              )}
            </>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}
