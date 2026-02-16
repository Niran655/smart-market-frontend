import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ProductList = ({
  t,
  language,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchKeyword,
  setSearchKeyword,
  filteredProducts,
  onProductClick,
}) => {
  const getCategoryData = (category, language) => {
    const name = language === "kh" ? category.nameKh : category.nameEn;
    return { name };
  };

  return (
    <>
      <Grid container className="product-list-header">
        <Grid size={{ xs: 6 }}>
          <Typography className="section-title">{t(`product_list`)}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Box className="search-container">
            <TextField
              placeholder={t(`search`)}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              size="small"
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Box className="category-scroll-container">
        {categories.map((category) => {
          const { name } = getCategoryData(category, language);
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "contained" : "outlined"}
              className={`category-button ${
                selectedCategory === category.id ? "category-button--active" : ""
              }`}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <span>{name}</span>
              </Box>
            </Button>
          );
        })}
      </Box>

      <Grid container spacing={1} className="product-grid">
        {filteredProducts?.map((item, idx) => (
          <Grid size={{ xs: 3 }} key={idx}>
            <Card className="product-card" onClick={() => onProductClick(item)}>
              <CardMedia
                component="img"
                height="100"
                image={item.productImg || "/placeholder-food.jpg"}
                alt={item.parentProductId?.nameKh || "Product"}
                className="product-image"
              />
              <CardContent className="product-content">
                <Typography className="product-name">
                  {language === "kh"
                    ? item.parentProductId?.nameKh
                    : item.parentProductId?.nameEn}
                </Typography>
                <Typography className="product-category">
                  {language === "kh"
                    ? item.parentProductId?.categoryId?.nameKh
                    : item.parentProductId?.categoryId?.nameEn}
                </Typography>
                <Box className="product-footer">
                  <Typography className="product-price">
                    {item.salePrice?.toLocaleString()}$
                  </Typography>
                  <Chip
                    label={language === "kh" ? item?.unitId?.nameKh : item?.unitId?.nameEn}
                    size="small"
                    color="primary"
                    className="add-chip"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProductList;