import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '@/components/PurchaseModal';

declare global {
  interface Window {
    JsBarcode?: any;
  }
}

export interface PDFOptions {
  language: 'en' | 'ru' | 'zh';
}

const translations = {
  en: {
    title: 'MARINE CONTAINER BOOKING INVOICE',
    invoice: 'Invoice',
    barcode: 'Barcode',
    tracking: 'Tracking',
    customer: 'CUSTOMER INFORMATION:',
    container: 'CONTAINER DETAILS:',
    bookedSlots: 'BOOKED SLOTS:',
    total: 'TOTAL AMOUNT:',
    purchaseDate: 'Purchase Date:',
    thankYou: 'Thank you for choosing our marine container services!',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    address: 'Address',
    city: 'City',
    country: 'Country',
    postalCode: 'Postal Code',
    containerId: 'Container ID',
    departureDate: 'Departure Date',
    destination: 'Destination',
    estimatedArrival: 'Estimated Arrival',
    slot: 'Slot',
    dimensions: 'Dimensions',
    price: 'Price'
  },
  ru: {
    title: 'СЧЕТ НА БРОНИРОВАНИЕ МОРСКОГО КОНТЕЙНЕРА',
    invoice: 'Счет',
    barcode: 'Штрихкод',
    tracking: 'Отслеживание',
    customer: 'ИНФОРМАЦИЯ О КЛИЕНТЕ:',
    container: 'ДЕТАЛИ КОНТЕЙНЕРА:',
    bookedSlots: 'ЗАБРОНИРОВАННЫЕ СЛОТЫ:',
    total: 'ОБЩАЯ СУММА:',
    purchaseDate: 'Дата покупки:',
    thankYou: 'Спасибо за выбор наших услуг морских контейнеров!',
    name: 'Имя',
    email: 'Электронная почта',
    phone: 'Телефон',
    company: 'Компания',
    address: 'Адрес',
    city: 'Город',
    country: 'Страна',
    postalCode: 'Почтовый индекс',
    containerId: 'ID контейнера',
    departureDate: 'Дата отправления',
    destination: 'Пункт назначения',
    estimatedArrival: 'Ожидаемое прибытие',
    slot: 'Слот',
    dimensions: 'Размеры',
    price: 'Цена'
  },
  zh: {
    title: '海运集装箱预订发票',
    invoice: '发票',
    barcode: '条形码',
    tracking: '跟踪',
    customer: '客户信息：',
    container: '集装箱详情：',
    bookedSlots: '已预订槽位：',
    total: '总金额：',
    purchaseDate: '购买日期：',
    thankYou: '感谢您选择我们的海运集装箱服务！',
    name: '姓名',
    email: '电子邮件',
    phone: '电话',
    company: '公司',
    address: '地址',
    city: '城市',
    country: '国家',
    postalCode: '邮政编码',
    containerId: '集装箱ID',
    departureDate: '出发日期',
    destination: '目的地',
    estimatedArrival: '预计到达',
    slot: '槽位',
    dimensions: '尺寸',
    price: '价格'
  }
};

export function generatePDFFromElement(element: HTMLElement, filename: string, options: PDFOptions = { language: 'en' }): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add more pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(filename);
      resolve();
    }).catch(reject);
  });
}

