import { useMutation } from "@apollo/client/react";
import { Avatar, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import logo from "../assets/Image/logo.png";
import { LOGIN } from "../../graphql/mutation";
import { useAuth } from "../Context/AuthContext";
import "../Styles/login.scss";

const validationSchema = Yup.object({
  email: Yup.string().email("Email មិនត្រឹមត្រូវ").required("សូមបញ្ចូល Email"),
  password: Yup.string().required("សូមបញ្ចូល ពាក្យសម្ងាត់"),
});

export default function Login() {
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN);

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
  return (
    <Box className="login-wrapper">
      <Box elevation={4} className="login-card">
        <Stack
          alignItems="center"
          spacing={2}
          direction="column"
          sx={{ width: "100%" }}
        >
          <Avatar src={logo} sx={{ width: 90, height: 90 }} />
          <Typography variant="body2" color="text.secondary">
            Login to your account
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
                  type="password"
                  size="small"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  fullWidth
                  className="input-field"
                />

                <Typography className="forgot-text">
                  ភ្លេចពាក្យសម្ងាត់?
                </Typography>

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
        </Stack>
      </Box>
    </Box>
  );
}
