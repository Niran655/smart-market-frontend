// import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// // Helper: get contrasting text color (black or white) based on background luminance
// function getContrastText(hexColor) {
//   const r = parseInt(hexColor.slice(1, 3), 16);
//   const g = parseInt(hexColor.slice(3, 5), 16);
//   const b = parseInt(hexColor.slice(5, 7), 16);
//   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//   return luminance > 0.5 ? '#000000' : '#ffffff';
// }

// const ThemeContext = createContext();

// export const useThemeContext = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useThemeContext must be used within ThemeProvider');
//   }
//   return context;
// };

// export const ThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
//   const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || '#1976d2');
//   const [sidebarColor, setSidebarColor] = useState(() => {
//     const saved = localStorage.getItem('sidebarColor');
//     if (saved) return saved;
//     return mode === 'dark' ? '#121212' : '#ffffff';
//   });
//   const [layoutMode, setLayoutMode] = useState(() => localStorage.getItem('layoutMode') || 'default');
//   const [topbarColor, setTopbarColor] = useState(() => {
//     const saved = localStorage.getItem('topbarColor');
//     if (saved) return saved;
//     return mode === 'dark' ? '#1e293b' : '#ffffff';
//   });
//   const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
//   const [mobileDrawerWidth, setMobileDrawerWidth] = useState(() => Number(localStorage.getItem('mobileDrawerWidth')) || 280);
//   const [mobileShowLabels, setMobileShowLabels] = useState(() => {
//     const v = localStorage.getItem('mobileShowLabels');
//     return v === null ? true : v === 'true';
//   });

 
//   useEffect(() => { localStorage.setItem('themeMode', mode); }, [mode]);
//   useEffect(() => { localStorage.setItem('primaryColor', primaryColor); }, [primaryColor]);
//   useEffect(() => { localStorage.setItem('sidebarColor', sidebarColor); }, [sidebarColor]);
//   useEffect(() => { localStorage.setItem('layoutMode', layoutMode); }, [layoutMode]);
//   useEffect(() => { localStorage.setItem('topbarColor', topbarColor); }, [topbarColor]);
//   useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
//   useEffect(() => { localStorage.setItem('mobileDrawerWidth', String(mobileDrawerWidth)); }, [mobileDrawerWidth]);
//   useEffect(() => { localStorage.setItem('mobileShowLabels', String(mobileShowLabels)); }, [mobileShowLabels]);

 
//   useEffect(() => {
//     const root = document.documentElement;
//     root.style.setProperty('--table-bg', mode === 'dark' ? '#1e1e1e' : '#ffffff');
//     root.style.setProperty('--table-header-bg', mode === 'dark' ? '#2d2d2d' : '#f1f5f9');
//     root.style.setProperty('--table-row-bg', mode === 'dark' ? '#1e1e1e' : '#ffffff');
//     root.style.setProperty('--table-row-hover-bg', mode === 'dark' ? '#2a2a2a' : '#f8fafc');
//     root.style.setProperty('--table-text-primary', mode === 'dark' ? '#e2e8f0' : '#111827');
//     root.style.setProperty('--table-text-secondary', mode === 'dark' ? '#94a3b8' : '#374151');
//     root.style.setProperty('--table-header-text', mode === 'dark' ? '#e2e8f0' : '#1e293b');
//     root.style.setProperty('--table-divider', mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)');
//     root.style.setProperty('--chip-success-bg', mode === 'dark' ? 'rgba(45,149,150,0.2)' : 'rgba(45,149,150,0.1)');
//     root.style.setProperty('--chip-error-bg', mode === 'dark' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)');
//     root.style.setProperty('--chip-success-color', '#2D9596');
//     root.style.setProperty('--chip-error-color', '#ef4444');
//   }, [mode]);

//   const toggleColorMode = (newMode) => {
//     if (newMode) setMode(newMode);
//     else setMode(prev => (prev === 'light' ? 'dark' : 'light'));
//   };

//   const resetSettings = () => {
//     setMode('light');
//     setPrimaryColor('#1976d2');
//     setSidebarColor('#ffffff');
//     setLayoutMode('default');
//     setTopbarColor('#ffffff');
//     setFontSize('medium');
//     setMobileDrawerWidth(280);
//     setMobileShowLabels(true);
//     ['themeMode','primaryColor','sidebarColor','layoutMode','topbarColor','fontSize','mobileDrawerWidth','mobileShowLabels']
//       .forEach(key => localStorage.removeItem(key));
//   };