export async function generateInvoicePDF(invoiceData: InvoiceData, options: PDFOptions = { language: 'en' }): Promise<void> {
  const t = translations[options.language];
  
  let fontFamily = 'Arial, sans-serif';
  if (options.language === 'zh') {
    fontFamily = 'Noto Sans SC, sans-serif';
    // Load font if necessary
    if (!document.fonts.check('12px "Noto Sans SC"')) {
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
      await document.fonts.load('12px "Noto Sans SC"');
    }
  } else if (options.language === 'ru') {
    // Arial supports Cyrillic, but if needed, load a font
  }
  
  // Load JsBarcode
  const loadJsBarcode = new Promise<void>((resolve) => {
    if (window.JsBarcode) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js';
    script.onload = () => resolve();
    script.onerror = () => console.error('Failed to load JsBarcode');
    document.head.appendChild(script);
  });
  
  await loadJsBarcode;
  
  // Create a temporary HTML element
  const tempDiv = document.createElement('div');
  tempDiv.style.width = '210mm';
  tempDiv.style.minHeight = '297mm';
  tempDiv.style.padding = '20mm';
  tempDiv.style.background = 'white';
  tempDiv.style.fontFamily = fontFamily;
  tempDiv.style.fontSize = '12pt';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';

  tempDiv.innerHTML = `
    <h1 style="text-align: center; font-size: 18pt; margin-bottom: 15pt;">${t.title}</h1>
    
    <p>${t.invoice} ID: ${invoiceData.id}</p>
    <p>${t.barcode}: ${invoiceData.barcode}</p>
    <p>${t.tracking}: ${invoiceData.shippingDetails.trackingNumber}</p>
    
    <h2 style="font-size: 14pt; margin-top: 15pt; margin-bottom: 8pt;">${t.customer}</h2>
    <p>${t.name}: ${invoiceData.customerInfo.name}</p>
    <p>${t.email}: ${invoiceData.customerInfo.email}</p>
    <p>${t.phone}: ${invoiceData.customerInfo.phone}</p>
    ${invoiceData.customerInfo.company ? `<p>${t.company}: ${invoiceData.customerInfo.company}</p>` : ''}
    <p>${t.address}: ${invoiceData.customerInfo.address}</p>
    <p>${t.city}: ${invoiceData.customerInfo.city}</p>
    <p>${t.country}: ${invoiceData.customerInfo.country}</p>
    ${invoiceData.customerInfo.postalCode ? `<p>${t.postalCode}: ${invoiceData.customerInfo.postalCode}</p>` : ''}
    
    <h2 style="font-size: 14pt; margin-top: 15pt; margin-bottom: 8pt;">${t.container}</h2>
    <p>${t.containerId}: ${invoiceData.containerInfo.id}</p>
    <p>${t.departureDate}: ${invoiceData.containerInfo.departureDate.toLocaleDateString()}</p>
    <p>${t.destination}: ${invoiceData.shippingDetails.destination}</p>
    <p>${t.estimatedArrival}: ${invoiceData.shippingDetails.estimatedArrival.toLocaleDateString()}</p>
    
    <h2 style="font-size: 14pt; margin-top: 15pt; margin-bottom: 8pt;">${t.bookedSlots}</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid black; padding: 5pt; text-align: left;">${t.slot}</th>
          <th style="border-bottom: 1px solid black; padding: 5pt; text-align: left;">${t.dimensions} (mm)</th>
          <th style="border-bottom: 1px solid black; padding: 5pt; text-align: right;">${t.price}</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceData.slots.map(slot => `
          <tr>
            <td style="padding: 5pt;">${t.slot} ${slot.id}</td>
            <td style="padding: 5pt;">${slot.dimensions.width} × ${slot.dimensions.height} × ${slot.dimensions.length}</td>
            <td style="padding: 5pt; text-align: right;">$${slot.price}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <p style="font-size: 14pt; font-weight: bold; margin-top: 15pt;">${t.total} $${invoiceData.totalPrice}</p>
    <p>${t.purchaseDate} ${invoiceData.purchaseDate.toLocaleDateString()}</p>
    
    <div style="margin-top: 15pt;">
      <p style="text-align: center;">${t.thankYou}</p>
    </div>
    
    <!-- Barcode -->
    <div style="margin-top: 15pt; text-align: center;">
      <svg id="barcode" style="width: 100mm; height: 20mm;"></svg>
    </div>
  `;

  document.body.appendChild(tempDiv);

  // Generate barcode
  (window as any).JsBarcode("#barcode", invoiceData.barcode, {
    format: "CODE128",
    lineColor: "#000000",
    width: 2,
    height: 40,
    fontSize: 12,
    displayValue: true,
    margin: 0
  });

  // Wait for fonts and rendering
  await document.fonts.ready;
  await new Promise<void>(resolve => setTimeout(resolve, 100)); // Small delay for rendering

  return new Promise<void>((resolve, reject) => {
    html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const filename = `invoice-${invoiceData.id}-${options.language}.pdf`;
      pdf.save(filename);

      document.body.removeChild(tempDiv);
      resolve();
    }).catch(error => {
      document.body.removeChild(tempDiv);
      reject(error);
    });
  });
}