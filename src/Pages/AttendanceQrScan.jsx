import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle2, LogIn, ScanLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";

import { CLOCK_IN_ATTENDANCE } from "../../graphql/mutation";
import { GET_EMPLOYEES_WITH_PAGINATION, GET_TODAY_ATTENDANCE } from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

export default function AttendanceQrScan() {
  const { language, setAlert, user } = useAuth();
  const { t } = translateLauguage(language);
  const [searchParams] = useSearchParams();
  const [scannerActive, setScannerActive] = useState(false);
  const [qrScanned, setQrScanned] = useState(searchParams.get("scan") === "1");

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

  const { data: todayData, refetch } = useQuery(GET_TODAY_ATTENDANCE, {
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
    if (!scannerActive) return undefined;

    const scanner = new Html5QrcodeScanner(
      "attendance-qr-reader",
      {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        rememberLastUsedCamera: true,
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

  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <Breadcrumbs separator="/">
        <Typography component={RouterLink} to="/" sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>
          Attendance
        </Typography>
        <Typography fontWeight={600}>{t("qr_check_in") || "QR Check In"}</Typography>
      </Breadcrumbs>

      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, p: 3, mt: 4 }}>
        <Stack spacing={2} alignItems="stretch">
          <Stack alignItems="center" spacing={1}>
            <ScanLine size={42} color="#1D4592" />
            <Typography variant="h5" fontWeight={800}>Attendance Check In</Typography>
            <Typography color="text.secondary" textAlign="center">
              Login first, then scan the attendance QR to check in with your account.
            </Typography>
          </Stack>

          <Button
            variant={scannerActive ? "outlined" : "contained"}
            startIcon={<Camera size={18} />}
            onClick={() => setScannerActive((active) => !active)}
          >
            {scannerActive ? "Close Scanner" : "Scan QR"}
          </Button>

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
                  color={todayAttendance?.clockIn ? "success" : "default"}
                  label={todayAttendance?.clockIn ? `Clocked in ${dayjs(todayAttendance.clockIn).format("hh:mm A")}` : "Not checked in"}
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
            startIcon={<LogIn size={18} />}
            disabled={!employeeId || !qrScanned || loading || Boolean(todayAttendance?.clockIn)}
            onClick={() => clockIn({ variables: { employeeId } })}
          >
            Check In
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
