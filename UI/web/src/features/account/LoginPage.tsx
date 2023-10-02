import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useLocation } from "wouter";

import { LoginRequest } from "../../app/models/account.ts";
import { ErrorResponse } from "../../app/models/error.ts";
import { useLoginUserMutation } from "./accountApi.ts";

interface FormValues extends LoginRequest {}

export function LoginPage() {
  const [loginUser] = useLoginUserMutation();
  const [_, setLocation] = useLocation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    try {
      await loginUser(data).unwrap();
      setLocation("/products");
    } catch (error) {
      console.log(error as ErrorResponse);
      toast.error("Invalid username or password");
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        width="100%"
        mt={1}
        px={2}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors?.username?.message as string}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2 }}
        >
          <span>Login</span>
        </LoadingButton>
        <Grid container>
          <Grid>
            <Link to="/register" style={{ textDecoration: "none" }}>
              Don't have an account? Register here.
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
