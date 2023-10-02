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

import { RegisterRequest } from "../../app/models/account.ts";
import { ErrorResponse } from "../../app/models/error.ts";
import { useRegisterUserMutation } from "./accountApi";

interface FormValues extends RegisterRequest {}

export function RegisterPage() {
  const [_, setLocation] = useLocation();
  const [registerUser] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  function handleApiErrors(errors: ErrorResponse) {
    if (errors) {
      for (const error of Object.values(errors.data.errors ?? {})) {
        for (const message of error) {
          if (message.toLowerCase().includes("password")) {
            setError("password", { message });
          } else if (message.toLowerCase().includes("email")) {
            setError("email", { message });
          } else if (message.toLowerCase().includes("username")) {
            setError("username", { message });
          }
        }
      }
    }
  }

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    try {
      await registerUser(data).unwrap();
      toast.success("Registration successful - you can now login!");
      setLocation("/login");
    } catch (error) {
      console.error(error as ErrorResponse);
      handleApiErrors(error as ErrorResponse);
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
        Register
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
          label="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value:
                /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/,
              message: "Not a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message as string}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          {...register("password", {
            required: "password is required",
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
              message:
                "Password does not meet complexity requirements (min 6 characters, 1 uppercase, 1 lowercase, 1 number)",
            },
          })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          <span>Register</span>
        </LoadingButton>
        <Grid container>
          <Grid>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Already have an account? Login here.
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
