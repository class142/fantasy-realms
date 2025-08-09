const elements = document.querySelectorAll(".card-single");

  elements.forEach((el, index) => {
    html2canvas(el).then(canvas => {
      // Create image from canvas
      const imgData = canvas.toDataURL("image/png");

      // Create a download link
      const link = document.createElement("a");
      link.download = `capture-${index + 1}.png`;
      link.href = imgData;
      link.click();
    }).catch(err => {
      console.error("Failed to capture element:", err);
    });
  });