import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useFormContext } from "react-hook-form";

import { AppCheckbox } from "../../app/components/AppCheckbox.tsx";
import { AppTextInput } from "../../app/components/AppTextInput.tsx";

export function AddressForm() {
  const { control } = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={12}>
          <AppTextInput control={control} name="fullName" label="Full name" />
        </Grid>
        <Grid xs={12}>
          <AppTextInput control={control} name="address1" label="Address 1" />
        </Grid>
        <Grid xs={12}>
          <AppTextInput control={control} name="address2" label="Address 2" />
        </Grid>
        <Grid xs={12} sm={6}>
          <AppTextInput control={control} name="city" label="City" />
        </Grid>
        <Grid xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="State" />
        </Grid>
        <Grid xs={12} sm={6}>
          <AppTextInput control={control} name="zip" label="Zipcode" />
        </Grid>
        <Grid xs={12} sm={6}>
          <AppTextInput control={control} name="country" label="Country" />
        </Grid>

        <Grid xs={12}>
          <AppCheckbox
            name="saveAddress"
            label="Save this as the default address"
            control={control}
          />
        </Grid>
      </Grid>
    </>
  );
}
