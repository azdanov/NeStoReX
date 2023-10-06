import { TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { StripeElementType } from "@stripe/stripe-js";
import { StripeElementChangeEvent } from "@stripe/stripe-js/types/stripe-js/elements/base";
import { useFormContext } from "react-hook-form";

import { AppTextInput } from "../../app/components/AppTextInput";
import { StripeInput } from "./StripeInput.tsx";

interface Props {
  cardState: { elementError: { [key in StripeElementType]?: string } };
  onCardInputChange: (event: StripeElementChangeEvent) => void;
}

export function PaymentForm({ cardState, onCardInputChange }: Props) {
  const { control } = useFormContext();
  const handleChange = onCardInputChange as unknown as React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <AppTextInput
            name="nameOnCard"
            label="Name on card"
            control={control}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            onChange={handleChange}
            error={!!cardState.elementError.cardNumber}
            helperText={
              cardState.elementError.cardNumber ??
              "Test card: 4242 4242 4242 4242"
            }
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardNumberElement,
              },
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            onChange={handleChange}
            error={!!cardState.elementError.cardExpiry}
            helperText={cardState.elementError.cardExpiry}
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardExpiryElement,
              },
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            onChange={handleChange}
            error={!!cardState.elementError.cardCvc}
            helperText={cardState.elementError.cardCvc}
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardCvcElement,
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
