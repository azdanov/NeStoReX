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
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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
  fullName: z.string().nonempty("Full name is required"),
  address1: z.string().nonempty("Address is required"),
  address2: z.string().optional(),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  zip: z.string().nonempty("Zip code is required"),
  country: z.string().nonempty("Country is required"),
  saveAddress: z.boolean(),
});

const reviewSchema = z.object({});

const cardSchema = z.object({
  nameOnCard: z.string().nonempty("Card name is required"),
});

const validationSchema = [addressSchema, reviewSchema, cardSchema];

interface FormValues
  extends z.infer<typeof addressSchema>,
    z.infer<typeof cardSchema> {}

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();

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

  const handleNext: SubmitHandler<FormValues> = async () => {
    if (!methods.formState.isValid) return;

    if (currentStep < lastStep) {
      methods.reset({ ...methods.getValues() }, { keepValues: true });
      setCurrentStep((step) => step + 1);
    }

    if (currentStep === lastStep) {
      const data = methods.getValues();
      try {
        const order = await createOrder({
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

        setOrderNumber(order.id);
        setCurrentStep((step) => step + 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  function handleBack() {
    setCurrentStep((step) => step - 1);
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
              {currentStep == 2 && <PaymentForm />}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {currentStep != 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={creatingOrder}
                  disabled={!methods.formState.isValid}
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
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #{orderNumber}. We have not emailed your
                order confirmation, and will not send you an update when your
                order has shipped as this is a fake store!
              </Typography>
            </>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}
