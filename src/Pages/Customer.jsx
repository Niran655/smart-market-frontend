import { Box, Button, Typography } from "@mui/material";

export default function Customer ({title,subtitale}){
    
    return(
        <Box>
            <h1>{title}</h1>
            <Typography>{subtitale}</Typography>
            <Button variant="contained" >Text</Button>
        
        </Box>  
    )
}
 