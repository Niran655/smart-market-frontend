import React, { useState, useEffect } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { CirclePlus, CircleMinus } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";

const ProductDialog = ({ open, onClose, product, onAddToCart, language, t }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSugar, setSelectedSugar] = useState(null);
  const [expanded, setExpanded] = useState(false);  

 
  useEffect(() => {
    if (product && product.additionPrices && product.additionPrices.length > 0) {
      const firstSize = product.additionPrices[0];
      setSelectedSize(firstSize);
      setExpanded(firstSize._id);  
      if (firstSize.children && firstSize.children.length > 0) {
        setSelectedSugar(firstSize.children[0]);
      } else {
        setSelectedSugar(null);
      }
    } else {
      setSelectedSize(null);
      setSelectedSugar(null);
      setExpanded(false);
    }
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  
  const sizePrice = selectedSize?.price || 0;
  const sugarPrice = selectedSugar?.price || 0;
  const additionTotal = sizePrice + sugarPrice;

  const basePrice = product.salePrice || 0;
  const finalUnitPrice = basePrice + additionTotal;
  const finalTotal = finalUnitPrice * quantity;

 
  const buildItemName = () => {
    const baseName = language === "kh" ? product.parentProductId?.nameKh : product.parentProductId?.nameEn;
    const sizeName = selectedSize ? (language === "kh" ? selectedSize.nameKhmer : selectedSize.nameEnglish) : "";
    const sugarName = selectedSugar ? (selectedSugar.sugarLevel || (language === "kh" ? selectedSugar.nameKhmer : selectedSugar.nameEnglish)) : "";
    const parts = [baseName];
    if (sizeName) parts.push(sizeName);
    if (sugarName) parts.push(`(${sugarName})`);
    return parts.join(" - ");
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setExpanded(size._id);  
 
    if (size.children && size.children.length > 0) {
      setSelectedSugar(size.children[0]);
    } else {
      setSelectedSugar(null);
    }
  };

  const handleSugarChange = (sugar) => {
    setSelectedSugar(sugar);
  };

  const handleAccordionChange = (sizeId) => (event, isExpanded) => {
 
    if (event.target.type !== 'radio') {
      setExpanded(isExpanded ? sizeId : false);
    }
  };

const handleAddToCart = () => {
 
  const uniqueId = `${product._id}_${selectedSize?._id || 'no_size'}_${selectedSugar?._id || 'no_sugar'}`;
  
  const itemToAdd = {
    id: uniqueId,               
    originalId: product._id,    
    subProductId: product._id,
    productId: product.parentProductId._id,
    name: buildItemName(),
    nameEn: buildItemName(),
    nameKh: buildItemName(),
    price: finalUnitPrice,
    qty: quantity,
    img: product.productImg,
    variant: product.saleType || "Original",
    selectedSize: selectedSize,
    selectedSugar: selectedSugar,
  };
  onAddToCart(itemToAdd);
  onClose();
};

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));

  const getSizeDisplayName = (size) => {
    if (language === "kh") return size.nameKhmer || size.nameEnglish;
    return size.nameEnglish || size.nameKhmer;
  };

  const getSugarDisplayName = (sugar) => {
    if (sugar.sugarLevel) return sugar.sugarLevel;
    if (language === "kh") return sugar.nameKhmer || sugar.nameEnglish;
    return sugar.nameEnglish || sugar.nameKhmer;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={4}>
          {/* Left Column: Image */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ width: "100%", borderRadius: 1, overflow: "hidden", boxShadow: 1 }}>
              <CardMedia
                component="img"
                image={product.productImg || "/placeholder-food.jpg"}
                alt={product.parentProductId?.nameEn}
                sx={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </Box>
   
              {product.additionPrices && product.additionPrices.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {t("additions") || "Additions"}
                  </Typography>

                  {product.additionPrices.map((size) => (
                    <Accordion
                      key={size._id}
                      expanded={expanded === size._id}
                      onChange={handleAccordionChange(size._id)}
                      sx={{ boxShadow: "none", "&:before": { display: "none" } }}
                    >
                      <AccordionSummary
                        // expandIcon={<CircleMinus />}
                        sx={{ flexDirection: "row-reverse", gap: 1 }}
                      >
                        <FormControl component="fieldset">
                          <FormControlLabel
                            value={size._id}
                            control={
                              <Radio
                                checked={selectedSize?._id === size._id}
                                onChange={() => handleSizeSelect(size)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            }
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography fontWeight="medium">
                                  {getSizeDisplayName(size)}
                                </Typography>
                                {size.price > 0 && (
                                  <Typography variant="caption" color="primary">
                                    (+${size.price.toFixed(2)})
                                  </Typography>
                                )}
                              </Box>
                            }
                            sx={{ marginRight: 0 }}
                          />
                        </FormControl>
                      </AccordionSummary>

                      <AccordionDetails>
                        {size.children && size.children.length > 0 && (
                          <FormControl component="fieldset">
                            <RadioGroup
                              value={selectedSugar?._id || ""}
                              onChange={(e) => {
                                const sugar = size.children.find(c => c._id === e.target.value);
                                if (sugar) handleSugarChange(sugar);
                              }}
                            >
                              <Stack spacing={1}>
                                {size.children.map((sugar) => (
                                  <FormControlLabel
                                    key={sugar._id}
                                    value={sugar._id}
                                    control={<Radio />}
                                    label={
                                      <Box display="flex" justifyContent="space-between" width="100%">
                                        <span>{getSugarDisplayName(sugar)}</span>
                                        {sugar.price > 0 && <span>+${sugar.price.toFixed(2)}</span>}
                                      </Box>
                                    }
                                  />
                                ))}
                              </Stack>
                            </RadioGroup>
                          </FormControl>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
          </Grid>
 
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight="bold">
                {language === "kh" ? product.parentProductId?.nameKh : product.parentProductId?.nameEn}
              </Typography>

              {product.productDes && (
                <Typography variant="body2" color="text.secondary">
                  {product.productDes}
                </Typography>
              )}

              <Typography variant="body2">
                <strong>{t(`category`)}</strong>{" "}
                {language === "kh" ? product.parentProductId?.categoryId?.nameKh : product.parentProductId?.categoryId?.nameEn}
              </Typography>

              <Typography variant="body2">
                <strong>{t(`unit`)}</strong>{" "}
                {language === "kh" ? product.unitId?.nameKh : product.unitId?.nameEn}
              </Typography>

              <Chip label={product.saleType || "Standard"} size="small" color="primary" variant="outlined" sx={{ width: "fit-content" }} />

              <Divider />

           

              <Divider />

        
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t("base_price")}: ${basePrice.toFixed(2)}
                  </Typography>
                  {additionTotal > 0 && (
                    <Typography variant="body2" color="primary">
                      + {t("additions")}: ${additionTotal.toFixed(2)}
                    </Typography>
                  )}
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {t("unit_price")}: ${finalUnitPrice.toFixed(2)}
                  </Typography>
                </Box>

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
                      "& input": { textAlign: "center", padding: "6px 0" },
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
                {language === "kh" ? "បញ្ចូលទៅក្នុងរទេះ" : "Add to Cart"} — ${finalTotal.toFixed(2)}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;