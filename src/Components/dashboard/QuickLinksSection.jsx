import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { BookOpenCheck, CalendarDays, ClipboardList, DollarSign, FileText, NotebookPen } from 'lucide-react';

const quickLinks = [
  { label: 'Exam Result', color: '#FFB93B', icon: <ClipboardList size={30} /> },
  { label: 'Attendance', color: '#4DD0E1', icon: <BookOpenCheck size={30} /> },
  { label: 'Calendar', color: '#9575CD', icon: <CalendarDays size={30} /> },
  { label: 'Home Work', color: '#81C784', icon: <NotebookPen size={30} /> },
  { label: 'Report', color: '#F06292', icon: <FileText size={30} /> },
  { label: 'Fees', color: '#FF8A65', icon: <DollarSign size={30} /> },
];

export default function QuickLinksSection() {
  return (

        <Grid container spacing={2}>
          {quickLinks.map((item, index) => (
            <Grid size={{xs:12,sm:6,md:4}} key={index}>
              <Box
                className="link-box"
                sx={{
                  bgcolor: item.color,
                  height: 100,
                  borderRadius: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  alignContent: 'center',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {item.icon}
                <Typography className="text" sx={{ fontSize: 14 }}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
     
  );
}