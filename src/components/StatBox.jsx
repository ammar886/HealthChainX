import { Box, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../theme";

const StatBox = ({ icon, title, value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 20px 0 30px">
      <Grid container>
        <Grid item xs={6}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Box>
              {icon}
            </Box>
            <Typography variant="h4" sx={{ color: colors.grey[100] }}>
              {title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" justifyContent="right" alignItems="center" height="100%">
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{ color: colors.grey[100] }}
            >
              {value}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatBox;
