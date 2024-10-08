import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../signup/signup.scss";
import { useContextAuth } from "../../context/auth-context";
import { useState } from "react";

type FormValues = {
  email: string;
  password: string;
};

export const SignInScreen = () => {
  const navigate = useNavigate();
  const { onLogin } = useContextAuth();
  const { register, formState, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [error, setError] = useState<string>();

  const onSubmit = async (formData: FormValues) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      setError(undefined);
      onLogin(user);
      navigate("/discovery");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Error while authenticating user", error);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <TextField
          variant="outlined"
          type="email"
          fullWidth
          error={Boolean(formState.errors.email)}
          {...register("email", {
            required: {
              value: true,
              message: "email is required",
            },
            validate: {
              isValidEmail: (value) =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "email is not valid",
            },
          })}
          label="email"
          placeholder="email"
          required
          onChange={() => setError(undefined)}
        />
        {formState.errors.email && (
          <Typography color="error" variant="caption">
            {formState.errors.email.message}
          </Typography>
        )}
      </Box>
      <Box>
        <TextField
          variant="outlined"
          type="password"
          fullWidth
          error={Boolean(formState.errors.password)}
          {...register("password", {
            required: {
              value: true,
              message: "password is required",
            },
            minLength: {
              value: 4,
              message: "password should have at least 4 characters",
            },
          })}
          label="password"
          placeholder="password"
          required
          onChange={() => setError(undefined)}
        />
        {formState.errors.password && (
          <Typography color="error" variant="caption">
            {formState.errors.password.message}
          </Typography>
        )}
      </Box>

      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}

      <Button variant="contained" type="submit">
        Sign in
      </Button>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body1">Don't have an account?</Typography>
        <Link variant="body1" color="inherit" href="/signup">
          Click here to sign up
        </Link>
      </Stack>
    </form>
  );
};
