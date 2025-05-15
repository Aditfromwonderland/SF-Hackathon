import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

/**
 * Generates a PDF from HTML content
 * 
 * @param htmlContent - The HTML content to convert to PDF
 * @returns Promise resolving to a Buffer containing the PDF data
 */
export async function generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
  let browser = null;
  
  try {
    // Launch the browser with chrome-aws-lambda configuration
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless, // true
      ignoreHTTPSErrors: true,
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set the page content and wait until network is idle
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    // Ensure browser is closed even if an error occurs
    if (browser !== null) {
      await browser.close();
    }
  }
}
