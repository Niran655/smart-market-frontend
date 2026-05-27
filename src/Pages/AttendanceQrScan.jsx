import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle2, LogIn, ScanLine } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";

import { CLOCK_IN_ATTENDANCE, LOGIN } from "../../graphql/mutation";
import { GET_EMPLOYEES_WITH_PAGINATION, GET_TODAY_ATTENDANCE } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function AttendanceQrScan() {
  const { language, login, setAlert, user } = useAuth();
  const { t } = translateLauguage(language);
  const [searchParams] = useSearchParams();
  const [scannerActive, setScannerActive] = useState(false);
  const [qrScanned, setQrScanned] = useState(searchParams.get("scan") === "1");
  const [showPassword, setShowPassword] = useState(false);
  const autoClockInRef = useRef("");

  const [loginMutation, { loading: loggingIn }] = useMutation(LOGIN, {
    onCompleted: ({ login: loginResult }) => {
      if (loginResult) login(loginResult.token, loginResult.user);
    },
    onError: (error) => {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const { data: employeeData } = useQuery(GET_EMPLOYEES_WITH_PAGINATION, {
    variables: { page: 1, limit: 100, pagination: false, keyword: user?.email || "", active: true },
    skip: !user?.email,
  });
  const employees = employeeData?.getEmployeesWithPagination?.data || [];
  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.email?.toLowerCase() === user?.email?.toLowerCase()) || null,
    [employees, user?.email]
  );
  const employeeId = selectedEmployee?._id || "";

  const { data: todayData, loading: todayLoading, refetch } = useQuery(GET_TODAY_ATTENDANCE, {
    variables: { employeeId },
    skip: !employeeId,
    fetchPolicy: "cache-and-network",
  });
  const todayAttendance = todayData?.getTodayAttendance;

  const [clockIn, { loading }] = useMutation(CLOCK_IN_ATTENDANCE, {
    onCompleted: ({ clockInAttendance }) => {
      setAlert(true, clockInAttendance?.isSuccess ? "success" : "error", clockInAttendance?.message);
      if (employeeId) refetch();
    },
    onError: (error) => {
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  useEffect(() => {
    if (!qrScanned || !employeeId || todayLoading || todayAttendance?.clockIn || loading) return;
    const autoClockInKey = `${employeeId}:${dayjs().format("YYYY-MM-DD")}`;
    if (autoClockInRef.current === autoClockInKey) return;
    autoClockInRef.current = autoClockInKey;
    clockIn({ variables: { employeeId } });
  }, [clockIn, employeeId, loading, qrScanned, todayAttendance?.clockIn, todayLoading]);

  useEffect(() => {
    if (!scannerActive) return undefined;

    const scanner = new Html5QrcodeScanner(
      "attendance-qr-reader",
      {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        rememberLastUsedCamera: false,
        videoConstraints: {
          facingMode: { ideal: "environment" },
        },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const decodedUrl = new URL(decodedText);
          if (decodedUrl.pathname !== "/setting/attendance-qr-scan" || decodedUrl.searchParams.get("scan") !== "1") {
            setAlert(true, "error", { messageEn: "Invalid attendance QR", messageKh: "Invalid attendance QR" });
            return;
          }
        } catch {
          setAlert(true, "error", { messageEn: "Invalid attendance QR", messageKh: "Invalid attendance QR" });
          return;
        }
        setQrScanned(true);
        setScannerActive(false);
        scanner.clear();
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerActive, setAlert]);

  const handleLoginSubmit = (values) => {
    loginMutation({ variables: values });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480, border: "1px solid", borderColor: "divider", borderRadius: 1, p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2} alignItems="stretch">
          <Stack alignItems="center" spacing={1}>
            <ScanLine size={42} color="#1D4592" />
            <Typography variant="h5" fontWeight={800}>Attendance Check In</Typography>
            <Typography color="text.secondary" textAlign="center">
              {user ? "Your attendance account is ready for QR check in." : "Login with your staff account to continue."}
            </Typography>
          </Stack>

          {!user ? (
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ errors, touched, handleChange, values }) => (
                <Form>
                  <Stack spacing={2}>
                    <TextField
                      name="email"
                      size="small"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                      placeholder={t("email") || "Email"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      name="password"
                      type={showPassword ? "text" : "password"}
                      size="small"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      fullWidth
                      placeholder={t("password") || "Password"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((value) => !value)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button type="submit" variant="contained" size="large" disabled={loggingIn} startIcon={<LogIn size={18} />}>
                      {loggingIn ? "Logging in..." : t("login") || "Login"}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              {!qrScanned && (
                <Button
                  variant={scannerActive ? "outlined" : "contained"}
                  startIcon={<Camera size={18} />}
                  onClick={() => setScannerActive((active) => !active)}
                >
                  {scannerActive ? "Close Scanner" : "Scan QR"}
                </Button>
              )}

              {scannerActive && (
                <Box sx={{ overflow: "hidden", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
                  <Box id="attendance-qr-reader" />
                </Box>
              )}

              {selectedEmployee ? (
                <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 2 }}>
                  <Typography fontWeight={700}>{selectedEmployee.nameEn || selectedEmployee.nameKh}</Typography>
                  <Typography color="text.secondary">{selectedEmployee.position || "-"}</Typography>
                  <Stack direction="row" spacing={1} mt={1} alignItems="center">
                    <Chip
                      size="small"
                      color={todayAttendance?.clockIn ? "success" : qrScanned ? "warning" : "default"}
                      label={
                        todayAttendance?.clockIn
                          ? `Checked in ${dayjs(todayAttendance.clockIn).format("hh:mm A")}`
                          : qrScanned
                            ? "Checking in..."
                            : "Scan QR to check in"
                      }
                    />
                    {todayAttendance?.clockIn && <CheckCircle2 size={18} color="#2e7d32" />}
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 2 }}>
                  <Typography fontWeight={700}>No staff profile found</Typography>
                  <Typography color="text.secondary">
                    Create an employee with the login email {user?.email || "-"}.
                  </Typography>
                </Box>
              )}

              <Button
                size="large"
                variant="contained"
                startIcon={todayAttendance?.clockIn ? <CheckCircle2 size={18} /> : <LogIn size={18} />}
                disabled={!employeeId || !qrScanned || loading || Boolean(todayAttendance?.clockIn)}
                onClick={() => clockIn({ variables: { employeeId } })}
              >
                {todayAttendance?.clockIn ? "Checked In" : loading ? "Checking In..." : "Check In"}
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
