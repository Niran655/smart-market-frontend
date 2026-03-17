import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import Barcode from "react-barcode";
import { useRef } from "react";

export default function SubProductBarcode({ open, onClose, subProductId ,t}) {
  const barcodeRef = useRef();

  const handleDownload = () => {
    const svg = barcodeRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${subProductId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ textAlign: "center" }}>Barcode</DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <div ref={barcodeRef}>
          <Barcode
            value={subProductId || ""}
            width={1.5}
            height={70}
            fontSize={14}
          />
        </div>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleDownload}
        >
          {t(`save`)}
        </Button>
      </DialogContent>
    </Dialog>
  );
}