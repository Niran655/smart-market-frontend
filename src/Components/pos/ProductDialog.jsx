import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  Box,
  CardMedia,
  Stack,
  Typography,
  Chip,
  Divider,
  IconButton,
  InputBase,
  Button,
} from "@mui/material";
import { CirclePlus, CircleMinus } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";

const ProductDialog = ({ open, onClose, product, onAddToCart, language, t }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const itemToAdd = {
      id: product._id,
      subProductId: product._id,
      productId: product.parentProductId._id,
      name: language === "kh" ? product.parentProductId.nameKh : product.parentProductId.nameEn,
      nameEn: product.parentProductId.nameEn,
      nameKh: product.parentProductId.nameKh,
      price: product.salePrice,
      qty: quantity,
      img: product.productImg,
      variant: product.saleType || "Original",
    };
    onAddToCart(itemToAdd);
    onClose();
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={4}>
         
          <Grid size={{xs:12,md:5}}>
            <Box
              sx={{
                width: 200,
                height: 300,
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: 1,
              }}
            >
              <CardMedia
                component="img"
                image={product.productImg || "/placeholder-food.jpg"}
                alt={product.parentProductId?.nameEn}
                sx={{
                  width: 200,
                  height: 300,
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>

        
          <Grid size={{xs:12,md:7}} >
            <Stack spacing={2}>
               
              <Typography variant="h5" fontWeight="bold">
                {language === "kh"
                  ? product.parentProductId?.nameKh
                  : product.parentProductId?.nameEn}
              </Typography>

              
              {product.productDes && (
                <Typography variant="body2" color="text.secondary">
                  {product.productDes}
                </Typography>
              )}

               
              <Typography variant="body2">
                <strong>{t(`category`)}</strong>{" "}
                {language === "kh"
                  ? product.parentProductId?.categoryId?.nameKh
                  : product.parentProductId?.categoryId?.nameEn}
              </Typography>

               
              <Typography variant="body2">
                <strong>{t(`unit`)}</strong>{" "}
                {language === "kh" ? product.unitId?.nameKh : product.unitId?.nameEn}
              </Typography>

              <Chip
                label={product.saleType || "Standard"}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ width: "fit-content" }}
              />

              <Divider />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold" color="primary">
                  ${product.salePrice?.toFixed(2)}
                </Typography>

                <Box display="flex" alignItems="center">
                  <IconButton onClick={handleDecrease}>
                    <CircleMinus />
                  </IconButton>

                  <InputBase
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1) setQuantity(val);
                    }}
                    sx={{
                      width: 70,
                      fontWeight: "bold",
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        padding: "6px 0",
                      },
                      border: "none",
                      outline: "none",
                      bgcolor: "transparent",
                    }}
                  />
                  <IconButton onClick={handleIncrease}>
                    <CirclePlus />
                  </IconButton>
                </Box>
              </Box>

             
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleAddToCart}
                sx={{ mt: 2 }}
                fullWidth
              >
                {language === "kh" ? "បញ្ចូលទៅក្នុងរទេះ" : "Add to Cart"} — $
                {(product.salePrice * quantity).toFixed(2)}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;