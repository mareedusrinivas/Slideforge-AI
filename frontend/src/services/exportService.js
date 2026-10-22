import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

export const exportService = {
  /**
   * Export presentation document as structured JSON
   */
  exportToJson(presentation) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(presentation, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `${(presentation.title || 'Presentation').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.slideforge.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Parse uploaded presentation JSON file
   */
  async importFromJson(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!parsed.slides || !Array.isArray(parsed.slides)) {
            throw new Error('Invalid SlideForge presentation format: missing slides array.');
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  },

  /**
   * Export presentation to PowerPoint PPTX with real vector text and shapes!
   */
  async exportToPptx(presentation) {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = presentation.title || 'SlideForge Presentation';

    const slides = presentation.slides || [];

    for (const slide of slides) {
      const pptSlide = pptx.addSlide();

      // Background
      if (slide.background?.value) {
        if (slide.background.type === 'image') {
          try {
            pptSlide.background = { path: slide.background.value };
          } catch (e) {
            pptSlide.background = { color: 'FFFFFF' };
          }
        } else {
          // Hex color (strip #)
          const hex = (slide.background.value || '#ffffff').replace('#', '');
          pptSlide.background = { color: hex };
        }
      }

      // Add Elements (convert 1920x1080 canvas coords to PPTX inches: 10" x 5.625")
      const scaleX = 10 / 1920;
      const scaleY = 5.625 / 1080;

      for (const el of slide.elements || []) {
        const x = el.x * scaleX;
        const y = el.y * scaleY;
        const w = el.width * scaleX;
        const h = el.height * scaleY;

        if (el.type === 'text' || el.type === 'heading') {
          const colorHex = (el.style?.color || '#000000').replace('#', '');
          const fontSize = Math.max(10, Math.round((el.style?.fontSize || 24) * 0.45));

          pptSlide.addText(el.content || '', {
            x,
            y,
            w,
            h,
            fontSize,
            fontFace: el.style?.fontFamily || 'Arial',
            color: colorHex,
            bold: (el.style?.fontWeight === 'bold' || el.style?.fontWeight >= 600 || el.type === 'heading'),
            align: el.style?.textAlign || 'left',
            valign: 'top'
          });
        } else if (el.type === 'image' && el.content) {
          try {
            pptSlide.addImage({
              path: el.content,
              x,
              y,
              w,
              h
            });
          } catch (imgErr) {
            console.warn('Could not add image to PPTX:', imgErr.message);
          }
        } else if (el.type === 'shape') {
          const fillHex = (el.style?.backgroundColor || '#4f46e5').replace('#', '');
          let shapeType = pptx.ShapeType.rect;
          if (el.content === 'circle') shapeType = pptx.ShapeType.ellipse;
          if (el.content === 'triangle') shapeType = pptx.ShapeType.triangle;
          if (el.content === 'star') shapeType = pptx.ShapeType.star5;
          if (el.content === 'hexagon') shapeType = pptx.ShapeType.hexagon;
          if (el.content === 'diamond') shapeType = pptx.ShapeType.diamond;
          if (el.content === 'arrow-right') shapeType = pptx.ShapeType.rightArrow;
          if (el.content === 'arrow-left') shapeType = pptx.ShapeType.leftArrow;
          if (el.content === 'line') shapeType = pptx.ShapeType.line;

          pptSlide.addShape(shapeType, {
            x,
            y,
            w,
            h,
            fill: { color: fillHex },
            line: el.style?.borderColor ? { color: el.style.borderColor.replace('#', ''), width: el.style.borderWidth || 1 } : undefined
          });
        } else if (el.type === 'icon') {
          const colorHex = (el.style?.color || '#a855f7').replace('#', '');
          pptSlide.addText(`✦ ${el.content}`, {
            x,
            y,
            w,
            h,
            fontSize: 24,
            color: colorHex,
            align: 'center',
            valign: 'middle'
          });
        }
      }

      // Speaker Notes
      if (slide.notes) {
        pptSlide.addNotes(slide.notes);
      }
    }

    const filename = `${(presentation.title || 'Presentation').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`;
    await pptx.writeFile({ fileName: filename });
  },

  /**
   * Export presentation to high-quality PDF
   */
  async exportToPdf(presentation, captureSlideFunction) {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080]
    });

    const slides = presentation.slides || [];
    for (let i = 0; i < slides.length; i++) {
      if (i > 0) {
        pdf.addPage([1920, 1080], 'landscape');
      }

      if (captureSlideFunction) {
        const dataUrl = await captureSlideFunction(i);
        if (dataUrl) {
          pdf.addImage(dataUrl, 'JPEG', 0, 0, 1920, 1080);
          continue;
        }
      }

      // Fallback direct rendering to PDF
      const slide = slides[i];
      pdf.setFillColor(slide.background?.value || '#ffffff');
      pdf.rect(0, 0, 1920, 1080, 'F');

      for (const el of slide.elements || []) {
        if (el.type === 'heading' || el.type === 'text') {
          pdf.setTextColor(el.style?.color || '#000000');
          pdf.setFontSize(el.style?.fontSize || 28);
          pdf.text(el.content || '', el.x, el.y + 40, { maxWidth: el.width });
        } else if (el.type === 'shape') {
          pdf.setFillColor(el.style?.backgroundColor || '#e2e8f0');
          pdf.roundedRect(el.x, el.y, el.width, el.height, el.style?.borderRadius || 0, el.style?.borderRadius || 0, 'F');
        } else if (el.type === 'icon') {
          pdf.setTextColor(el.style?.color || '#a855f7');
          pdf.setFontSize(22);
          pdf.text(`✦ ${el.content}`, el.x + 10, el.y + 35);
        }
      }
    }

    const filename = `${(presentation.title || 'Presentation').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(filename);
  }
};