//   const theme = useMemo(() => {
//     const topbarTextColor = getContrastText(topbarColor);
//     const sidebarTextColor = getContrastText(sidebarColor);

//     return createTheme({
//       palette: {
//         mode,
//         primary: {
//           main: primaryColor,
//           light: mode === 'dark' ? '#e0f2fe' : '#e3f2fd',
//           dark: mode === 'dark' ? '#0c4a6e' : '#1565c0',
//         },
//         secondary: { main: mode === 'dark' ? '#94a3b8' : '#6b7280' },
//         background: {
//           default: mode === 'dark' ? '#0a0a0a' : '#E2E8F0',
//           paper: mode === 'dark' ? '#1e1e1e' : '#f9fafb',
//         },
//         text: {
//           primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
//           secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
//         },
//         divider: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
//       },
//       typography: {
//         fontFamily: ['Siemreap', 'Arial', 'sans-serif'].join(','),
//         fontSize: fontSize === 'small' ? 12 : fontSize === 'large' ? 16 : 14,
//         h1: { color: mode === 'dark' ? '#EBEDEF' : '#1e293b' },
//         h2: { color: mode === 'dark' ? '#EBEDEF' : '#1e293b' },
//         h3: { color: mode === 'dark' ? '#EBEDEF' : '#1e293b' },
//         h4: { color: mode === 'dark' ? '#EBEDEF' : '#1e293b' },
//         h5: { color: mode === 'dark' ? '#EBEDEF' : '#1e293b' },
//         h6: { color: mode === 'dark' ? '#EBEDEF' : '#1e293b' },
//         body1: { color: mode === 'dark' ? '#e2e8f0' : '#374151' },
//         body2: { color: mode === 'dark' ? '#cbd5e1' : '#6b7280' },
//       },
//       components: {
//         MuiAppBar: {
//           styleOverrides: {
//             root: {
//               backgroundColor: topbarColor,
//               color: topbarTextColor,
//               boxShadow: mode === 'dark' ? '0 1px 3px 0 rgba(0,0,0,0.5)' : '0 1px 3px 0 rgba(0,0,0,0.1)',
//               backgroundImage: 'none',
//             },
//           },
//         },
//         MuiDrawer: {
//           styleOverrides: {
//             paper: {
//               backgroundColor: sidebarColor,
//               color: sidebarTextColor,
//               border: 'none',
//               backgroundImage: 'none',
//             },
//           },
//         },
//         MuiCard: {
//           styleOverrides: {
//             root: {
//               backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
//               backgroundImage: 'none',
//               boxShadow: mode === 'dark'
//                 ? '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -1px rgba(0,0,0,0.3)'
//                 : '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
//               border: mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : 'none',
//             },
//           },
//         },
//         MuiPaper: {
//           styleOverrides: {
//             root: {
//               backgroundImage: 'none',
//               boxShadow: 'none',
//               border: mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : 'none',
//             },
//           },
//         },
//         MuiButton: {
//           styleOverrides: {
//             root: { textTransform: 'none', borderRadius: 8 },
//             contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
//           },
//         },
//         MuiSwitch: {
//           styleOverrides: {
//             switchBase: { color: mode === 'dark' ? '#94a3b8' : '#d1d5db' },
//             track: { backgroundColor: mode === 'dark' ? '#475569' : '#9ca3af' },
//           },
//         },
//         MuiTextField: {
//           styleOverrides: {
//             root: {
//               '& .MuiOutlinedInput-root': {
//                 backgroundColor: mode === 'dark' ? 'rgba(15,23,42,0.6)' : '#ffffff',
//                 '&:hover fieldset': { borderColor: mode === 'dark' ? '#475569' : '#d1d5db' },
//                 '&.Mui-focused fieldset': { borderColor: primaryColor },
//               },
//             },
//           },
//         },
//         MuiDivider: {
//           styleOverrides: { root: { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' } },
//         },
//         MuiTableContainer: {
//           styleOverrides: { root: { borderRadius: '12px', overflow: 'hidden', background: 'transparent', boxShadow: 'none' } },
//         },
//         MuiTable: {
//           styleOverrides: {
//             root: {
//               borderCollapse: 'separate',
//               // borderSpacing: '0 10px',
//               fontFamily: '"Khmer OS Siemreap", sans-serif',
//               backgroundColor: 'transparent',
//             },
//           },
//         },
//         MuiTableHead: {
//           styleOverrides: {
//             root: {
//               backgroundColor: 'var(--table-header-bg)',
//               '& .MuiTableCell-head': {
//                 fontWeight: 600,
//                 fontSize: '16px',
//                 color: 'var(--table-header-text)',
//                 border: 'none',
//                 backgroundColor: 'transparent',
//               },
//             },
//           },
//         },
//         MuiTableBody: {
//           styleOverrides: {
//             root: {
//               '& .MuiTableRow-root': {
//                 backgroundColor: 'var(--table-row-bg)',
//                 borderRadius: '12px',
//                 transition: 'all 0.2s ease-in-out',
//                 boxShadow: mode === 'dark' 
//                   ? '0 2px 4px rgba(0,0,0,0.4)' 
//                   : '0 2px 6px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
//                 '&:hover': {
//                   backgroundColor: 'var(--table-row-hover-bg)',
//                 },
//                 '& .MuiTableCell-body': {
//                   border: 'none',
//                   padding: '12px 16px',
//                   verticalAlign: 'middle',
//                   color: 'var(--table-text-primary)',
//                   fontSize: '15px',
//                 },
//               },
//             },
//           },
//         },
//         MuiTableCell: { styleOverrides: { root: { border: 'none' } } },
//         MuiTablePagination: {
//           styleOverrides: {
//             root: {
//               color: mode === 'dark' ? '#e2e8f0' : '#374151',
//               backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
//               borderTop: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)',
//             },
//             actions: { '& .MuiIconButton-root': { color: mode === 'dark' ? '#e2e8f0' : '#374151' } },
//           },
//         },
//         MuiChip: {
//           styleOverrides: {
//             root: {
//               fontWeight: 500,
//               borderRadius: '6px',
//               fontSize: '0.75rem',
//             },
//             colorSuccess: {
//               backgroundColor: 'var(--chip-success-bg)',
//               color: 'var(--chip-success-color)',
//               borderColor: 'var(--chip-success-color)',
//             },
//             colorError: {
//               backgroundColor: 'var(--chip-error-bg)',
//               color: 'var(--chip-error-color)',
//               borderColor: 'var(--chip-error-color)',
//             },
//           },
//         },
//       },
//       shape: { borderRadius: 8 },
//     });
//   }, [mode, primaryColor, sidebarColor, topbarColor, fontSize]);

