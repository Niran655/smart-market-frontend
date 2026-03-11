import { useMutation } from "@apollo/client/react";
import { Avatar, Box, Button, Paper, Stack, TextField, Typography, InputAdornment, IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../assets/Image/logo.png";
import { LOGIN } from "../../graphql/mutation";
import { useAuth } from "../context/AuthContext";
import "../Styles/login.scss";

const validationSchema = Yup.object({
  email: Yup.string().email("Email មិនត្រឹមត្រូវ").required("សូមបញ្ចូល Email"),
  password: Yup.string().required("សូមបញ្ចូល ពាក្យសម្ងាត់"),
});

export default function Login() {
  const { login, user } = useAuth();
  const [loginMutation, { loading, client }] = useMutation(LOGIN);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { data } = await loginMutation({
        variables: values,
      });
      if (data?.login) {
        login(data.login.token, data.login.user);
      }
    } catch (error) {
      setErrors({ password: "Email ឬ ពាក្យសម្ងាត់ មិនត្រឹមត្រូវ" });
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (user) {

      client.resetStore();

    }
  }, [user, client]);

  return (
    <Box className="login-wrapper">
      <Paper elevation={4} className="login-card">
        <Stack alignItems="center" spacing={2} direction="column" sx={{ width: "100%" }}>
          <Avatar src={logo} sx={{ width: 150, height: 70 }} />
          <Typography
             
            color="text.primary"
            sx={{ fontWeight: "bold", letterSpacing: 0.5 }}
          >
            Logic Integrated Kiosk Application
          </Typography>
       
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, values }) => (
              <Form style={{ width: "100%" }}>
                <Typography className="input-label">Email</Typography>
                <TextField
                  name="email"
                  size="small"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  fullWidth
                  className="input-field"
                />

                <Typography className="input-label">Password</Typography>
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  size="small"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  fullWidth
                  sx={{ mb: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography className="forgot-text">ភ្លេចពាក្យសម្ងាត់?</Typography>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>
          <Typography
            variant="caption"
            sx={{
              mt: 2,
              color: "gray",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Niran. All rights reserved.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}