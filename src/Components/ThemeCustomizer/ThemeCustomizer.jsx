import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import "./ThemeCustomizer.scss";

export default function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const {
    mode,
    primaryColor,
    sidebarColor,
    layoutMode,
    topbarColor,
    fontSize,
    mobileDrawerWidth,
    mobileShowLabels,
    toggleColorMode,
    setPrimaryColor,
    setSidebarColor,
    setLayoutMode,
    setTopbarColor,
    setFontSize,
    setMobileDrawerWidth,
    setMobileShowLabels,
    resetSettings,
  } = useThemeContext();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getTriggerIcon = () => {
    if (mode === "khmerNewYear") {
      return <span style={{ fontSize: "1.2rem" }}>🌸</span>;
    }
    return <SettingsIcon className="rotating-icon" />;
  };

  const primaryColors = [
    { name: "Info", value: "#1976d2" },
    { name: "Blue", value: "#1D4592" },
    { name: "Green", value: "#2e7d32" },
    { name: "Orange", value: "#ed6c02" },
    { name: "Red", value: "#d32f2f" },
    { name: "Purple", value: "#9c27b0" },
    { name: "Teal", value: "#0097a7" },
  ];

  const sidebarColors = [
    { name: "White", value: "#FDFDFD" },
    { name: "Black", value: "#000000" },
    { name: "Dark", value: "#1e293b" },
    { name: "Blue", value: "#1e40af" },
    { name: "Green", value: "#15803d" },
    { name: "Purple", value: "#7c3aed" },
    { name: "Red", value: "#b91c1c" },
  ];

  const topbarColors = [
    { name: "White", value: "#FDFDFD" },
    { name: "Black", value: "#000000" },
    { name: "Dark", value: "#1e293b" },
    { name: "Blue", value: "#1976d2" },
    { name: "Gray", value: "#64748b" },
  ];

  return (
    <>
      <Tooltip
        title={mode === "khmerNewYear" ? "Khmer New Year Theme" : "Theme Settings"}
        placement="left"
      >
        <IconButton
          className="theme-customizer-trigger"
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor:
              mode === "khmerNewYear"
                ? "#C62828"
                : mode === "dark"
                ? "rgba(30, 41, 59, 0.9)"
                : "primary.main",
            color: "white",
            borderRadius: "8px 0 0 8px",
            width: 30,
            height: 30,
            zIndex: 9999,
            "&:hover": {
              backgroundColor:
                mode === "khmerNewYear"
                  ? "#B71C1C"
                  : mode === "dark"
                  ? "rgba(30, 41, 59, 1)"
                  : "primary.dark",
            },
            boxShadow:
              mode === "dark" || mode === "khmerNewYear"
                ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
            backdropFilter: mode === "dark" ? "blur(10px)" : "none",
          }}
        >
          {getTriggerIcon()}
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor:
              mode === "dark"
                ? "#0f172a"
                : mode === "glass"
                ? "rgba(15, 23, 42, 0.8)"
                : mode === "khmerNewYear"
                ? "rgba(13, 17, 23, 0.95)"
                : "background.paper",
            backgroundImage:
              mode === "dark"
                ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                : mode === "khmerNewYear"
                ? "radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%)"
                : mode === "glass"
                ? "none"
                : "none",
            color:
              mode === "dark" || mode === "glass"
                ? "#e2e8f0"
                : mode === "khmerNewYear"
                ? "#f8fafc"
                : "text.primary",
            ...(mode === "glass" && {
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }),
            borderRight: mode === "khmerNewYear" ? "2px solid #FFB300" : "none",
          },
        }}
      >
        <Box className="theme-customizer">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              backgroundColor:
                mode === "dark" || mode === "glass"
                  ? "rgba(30, 41, 59, 0.5)"
                  : mode === "khmerNewYear"
                  ? "rgba(255, 179, 0, 0.1)"
                  : "transparent",
              borderBottom:
                mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color:
                  mode === "dark" || mode === "glass"
                    ? "#f8fafc"
                    : mode === "khmerNewYear"
                    ? "#FFB300"
                    : "text.primary",
              }}
            >
              Theme Customizer
            </Typography>
            <IconButton
              onClick={toggleDrawer}
              size="small"
              sx={{
                color:
                  mode === "dark" || mode === "glass"
                    ? "#94a3b8"
                    : mode === "khmerNewYear"
                    ? "#FFB300"
                    : "text.secondary",
                "&:hover": {
                  backgroundColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider
            sx={{
              borderColor:
                mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "divider",
            }}
          />

          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              maxHeight: "calc(100vh - 120px)",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background:
                  mode === "dark" || mode === "glass"
                    ? "rgba(30, 41, 59, 0.5)"
                    : "#f1f1f1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background:
                  mode === "dark" || mode === "glass"
                    ? "rgba(100, 116, 139, 0.5)"
                    : "#c1c1c1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background:
                  mode === "dark" || mode === "glass"
                    ? "rgba(100, 116, 139, 0.8)"
                    : "#a8a8a8",
              },
            }}
          >
            <Stack spacing={3}>
              {/* Theme Mode - Four buttons */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  mb={1.5}
                  sx={{
                    color:
                      mode === "dark" || mode === "glass"
                        ? "#f1f5f9"
                        : mode === "khmerNewYear"
                        ? "#FFB300"
                        : "text.primary",
                  }}
                >
                  Theme Mode
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    variant={mode === "light" ? "contained" : "outlined"}
                    onClick={() => toggleColorMode("light")}
                    fullWidth
                    sx={{
                      backgroundColor:
                        mode === "light"
                          ? "primary.main"
                          : "transparent",
                      color:
                        mode === "light"
                          ? "white"
                          : mode === "dark" || mode === "glass"
                          ? "#e2e8f0"
                          : mode === "khmerNewYear"
                          ? "#f8fafc"
                          : "text.primary",
                      borderColor:
                        mode === "dark" || mode === "glass"
                          ? "#475569"
                          : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        backgroundColor:
                          mode === "light"
                            ? "primary.dark"
                            : mode === "dark" || mode === "glass"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Light
                  </Button>
                  <Button
                    variant={mode === "dark" ? "contained" : "outlined"}
                    onClick={() => toggleColorMode("dark")}
                    fullWidth
                    sx={{
                      backgroundColor:
                        mode === "dark" ? "#334155" : "transparent",
                      color:
                        mode === "dark"
                          ? "white"
                          : mode === "dark" || mode === "glass"
                          ? "#e2e8f0"
                          : mode === "khmerNewYear"
                          ? "#f8fafc"
                          : "text.primary",
                      borderColor:
                        mode === "dark" || mode === "glass"
                          ? "#475569"
                          : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        backgroundColor:
                          mode === "dark"
                            ? "#475569"
                            : mode === "dark" || mode === "glass"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={mode === "glass" ? "contained" : "outlined"}
                    onClick={() => toggleColorMode("glass")}
                    fullWidth
                    sx={{
                      backgroundColor:
                        mode === "glass"
                          ? "rgba(51, 65, 85, 0.7)"
                          : "transparent",
                      color:
                        mode === "glass"
                          ? "white"
                          : mode === "dark" || mode === "glass"
                          ? "#e2e8f0"
                          : mode === "khmerNewYear"
                          ? "#f8fafc"
                          : "text.primary",
                      borderColor:
                        mode === "dark" || mode === "glass"
                          ? "#475569"
                          : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        backgroundColor:
                          mode === "glass"
                            ? "rgba(71, 85, 105, 0.8)"
                            : mode === "dark" || mode === "glass"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                      ...(mode === "glass" && {
                        backdropFilter: "blur(5px)",
                        WebkitBackdropFilter: "blur(5px)",
                      }),
                    }}
                  >
                    Glass
                  </Button>
                  <Button
                    variant={mode === "khmerNewYear" ? "contained" : "outlined"}
                    onClick={() => toggleColorMode("khmerNewYear")}
                    fullWidth
                    sx={{
                      backgroundColor:
                        mode === "khmerNewYear" ? "#C62828" : "transparent",
                      color:
                        mode === "khmerNewYear"
                          ? "white"
                          : mode === "dark" || mode === "glass"
                          ? "#e2e8f0"
                          : mode === "khmerNewYear"
                          ? "#f8fafc"
                          : "text.primary",
                      borderColor:
                        mode === "dark" || mode === "glass"
                          ? "#475569"
                          : "rgba(0, 0, 0, 0.23)",
                      "&:hover": {
                        backgroundColor:
                          mode === "khmerNewYear"
                            ? "#B71C1C"
                            : mode === "dark" || mode === "glass"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    🇰🇭 Khmer New Year
                  </Button>
                </Stack>
              </Box>

              <Divider
                sx={{
                  borderColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                }}
              />

              {/* Mobile Drawer Width */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  mb={1.5}
                  sx={{
                    color:
                      mode === "dark" || mode === "glass"
                        ? "#f1f5f9"
                        : mode === "khmerNewYear"
                        ? "#FFB300"
                        : "text.primary",
                  }}
                >
                  Mobile Drawer Width
                </Typography>
                <TextField
                  type="number"
                  value={mobileDrawerWidth}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 200;
                    setMobileDrawerWidth(v);
                  }}
                  inputProps={{ min: 160, max: 480 }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor:
                        mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                          ? "rgba(30, 41, 59, 0.5)"
                          : "transparent",
                      borderColor:
                        mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                          ? "#475569"
                          : "rgba(0, 0, 0, 0.23)",
                      color:
                        mode === "dark" || mode === "glass"
                          ? "#e2e8f0"
                          : mode === "khmerNewYear"
                          ? "#f8fafc"
                          : "text.primary",
                      "&:hover fieldset": {
                        borderColor:
                          mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                            ? "#64748b"
                            : "rgba(0, 0, 0, 0.87)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          mode === "dark" || mode === "glass"
                            ? "#3b82f6"
                            : "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color:
                        mode === "dark" || mode === "glass"
                          ? "#94a3b8"
                          : mode === "khmerNewYear"
                          ? "#FFB300"
                          : "text.secondary",
                    },
                  }}
                />
              </Box>

              <Divider
                sx={{
                  borderColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                }}
              />

              {/* Show Labels on Mobile */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  mb={1.5}
                  sx={{
                    color:
                      mode === "dark" || mode === "glass"
                        ? "#f1f5f9"
                        : mode === "khmerNewYear"
                        ? "#FFB300"
                        : "text.primary",
                  }}
                >
                  Show Labels on Mobile
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Switch
                    checked={Boolean(mobileShowLabels)}
                    onChange={(e) =>
                      setMobileShowLabels(!!e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color:
                          mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                            ? "#FFB300"
                            : "primary.main",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor:
                            mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                              ? "#FFB300"
                              : "primary.main",
                        },
                    }}
                  />
                  <Typography
                    sx={{
                      color:
                        mode === "dark" || mode === "glass"
                          ? "#e2e8f0"
                          : mode === "khmerNewYear"
                          ? "#f8fafc"
                          : "text.primary",
                    }}
                  >
                    {mobileShowLabels ? "Labels shown" : "Icons only"}
                  </Typography>
                </Stack>
              </Box>

              <Divider
                sx={{
                  borderColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                }}
              />

              {/* Primary Color */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  mb={1.5}
                  sx={{
                    color:
                      mode === "dark" || mode === "glass"
                        ? "#f1f5f9"
                        : mode === "khmerNewYear"
                        ? "#FFB300"
                        : "text.primary",
                  }}
                >
                  Primary Color
                </Typography>
                <Box className="color-grid">
                  {primaryColors.map((color) => (
                    <Tooltip key={color.value} title={color.name}>
                      <Box
                        className={`color-option ${
                          primaryColor === color.value ? "active" : ""
                        }`}
                        onClick={() => setPrimaryColor(color.value)}
                        sx={{
                          backgroundColor: color.value,
                          boxShadow:
                            mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                              ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                              : "0 2px 4px rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow:
                              mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                                : "0 4px 8px rgba(0, 0, 0, 0.2)",
                          },
                          "&.active": {
                            boxShadow:
                              mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                                ? `0 0 0 3px ${color.value}, 0 0 0 6px rgba(255, 255, 255, 0.2)`
                                : `0 0 0 3px ${color.value}, 0 0 0 6px rgba(0, 0, 0, 0.1)`,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              <Divider
                sx={{
                  borderColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                }}
              />

              {/* Sidebar Color */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  mb={1.5}
                  sx={{
                    color:
                      mode === "dark" || mode === "glass"
                        ? "#f1f5f9"
                        : mode === "khmerNewYear"
                        ? "#FFB300"
                        : "text.primary",
                  }}
                >
                  Sidebar Color
                </Typography>
                <Box className="color-grid">
                  {sidebarColors.map((color) => (
                    <Tooltip key={color.value} title={color.name}>
                      <Box
                        className={`color-option ${
                          sidebarColor === color.value ? "active" : ""
                        }`}
                        onClick={() => setSidebarColor(color.value)}
                        sx={{
                          backgroundColor: color.value,
                          border:
                            color.value === "#FDFDFD" ||
                            color.value === "#ffffff"
                              ? "1px solid #e0e0e0"
                              : "none",
                          boxShadow:
                            mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                              ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                              : "0 2px 4px rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow:
                              mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                                : "0 4px 8px rgba(0, 0, 0, 0.2)",
                          },
                          "&.active": {
                            boxShadow:
                              mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                                ? `0 0 0 3px ${color.value}, 0 0 0 6px rgba(255, 255, 255, 0.2)`
                                : `0 0 0 3px ${color.value}, 0 0 0 6px rgba(0, 0, 0, 0.1)`,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              <Divider
                sx={{
                  borderColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                }}
              />

              {/* Topbar Color */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  mb={1.5}
                  sx={{
                    color:
                      mode === "dark" || mode === "glass"
                        ? "#f1f5f9"
                        : mode === "khmerNewYear"
                        ? "#FFB300"
                        : "text.primary",
                  }}
                >
                  Topbar Color
                </Typography>
                <Box className="color-grid">
                  {topbarColors.map((color) => (
                    <Tooltip key={color.value} title={color.name}>
                      <Box
                        className={`color-option ${
                          topbarColor === color.value ? "active" : ""
                        }`}
                        onClick={() => setTopbarColor(color.value)}
                        sx={{
                          backgroundColor: color.value,
                          border:
                            color.value === "#FDFDFD" ||
                            color.value === "#ffffff"
                              ? "1px solid #e0e0e0"
                              : "none",
                          boxShadow:
                            mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                              ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                              : "0 2px 4px rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow:
                              mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                                : "0 4px 8px rgba(0, 0, 0, 0.2)",
                          },
                          "&.active": {
                            boxShadow:
                              mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                                ? `0 0 0 3px ${color.value}, 0 0 0 6px rgba(255, 255, 255, 0.2)`
                                : `0 0 0 3px ${color.value}, 0 0 0 6px rgba(0, 0, 0, 0.1)`,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              <Divider
                sx={{
                  borderColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                }}
              />

              {/* Layout Mode */}
              <Box>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      mb={1}
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#f1f5f9"
                            : mode === "khmerNewYear"
                            ? "#FFB300"
                            : "text.primary",
                      }}
                    >
                      Layout Mode
                    </Typography>
                  </FormLabel>
                  <RadioGroup
                    value={layoutMode}
                    onChange={(e) => setLayoutMode(e.target.value)}
                  >
                    <FormControlLabel
                      value="default"
                      control={
                        <Radio
                          sx={{
                            color:
                              mode === "dark" || mode === "glass"
                                ? "#94a3b8"
                                : "text.secondary",
                            "&.Mui-checked": {
                              color:
                                mode === "dark" || mode === "glass"
                                  ? "#3b82f6"
                                  : "primary.main",
                            },
                          }}
                        />
                      }
                      label="Default"
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#e2e8f0"
                            : mode === "khmerNewYear"
                            ? "#f8fafc"
                            : "text.primary",
                      }}
                    />
                    <FormControlLabel
                      value="boxed"
                      control={
                        <Radio
                          sx={{
                            color:
                              mode === "dark" || mode === "glass"
                                ? "#94a3b8"
                                : "text.secondary",
                            "&.Mui-checked": {
                              color:
                                mode === "dark" || mode === "glass"
                                  ? "#3b82f6"
                                  : "primary.main",
                            },
                          }}
                        />
                      }
                      label="Boxed"
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#e2e8f0"
                            : mode === "khmerNewYear"
                            ? "#f8fafc"
                            : "text.primary",
                      }}
                    />
                    <FormControlLabel
                      value="compact"
                      control={
                        <Radio
                          sx={{
                            color:
                              mode === "dark" || mode === "glass"
                                ? "#94a3b8"
                                : "text.secondary",
                            "&.Mui-checked": {
                              color:
                                mode === "dark" || mode === "glass"
                                  ? "#3b82f6"
                                  : "primary.main",
                            },
                          }}
                        />
                      }
                      label="Compact"
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#e2e8f0"
                            : mode === "khmerNewYear"
                            ? "#f8fafc"
                            : "text.primary",
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Divider
                sx={{
                  borderColor:
                    mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                }}
              />

              {/* Font Size */}
              <Box>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      mb={1}
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#f1f5f9"
                            : mode === "khmerNewYear"
                            ? "#FFB300"
                            : "text.primary",
                      }}
                    >
                      Font Size
                    </Typography>
                  </FormLabel>
                  <RadioGroup
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  >
                    <FormControlLabel
                      value="small"
                      control={
                        <Radio
                          sx={{
                            color:
                              mode === "dark" || mode === "glass"
                                ? "#94a3b8"
                                : "text.secondary",
                            "&.Mui-checked": {
                              color:
                                mode === "dark" || mode === "glass"
                                  ? "#3b82f6"
                                  : "primary.main",
                            },
                          }}
                        />
                      }
                      label="Small"
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#e2e8f0"
                            : mode === "khmerNewYear"
                            ? "#f8fafc"
                            : "text.primary",
                      }}
                    />
                    <FormControlLabel
                      value="medium"
                      control={
                        <Radio
                          sx={{
                            color:
                              mode === "dark" || mode === "glass"
                                ? "#94a3b8"
                                : "text.secondary",
                            "&.Mui-checked": {
                              color:
                                mode === "dark" || mode === "glass"
                                  ? "#3b82f6"
                                  : "primary.main",
                            },
                          }}
                        />
                      }
                      label="Medium"
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#e2e8f0"
                            : mode === "khmerNewYear"
                            ? "#f8fafc"
                            : "text.primary",
                      }}
                    />
                    <FormControlLabel
                      value="large"
                      control={
                        <Radio
                          sx={{
                            color:
                              mode === "dark" || mode === "glass"
                                ? "#94a3b8"
                                : "text.secondary",
                            "&.Mui-checked": {
                              color:
                                mode === "dark" || mode === "glass"
                                  ? "#3b82f6"
                                  : "primary.main",
                            },
                          }}
                        />
                      }
                      label="Large"
                      sx={{
                        color:
                          mode === "dark" || mode === "glass"
                            ? "#e2e8f0"
                            : mode === "khmerNewYear"
                            ? "#f8fafc"
                            : "text.primary",
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Stack>
          </Box>

          <Divider
            sx={{
              borderColor:
                mode === "dark" || mode === "glass" || mode === "khmerNewYear"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "divider",
            }}
          />

          <Box
            sx={{
              p: 2,
              backgroundColor:
                mode === "dark" || mode === "glass"
                  ? "rgba(30, 41, 59, 0.5)"
                  : mode === "khmerNewYear"
                  ? "rgba(255, 179, 0, 0.1)"
                  : "transparent",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<RefreshIcon />}
              onClick={resetSettings}
              sx={{
                borderColor:
                  mode === "dark" || mode === "glass"
                    ? "#ef4444"
                    : "error.main",
                color:
                  mode === "dark" || mode === "glass"
                    ? "#ef4444"
                    : "error.main",
                "&:hover": {
                  backgroundColor:
                    mode === "dark" || mode === "glass"
                      ? "rgba(239, 68, 68, 0.1)"
                      : "rgba(211, 47, 47, 0.04)",
                  borderColor:
                    mode === "dark" || mode === "glass"
                      ? "#dc2626"
                      : "error.dark",
                },
              }}
            >
              Reset to Default
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
// import SettingsIcon from '@mui/icons-material/Settings';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import CloseIcon from '@mui/icons-material/Close';
// import { Box, Button, Divider, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
// import React, { useState } from 'react';

// import { useThemeContext } from '../../Context/ThemeContext';
// import './ThemeCustomizer.scss';

// export default function ThemeCustomizer() {
//   const [open, setOpen] = useState(false);
//   const {
//     mode,
//     primaryColor,
//     sidebarColor,
//     layoutMode,
//     topbarColor,
//     fontSize,
//     mobileDrawerWidth,
//     mobileShowLabels,
//     toggleColorMode,
//     setPrimaryColor,
//     setSidebarColor,
//     setLayoutMode,
//     setTopbarColor,
//     setFontSize,
//     setMobileDrawerWidth,
//     setMobileShowLabels,
//     resetSettings,
//   } = useThemeContext();

//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   const primaryColors = [
//     { name: 'Blue', value: '#1976d2' },
//     { name: 'Green', value: '#2e7d32' },
//     { name: 'Orange', value: '#ed6c02' },
//     { name: 'Red', value: '#d32f2f' },
//     { name: 'Purple', value: '#9c27b0' },
//     { name: 'Teal', value: '#0097a7' },
//   ];

//   const sidebarColors = [
//     { name: 'Dark', value: '#1e293b' },
//     { name: 'Blue', value: '#1e40af' },
//     { name: 'Green', value: '#15803d' },
//     { name: 'Purple', value: '#7c3aed' },
//     { name: 'Red', value: '#b91c1c' },
//   ];

//   const topbarColors = [
//     { name: 'White', value: '#ffffff' },
//     { name: 'Dark', value: '#1e293b' },
//     { name: 'Blue', value: '#1976d2' },
//     { name: 'Gray', value: '#64748b' },
//   ];

//   return (
//     <>
//       <Tooltip title="Theme Settings" placement="left">
//         <IconButton
//           className="theme-customizer-trigger"
//           onClick={toggleDrawer}
//           sx={{
//             position: 'fixed',
//             right: 0,
//             top: '50%',
//             transform: 'translateY(-50%)',
//             backgroundColor: mode === 'dark' ? '#1e293b' : 'primary.main',
//             color: 'white',
//             borderRadius: '8px 0 0 8px',
//             width: 50,
//             height: 50,
//             zIndex: 9999,
//             '&:hover': {
//               backgroundColor: mode === 'dark' ? '#334155' : 'primary.dark',
//             },
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//           }}
//         >
//           <SettingsIcon className="rotating-icon" />
//         </IconButton>
//       </Tooltip>

//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={toggleDrawer}
//         PaperProps={{
//           sx: { 
//             width: 320,
//             backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
//             backgroundImage: 'none',
//           },
//         }}
//       >
//         <Box className="theme-customizer">
//           {/* Header */}
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               p: 2,
//               backgroundColor: mode === 'dark' ? '#0f172a' : '#f8fafc',
//               borderBottom: `1px solid ${mode === 'dark' ? '#334155' : '#e2e8f0'}`,
//             }}
//           >
//             <Typography 
//               variant="h6" 
//               fontWeight="bold"
//               sx={{ color: mode === 'dark' ? '#f8fafc' : '#1e293b' }}
//             >
//               Theme Customizer
//             </Typography>
//             <IconButton 
//               onClick={toggleDrawer} 
//               size="small"
//               sx={{ 
//                 color: mode === 'dark' ? '#94a3b8' : '#64748b',
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//           {/* Content */}
//           <Box sx={{ 
//             p: 2, 
//             overflowY: 'auto', 
//             maxHeight: 'calc(100vh - 120px)',
//             backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
//           }}>
//             <Stack spacing={3}>
//               {/* Theme Mode */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Theme Mode
//                 </Typography>
//                 <Stack direction="row" spacing={1}>
//                   <Button
//                     variant={mode === 'light' ? 'contained' : 'outlined'}
//                     onClick={() => toggleColorMode('light')}
//                     fullWidth
//                     sx={{
//                       backgroundColor: mode === 'light' ? primaryColor : 'transparent',
//                       color: mode === 'light' ? 'white' : (mode === 'dark' ? '#e2e8f0' : '#64748b'),
//                       borderColor: mode === 'dark' ? '#475569' : '#cbd5e1',
//                       '&:hover': {
//                         backgroundColor: mode === 'light' ? primaryColor : (mode === 'dark' ? '#334155' : '#f1f5f9'),
//                       }
//                     }}
//                   >
//                     Light
//                   </Button>
//                   <Button
//                     variant={mode === 'dark' ? 'contained' : 'outlined'}
//                     onClick={() => toggleColorMode('dark')}
//                     fullWidth
//                     sx={{
//                       backgroundColor: mode === 'dark' ? '#334155' : 'transparent',
//                       color: mode === 'dark' ? 'white' : (mode === 'dark' ? '#e2e8f0' : '#64748b'),
//                       borderColor: mode === 'dark' ? '#475569' : '#cbd5e1',
//                       '&:hover': {
//                         backgroundColor: mode === 'dark' ? '#475569' : (mode === 'dark' ? '#334155' : '#f1f5f9'),
//                       }
//                     }}
//                   >
//                     Dark
//                   </Button>
//                 </Stack>
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Mobile Drawer Width */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Mobile Drawer Width
//                 </Typography>
//                 <TextField
//                   type="number"
//                   value={mobileDrawerWidth}
//                   onChange={(e) => {
//                     const v = Number(e.target.value) || 200;
//                     setMobileDrawerWidth(v);
//                   }}
//                   inputProps={{ min: 160, max: 480 }}
//                   fullWidth
//                   size="small"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       backgroundColor: mode === 'dark' ? '#0f172a' : '#ffffff',
//                       color: mode === 'dark' ? '#f1f5f9' : '#1e293b',
//                       '& fieldset': {
//                         borderColor: mode === 'dark' ? '#334155' : '#cbd5e1',
//                       },
//                       '&:hover fieldset': {
//                         borderColor: mode === 'dark' ? '#475569' : '#94a3b8',
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: primaryColor,
//                       },
//                     },
//                   }}
//                 />
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Show Labels on Mobile */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Show Labels on Mobile
//                 </Typography>
//                 <Stack direction="row" alignItems="center" spacing={1}>
//                   <Switch
//                     checked={Boolean(mobileShowLabels)}
//                     onChange={(e) => setMobileShowLabels(!!e.target.checked)}
//                     sx={{
//                       '& .MuiSwitch-switchBase.Mui-checked': {
//                         color: primaryColor,
//                       },
//                       '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                         backgroundColor: primaryColor,
//                       },
//                     }}
//                   />
//                   <Typography sx={{ color: mode === 'dark' ? '#e2e8f0' : '#475569' }}>
//                     {mobileShowLabels ? 'Labels shown' : 'Icons only'}
//                   </Typography>
//                 </Stack>
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Primary Color */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Primary Color
//                 </Typography>
//                 <Box className="color-grid">
//                   {primaryColors.map((color) => (
//                     <Tooltip key={color.value} title={color.name}>
//                       <Box
//                         className={`color-option ${
//                           primaryColor === color.value ? 'active' : ''
//                         }`}
//                         onClick={() => setPrimaryColor(color.value)}
//                         sx={{ 
//                           backgroundColor: color.value,
//                           border: primaryColor === color.value ? `2px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` : '2px solid transparent',
//                           '&:hover': {
//                             transform: 'scale(1.05)',
//                           },
//                         }}
//                       />
//                     </Tooltip>
//                   ))}
//                 </Box>
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Sidebar Color */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Sidebar Color
//                 </Typography>
//                 <Box className="color-grid">
//                   {sidebarColors.map((color) => (
//                     <Tooltip key={color.value} title={color.name}>
//                       <Box
//                         className={`color-option ${
//                           sidebarColor === color.value ? 'active' : ''
//                         }`}
//                         onClick={() => setSidebarColor(color.value)}
//                         sx={{ 
//                           backgroundColor: color.value,
//                           border: sidebarColor === color.value ? `2px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` : '2px solid transparent',
//                           '&:hover': {
//                             transform: 'scale(1.05)',
//                           },
//                         }}
//                       />
//                     </Tooltip>
//                   ))}
//                 </Box>
//               </Box>

//               {/* Add similar sections for other customizations... */}
//             </Stack>
//           </Box>

//           <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//           {/* Reset Button */}
//           <Box sx={{ 
//             p: 2,
//             backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
//           }}>
//             <Button
//               variant="outlined"
//               color="error"
//               fullWidth
//               startIcon={<RefreshIcon />}
//               onClick={resetSettings}
//               sx={{
//                 borderColor: mode === 'dark' ? '#ef4444' : '#dc2626',
//                 color: mode === 'dark' ? '#ef4444' : '#dc2626',
//                 '&:hover': {
//                   backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.04)',
//                   borderColor: mode === 'dark' ? '#dc2626' : '#b91c1c',
//                 }
//               }}
//             >
//               Reset to Default
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// }