//   const value = {
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
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
//     </ThemeContext.Provider>
//   );
// };
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#1976d2';
  });

  const [sidebarColor, setSidebarColor] = useState(() => {
    return localStorage.getItem('sidebarColor') || '#1e293b';
  });                                                                                                                                                                                                                                                                                                                       

  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem('layoutMode') || 'default';
  });

  const [topbarColor, setTopbarColor] = useState(() => {
    return localStorage.getItem('topbarColor') || '#ffffff';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  const [mobileDrawerWidth, setMobileDrawerWidth] = useState(() => {
    return Number(localStorage.getItem('mobileDrawerWidth')) || 280;
  });

  const [mobileShowLabels, setMobileShowLabels] = useState(() => {
    const v = localStorage.getItem('mobileShowLabels');
    return v === null ? true : v === 'true';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem('sidebarColor', sidebarColor);
  }, [sidebarColor]);

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem('topbarColor', topbarColor);
  }, [topbarColor]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('mobileDrawerWidth', String(mobileDrawerWidth));
  }, [mobileDrawerWidth]);

  useEffect(() => {
    localStorage.setItem('mobileShowLabels', String(mobileShowLabels));
  }, [mobileShowLabels]);

  const toggleColorMode = (newMode) => {
    if (newMode) {
      setMode(newMode);
    } else {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }
  };

  const resetSettings = () => {
    setMode('light');
    setPrimaryColor('#1976d2');
    setSidebarColor('#1e293b');
    setLayoutMode('default');
    setTopbarColor('#ffffff');
    setFontSize('medium');
    setMobileDrawerWidth(280);
    setMobileShowLabels(true);

    localStorage.removeItem('themeMode');
    localStorage.removeItem('primaryColor');
    localStorage.removeItem('sidebarColor');
    localStorage.removeItem('layoutMode');
    localStorage.removeItem('topbarColor');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('mobileDrawerWidth');
    localStorage.removeItem('mobileShowLabels');
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: primaryColor,
            light: mode === 'dark' ? '#e0f2fe' : '#e3f2fd',
            dark: mode === 'dark' ? '#0c4a6e' : '#1565c0',
          },
          secondary: {
            main: mode === 'dark' ? '#64748b' : '#6b7280',
          },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#E2E8F0',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
            secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
          },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
        },
       typography: {
          fontFamily: ["Siemreap", "Arial", "sans-serif"].join(","),
          fontSize: fontSize === "small" ? 12 : fontSize === "large" ? 16 : 14,
          h1: {
            color: mode === "dark" ? "#EBEDEF" : "#1e293b",
          },
          h2: {
            color: mode === "dark" ? "#EBEDEF" : "#1e293b",
          },
          h3: {
            color: mode === "dark" ? "#EBEDEF" : "#1e293b",
          },
          h4: {
            color: mode === "dark" ? "#EBEDEF" : "#1e293b",
          },
          h5: {
            color: mode === "dark" ? "#EBEDEF" : "#1e293b",
          },
          h6: {
            color: mode === "dark" ? "#EBEDEF" : "#1e293b",
          },
          body1: {
            color: mode === "dark" ? "#e2e8f0" : "#374151",
          },
          body2: {
            color: mode === "dark" ? "#cbd5e1" : "#6b7280",
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? topbarColor : '#ffffff',
                color: mode === 'dark' ? '#f1f5f9' : '#1e293b',
                boxShadow: mode === 'dark' 
                  ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                backgroundImage: 'none',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'dark' ? sidebarColor : '#ffffff',
                color: mode === 'dark' ? '#f1f5f9' : '#1e293b',
                border: 'none',
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
                backgroundImage: 'none',
                boxShadow: mode === 'dark' 
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                  : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow:"none"
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                color: mode === 'dark' ? '#94a3b8' : '#d1d5db',
              },
              track: {
                backgroundColor: mode === 'dark' ? '#475569' : '#9ca3af',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? '#475569' : '#d1d5db',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primaryColor,
                  },
                },
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: {
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'transparent',
                boxShadow: 'none',
              },
            },
          },
          MuiTable: {
            styleOverrides: {
              root: {
                borderCollapse: 'separate',
                borderSpacing: '0 10px',
                fontFamily: '"Khmer OS Siemreap", sans-serif',
                backgroundColor: 'transparent',
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1e293b' : '#f3f4f6',
                '& .MuiTableCell-head': {
                  fontWeight: 600,
                  fontSize: '16px',
                  color: mode === 'dark' ? '#e2e8f0' : '#374151',
                  border: 'none',
                  backgroundColor: 'transparent',
                },
              },
            },
          },
          MuiTableBody: {
            styleOverrides: {
              root: {
                '& .MuiTableRow-root': {
                  backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
                  borderRadius: '12px',
                  // boxShadow: mode === 'dark' 
                  //   ? '0 1px 3px rgba(0, 0, 0, 0.3)' 
                  //   : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? '#374151' : '#f1f5f9',
                    // transform: 'translateY(-2px)',
                  },
                  '& .MuiTableCell-body': {
                    border: 'none',
                    padding: '12px 16px',
                    verticalAlign: 'middle',
                    color: mode === 'dark' ? '#e2e8f0' : '#111827',
                    fontSize: '15px',
                  },
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                border: 'none',
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                color: mode === 'dark' ? '#e2e8f0' : '#374151',
                backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
                borderTop: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(0, 0, 0, 0.12)',
              },
              actions: {
                '& .MuiIconButton-root': {
                  color: mode === 'dark' ? '#e2e8f0' : '#374151',
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                borderRadius: '6px',
                fontSize: '0.75rem',
                '&.MuiCilled-colorSuccess': {
                  borderColor: '#265073',
                  color: '#2D9596',
                  backgroundColor: mode === 'dark' ? 'rgba(45, 149, 150, 0.1)' : 'rgba(45, 149, 150, 0.1)',
                },
                '&.MuiChip-colorError': {
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                },
              },
            },
          },
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [mode, primaryColor, sidebarColor, topbarColor, fontSize]
  );

  const value = {
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
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};