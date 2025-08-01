import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      title: "Marine Container Booking",
      subtitle: "Secure your cargo space with transparent pricing",
      
      // Navigation
      home: "Home",
      company: "Company",
      slotSize: "Slot Size",
      howItWorks: "How It Works",
      
      // Stats
      containersThisMonth: "Containers This Month",
      availableSlots: "Available Slots",
      priceRange: "Price Range",
      maxWeightSlot: "Max Weight/Slot",
      
      // Cargo Configuration
      cargoConfiguration: "Cargo Configuration",
      cargoType: "Cargo Type",
      palletizedCargo: "Palletized Cargo",
      palletizedCargoDesc: "One standard slot with fixed dimensions.\nPerfect for palletized goods.",
      nonStandardCargo: "Non-Standard Cargo",
      nonStandardCargoDesc: "Custom cargo size that may require\nmultiple slots based on dimensions.",
      weight: "Weight (kg)",
      weightLimit: "Maximum weight per slot: 1300kg",
      weightExceeds: "Weight exceeds maximum limit of 1300kg per slot",
      customDimensions: "Custom Dimensions (mm)",
      width: "Width",
      height: "Height",
      length: "Length",
      standardSlot: "Standard slot",
      standardDimensions: "Standard Pallet Dimensions",
      oneSlotOnePallet: "1 slot = 1 standard pallet space",
      viewSlotDetails: "View Slot Size Details",
      standardSlotSize: "2600mm × 1200mm × 2500mm",
      
      // Container Selection
      availableContainers: "Available Containers",
      selected: "Selected",
      select: "Select",
      container: "Container",
      departure: "Departure",
      deliveryDeadline: "Cargo Delivery Deadline",
      route: "Route",
      available: "Available",
      dimensionsDontFit: "Dimensions don't fit",
      selectedSlots: "Selected",
      slots: "slot(s)",
      total: "Total",
      selectThisContainer: "Confirm Selection",
      
      // Purchase Modal
      completeBooking: "Complete Your Booking",
      orderSummary: "Order Summary",
      proceedToPayment: "Proceed to Payment",
      back: "Back",
      completePayment: "Complete Payment",
      processingPayment: "Processing Payment...",
      processingDesc: "Please wait while we confirm your booking and process the payment.",
      
      // Customer Information
      customerShippingInfo: "Customer & Shipping Information",
      customerInfo: "Customer Information",
      addressInfo: "Address Information",
      fullName: "Full Name",
      emailField: "Email",
      phoneField: "Phone",
      companyField: "Company (Optional)",
      addressField: "Address",
      cityField: "City",
      postalCodeField: "Postal Code",
      countryField: "Country",
      shippingDestination: "Shipping Destination",
      
      // Payment
      paymentInfo: "Payment Information",
      totalAmount: "Total Amount",
      cardNumber: "Card Number",
      cardholderName: "Cardholder Name",
      expiryDate: "Expiry Date",
      cvv: "CVV",
      
      // Invoice
      invoiceShippingDoc: "Invoice & Shipping Document",
      print: "Print",
      download: "Download",
      showBarcode: "Show",
      hideBarcode: "Hide",
      barcode: "Barcode",
      marineContainerServices: "MARINE CONTAINER SERVICES",
      professionalShipping: "Professional Shipping Solutions",
      invoice: "Invoice",
      date: "Date",
      billTo: "Bill To:",
      shippingDetails: "Shipping Details:",
      bookedSlots: "Booked Slots:",
      slotId: "Slot ID",
      dimensions: "Dimensions (mm)",
      maxWeight: "Max Weight",
      price: "Price",
      totalAmountLabel: "Total Amount:",
      shippingBarcode: "Shipping Barcode",
      presentBarcode: "Present this barcode at the port for cargo handling",
      thankYou: "Thank you for choosing our marine container services!",
      support: "For support, contact us at support@marinecontainer.com or +1 (555) 123-4567",
      
      // Company Tab
      aboutCompany: "About Marine Container Services",
      companyDesc: "We are a leading provider of marine container booking services, offering transparent pricing and reliable shipping solutions for businesses worldwide.",
      ourMission: "Our Mission",
      missionDesc: "To simplify global shipping by providing transparent, efficient, and cost-effective container booking services.",
      ourExperience: "Our Experience",
      experienceDesc: "With over 20 years in the maritime industry, we handle thousands of containers monthly across major shipping routes.",
      
      // Size Tab
      standardSlotSpecs: "Standard Slot Specifications",
      dimensionsLabel: "Dimensions",
      containerLayout: "Container Layout",
      slotsPerContainer: "Slots per Container",
      layout: "Layout",
      containersPerMonth: "Containers per Month",
      weightCapacity: "Weight Capacity",
      maxWeightPerSlot: "Max Weight per Slot",
      containerLoadCapacity: "Container Load Capacity",
      containerSize: "Container size LxWxH: 12045 × 2330 × 2698 mm",
      visualization: "3D Visualization",

      // How It Works (old keys, kept for compatibility if needed)
      selectCargoType: "1. Select Cargo Type",
      selectCargoTypeDesc: "Choose between palletized cargo (standard slot) or non-standard cargo with custom dimensions.",
      chooseContainer: "2. Choose Container & Slots",
      chooseContainerDesc: "Select your preferred container and view available slots with transparent pricing.",
      completeBookingTitle: "3. Complete Booking",
      completeBookingDesc: "Provide shipping details, complete payment, and receive your booking confirmation with barcode.",
      
      // New How It Works keys
      howItWorksIntro: "On this website you buy a place in a consolidated container following from Guangzhou to Moscow. ",
      linkSlotSize: "slot size",
      serviceIncludes: "The service includes: container transportation on the Guangzhou-Moscow route, customs clearance services, insurance.",
      serviceDoesNotInclude: "The service does not include: delivery from the supplier's warehouse to the departure warehouse in Guangzhou, payment of customs duties, storage at the temporary storage warehouse in Moscow, removal of cargo to the final address. ",
      linkOfferAgreement: "More details (the offer agreement)",
      supplierAgreement: "Make sure that the terms of the agreement with the supplier indicate the terms of delivery FCA/FOB Guangzhou, confirm with the supplier the delivery to the departure warehouse within Guangzhou.",
      selectContainer: "Select a container in accordance with the departure date and the latest date for providing the cargo and documents",
      ensureCargoArrival: "Make sure that the cargo has time to arrive at the departure warehouse before the specified date",
      selectSlots1: "Select the required number of slots. 1 slot is equal to 1 pallet (",
      linkMoreDetails: "more details",
      selectSlots2: "). If the cargo is not palletized, select the non-standard cargo tab, enter the parameters, then the system will determine the required number of slots.",
      paySlots: "Pay for the selected slots",
      afterPayment: "After payment, you will receive a payment receipt, a booking notification and instructions for sending the cargo, as well as the contact of the service manager",
      followInstructions: "Follow the instructions and, if necessary, contact the service manager",
      afterArrival: "After the cargo arrives in Moscow and passes customs clearance, arrange for the removal of the cargo from our warehouse.",
      
      // Month Selection
      selectMonth: "Select Month",
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
      
      // Container dimensions
      containerDimensions: "Container dimensions: 6060mm × 4450mm × 2620mm",
      cargoFitsContainer: "Cargo fits within container",
      cargoDoesntFit: "Cargo doesn't fit within container",
      
      // Language selector
      languageSelector: "Language",
      englishLang: "English",
      russianLang: "Русский",
      chineseLang: "中文",

      // Added translations
      containerRoute: "Guangzhou - Moscow",
      noContainersAvailable: "No containers available"
    }
  },
  ru: {
    translation: {
      // Header
      title: "Бронирование морских контейнеров",
      subtitle: "Обеспечьте место для груза с прозрачными ценами",
      
      // Navigation
      home: "Главная",
      company: "Компания",
      slotSize: "Размер слота",
      howItWorks: "Как это работает",
      
      // Stats
      containersThisMonth: "Контейнеры в этом месяце",
      availableSlots: "Доступные слоты",
      priceRange: "Диапазон цен",
      maxWeightSlot: "Макс. вес/слот",
      
      // Cargo Configuration
      cargoConfiguration: "Конфигурация груза",
      cargoType: "Тип груза",
      palletizedCargo: "Паллетизированный груз",
      palletizedCargoDesc: "Один стандартный слот с фиксированными размерами.\nИдеально для паллетизированных товаров.",
      nonStandardCargo: "Нестандартный груз",
      nonStandardCargoDesc: "Груз нестандартного размера, который может потребовать\nнесколько слотов в зависимости от размеров.",
      weight: "Вес (кг)",
      weightLimit: "Максимальный вес на слот: 1300кг",
      weightExceeds: "Вес превышает максимальный лимит в 1300кг на слот",
      customDimensions: "Нестандартные размеры (мм)",
      width: "Ширина",
      height: "Высота",
      length: "Длина",
      standardSlot: "Стандартный слот",
      standardDimensions: "Стандартные размеры паллета",
      oneSlotOnePallet: "1 слот = 1 стандартное паллетное место",
      viewSlotDetails: "Посмотреть детали размера слота",
      standardSlotSize: "2600мм × 1200мм × 2500мм",
      
      // Container Selection
      availableContainers: "Доступные контейнеры",
      selected: "Выбран",
      select: "Выбрать",
      container: "Контейнер",
      departure: "Отправление",
      deliveryDeadline: "Срок доставки груза",
      route: "Маршрут",
      available: "Доступно",
      dimensionsDontFit: "Размеры не подходят",
      selectedSlots: "Выбрано",
      slots: "слот(ов)",
      total: "Итого",
      selectThisContainer: "Подтвердить выбор",
      
      // Purchase Modal
      completeBooking: "Завершите бронирование",
      orderSummary: "Сводка заказа",
      proceedToPayment: "Перейти к оплате",
      back: "Назад",
      completePayment: "Завершить оплату",
      processingPayment: "Обработка платежа...",
      processingDesc: "Пожалуйста, подождите, пока мы подтверждаем ваше бронирование и обрабатываем платеж.",
      
      // Customer Information
      customerShippingInfo: "Информация о клиенте и доставке",
      customerInfo: "Информация о клиенте",
      addressInfo: "Адресная информация",
      fullName: "Полное имя",
      emailField: "Электронная почта",
      phoneField: "Телефон",
      companyField: "Компания (необязательно)",
      addressField: "Адрес",
      cityField: "Город",
      postalCodeField: "Почтовый индекс",
      countryField: "Страна",
      shippingDestination: "Пункт назначения",
      
      // Payment
      paymentInfo: "Платежная информация",
      totalAmount: "Общая сумма",
      cardNumber: "Номер карты",
      cardholderName: "Имя держателя карты",
      expiryDate: "Срок действия",
      cvv: "CVV",
      
      // Invoice
      invoiceShippingDoc: "Счет и документ доставки",
      print: "Печать",
      download: "Скачать",
      showBarcode: "Показать",
      hideBarcode: "Скрыть",
      barcode: "Штрихкод",
      marineContainerServices: "УСЛУГИ МОРСКИХ КОНТЕЙНЕРОВ",
      professionalShipping: "Профессиональные решения доставки",
      invoice: "Счет",
      date: "Дата",
      billTo: "Выставить счет:",
      shippingDetails: "Детали доставки:",
      bookedSlots: "Забронированные слоты:",
      slotId: "ID слота",
      dimensions: "Размеры (мм)",
      maxWeight: "Макс. вес",
      price: "Цена",
      totalAmountLabel: "Общая сумма:",
      shippingBarcode: "Штрихкод доставки",
      presentBarcode: "Предъявите этот штрихкод в порту для обработки груза",
      thankYou: "Спасибо за выбор наших услуг морских контейнеров!",
      support: "По вопросам поддержки свяжитесь с нами по адресу support@marinecontainer.com или +1 (555) 123-4567",
      
      // Company Tab
      aboutCompany: "О компании Marine Container Services",
      companyDesc: "Мы являемся ведущим поставщиком услуг бронирования морских контейнеров, предлагая прозрачные цены и надежные решения доставки для предприятий по всему миру.",
      ourMission: "Наша миссия",
      missionDesc: "Упростить глобальную доставку, предоставляя прозрачные, эффективные и экономически выгодные услуги бронирования контейнеров.",
      ourExperience: "Наш опыт",
      experienceDesc: "Имея более 20 лет опыта в морской индустрии, мы обрабатываем тысячи контейнеров ежемесячно на основных судоходных маршрутах.",
      
      // Size Tab
      standardSlotSpecs: "Стандартные спецификации слотов",
      dimensionsLabel: "Размеры",
      containerLayout: "Расположение контейнера",
      slotsPerContainer: "Слотов на контейнер",
      layout: "Расположение",
      containersPerMonth: "Контейнеров в месяц",
      weightCapacity: "Грузоподъемность",
      maxWeightPerSlot: "Макс. вес на слот",
      containerLoadCapacity: "Грузоподъемность контейнера",
      containerSize: "Размер контейнера ДxШxВ: 12045 × 2330 × 2698 мм",
      visualization: "3D Визуализация",

      // How It Works (old keys, kept for compatibility if needed)
      selectCargoType: "1. Выберите тип груза",
      selectCargoTypeDesc: "Выберите между паллетизированным грузом (стандартный слот) или нестандартным грузом с пользовательскими размерами.",
      chooseContainer: "2. Выберите контейнер и слоты",
      chooseContainerDesc: "Выберите предпочитаемый контейнер и просмотрите доступные слоты с прозрачными ценами.",
      completeBookingTitle: "3. Завершите бронирование",
      completeBookingDesc: "Предоставьте детали доставки, завершите оплату и получите подтверждение бронирования со штрихкодом.",
      
      // New How It Works keys
      howItWorksIntro: "На этом сайте вы покупаете место в консолидированном контейнере, следующем из Гуанчжоу в Москву. ",
      linkSlotSize: "размер слота",
      serviceIncludes: "Услуга включает: контейнерную перевозку по маршруту Гуанчжоу-Москва, услуги таможенного оформления, страхование.",
      serviceDoesNotInclude: "Услуга не включает: доставку от склада поставщика до склада отправления в Гуанчжоу, оплату таможенных пошлин, хранение на складе временного хранения в Москве, вывоз груза на конечный адрес. ",
      linkOfferAgreement: "Подробнее (договор оферты)",
      supplierAgreement: "Убедитесь, что в условиях договора с поставщиком указаны условия доставки FCA/FOB Гуанчжоу, подтвердите с поставщиком доставку на склад отправления в пределах Гуанчжоу.",
      selectContainer: "Выберите контейнер в соответствии с датой отправления и крайней датой предоставления груза и документов",
      ensureCargoArrival: "Убедитесь, что груз успеет прибыть на склад отправления до указанной даты",
      selectSlots1: "Выберите необходимое количество слотов. 1 слот равен 1 паллете (",
      linkMoreDetails: "подробнее",
      selectSlots2: "). Если груз не паллетизирован, выберите вкладку нестандартный груз, введите параметры, тогда система определит необходимое количество слотов.",
      paySlots: "Оплатите выбранные слоты",
      afterPayment: "После оплаты вы получите квитанцию об оплате, уведомление о бронировании и инструкции по отправке груза, а также контакт менеджера сервиса",
      followInstructions: "Следуйте инструкциям и, при необходимости, свяжитесь с менеджером сервиса",
      afterArrival: "После прибытия груза в Москву и прохождения таможенного оформления организуйте вывоз груза с нашего склада.",
      
      // Month Selection
      selectMonth: "Выберите месяц",
      january: "Январь",
      february: "Февраль",
      march: "Март",
      april: "Апрель",
      may: "Май",
      june: "Июнь",
      july: "Июль",
      august: "Август",
      september: "Сентябрь",
      october: "Октябрь",
      november: "Ноябрь",
      december: "Декабрь",
      
      // Container dimensions
      containerDimensions: "Размеры контейнера: 6060мм × 4450мм × 2620мм",
      cargoFitsContainer: "Груз помещается в контейнер",
      cargoDoesntFit: "Груз не помещается в контейнер",
      
      // Language selector
      languageSelector: "Язык",
      englishLang: "English",
      russianLang: "Русский",
      chineseLang: "中文",

      // Added translations
      containerRoute: "Гуанчжоу - Москва",
      noContainersAvailable: "Нет доступных контейнеров"
    }
  },
  zh: {
    translation: {
      // Header
      title: "海运集装箱预订",
      subtitle: "透明定价，确保您的货物空间",
      
      // Navigation
      home: "首页",
      company: "公司",
      slotSize: "槽位尺寸",
      howItWorks: "工作原理",
      
      // Stats
      containersThisMonth: "本月集装箱",
      availableSlots: "可用槽位",
      priceRange: "价格范围",
      maxWeightSlot: "最大重量/槽位",
      
      // Cargo Configuration
      cargoConfiguration: "货物配置",
      cargoType: "货物类型",
      palletizedCargo: "托盘化货物",
      palletizedCargoDesc: "一个具有固定尺寸的标准槽位。\n完美适用于托盘化货物。",
      nonStandardCargo: "非标准货物",
      nonStandardCargoDesc: "自定义货物尺寸，可能需要\n根据尺寸使用多个槽位。",
      weight: "重量 (公斤)",
      weightLimit: "每个槽位的最大重量：1300公斤",
      weightExceeds: "重量超过每个槽位1300公斤的最大限制",
      customDimensions: "自定义尺寸 (毫米)",
      width: "宽度",
      height: "高度",
      length: "长度",
      standardSlot: "标准槽位",
      standardDimensions: "标准托盘尺寸",
      oneSlotOnePallet: "1个槽位 = 1个标准托盘空间",
      viewSlotDetails: "查看槽位尺寸详情",
      standardSlotSize: "2600毫米 × 1200毫米 × 2500毫米",
      
      // Container Selection
      availableContainers: "可用集装箱",
      selected: "已选择",
      select: "选择",
      container: "集装箱",
      departure: "出发",
      deliveryDeadline: "货物交付截止日期",
      route: "路线",
      available: "可用",
      dimensionsDontFit: "尺寸不合适",
      selectedSlots: "已选择",
      slots: "个槽位",
      total: "总计",
      selectThisContainer: "确认选择",
      
      // Purchase Modal
      completeBooking: "完成预订",
      orderSummary: "订单摘要",
      proceedToPayment: "继续付款",
      back: "返回",
      completePayment: "完成付款",
      processingPayment: "处理付款中...",
      processingDesc: "请等待我们确认您的预订并处理付款。",
      
      // Customer Information
      customerShippingInfo: "客户和运输信息",
      customerInfo: "客户信息",
      addressInfo: "地址信息",
      fullName: "全名",
      emailField: "电子邮件",
      phoneField: "电话",
      companyField: "公司（可选）",
      addressField: "地址",
      cityField: "城市",
      postalCodeField: "邮政编码",
      countryField: "国家",
      shippingDestination: "运输目的地",
      
      // Payment
      paymentInfo: "付款信息",
      totalAmount: "总金额",
      cardNumber: "卡号",
      cardholderName: "持卡人姓名",
      expiryDate: "到期日期",
      cvv: "CVV",
      
      // Invoice
      invoiceShippingDoc: "发票和运输单据",
      print: "打印",
      download: "下载",
      showBarcode: "显示",
      hideBarcode: "隐藏",
      barcode: "条形码",
      marineContainerServices: "海运集装箱服务",
      professionalShipping: "专业运输解决方案",
      invoice: "发票",
      date: "日期",
      billTo: "账单收件人：",
      shippingDetails: "运输详情：",
      bookedSlots: "已预订槽位：",
      slotId: "槽位ID",
      dimensions: "尺寸 (毫米)",
      maxWeight: "最大重量",
      price: "价格",
      totalAmountLabel: "总金额：",
      shippingBarcode: "运输条形码",
      presentBarcode: "在港口出示此条形码以处理货物",
      thankYou: "感谢您选择我们的海运集装箱服务！",
      support: "如需支持，请联系我们：support@marinecontainer.com 或 +1 (555) 123-4567",
      
      // Company Tab
      aboutCompany: "关于海运集装箱服务",
      companyDesc: "我们是海运集装箱预订服务的领先提供商，为全球企业提供透明定价和可靠的运输解决方案。",
      ourMission: "我们的使命",
      missionDesc: "通过提供透明、高效和经济实惠的集装箱预订服务来简化全球运输。",
      ourExperience: "我们的经验",
      experienceDesc: "在海运行业拥有超过20年的经验，我们每月在主要运输路线上处理数千个集装箱。",
      
      // Size Tab
      standardSlotSpecs: "标准槽位规格",
      dimensionsLabel: "尺寸",
      containerLayout: "集装箱布局",
      slotsPerContainer: "每个集装箱的槽位",
      layout: "布局",
      containersPerMonth: "每月集装箱",
      weightCapacity: "重量容量",
      maxWeightPerSlot: "每个槽位的最大重量",
      containerLoadCapacity: "集装箱负载能力",
      containerSize: "集装箱尺寸长x宽x高：12045 × 2330 × 2698 毫米",
      visualization: "3D 可视化",
      
      // How It Works (old keys, kept for compatibility if needed)
      selectCargoType: "1. 选择货物类型",
      selectCargoTypeDesc: "在托盘化货物（标准槽位）或具有自定义尺寸的非标准货物之间选择。",
      chooseContainer: "2. 选择集装箱和槽位",
      chooseContainerDesc: "选择您偏好的集装箱并查看具有透明定价的可用槽位。",
      completeBookingTitle: "3. 完成预订",
      completeBookingDesc: "提供运输详情，完成付款，并获得带有条形码的预订确认。",
      
      // New How It Works keys
      howItWorksIntro: "在本网站上，您购买从广州到莫斯科的拼箱集装箱中的位置。 ",
      linkSlotSize: "槽位尺寸",
      serviceIncludes: "服务包括：广州-莫斯科路线的集装箱运输、海关清关服务、保险。",
      serviceDoesNotInclude: "服务不包括：从供应商仓库到广州出发仓库的交付、海关关税支付、在莫斯科临时存储仓库的存储、将货物运送到最终地址。 ",
      linkOfferAgreement: "更多详情 (要约协议)",
      supplierAgreement: "确保与供应商的协议条款指明交付条款为FCA/FOB广州，与供应商确认交付到广州内的出发仓库。",
      selectContainer: "根据出发日期和提供货物及文件的最后日期选择集装箱",
      ensureCargoArrival: "确保货物在指定日期前到达出发仓库",
      selectSlots1: "选择所需槽位数量。1个槽位等于1个托盘（",
      linkMoreDetails: "更多详情",
      selectSlots2: "）。如果货物未托盘化，选择非标准货物选项卡，输入参数，然后系统将确定所需槽位数量。",
      paySlots: "支付所选槽位",
      afterPayment: "支付后，您将收到付款收据、预订通知和货物发送说明，以及服务经理的联系方式",
      followInstructions: "遵循说明，如有必要，联系服务经理",
      afterArrival: "货物到达莫斯科并通过海关清关后，安排从我们的仓库取出货物。",
      
      // Month Selection
      selectMonth: "选择月份",
      january: "一月",
      february: "二月",
      march: "三月",
      april: "四月",
      may: "五月",
      june: "六月",
      july: "七月",
      august: "八月",
      september: "九月",
      october: "十月",
      november: "十一月",
      december: "十二月",
      
      // Container dimensions
      containerDimensions: "集装箱尺寸：6060毫米 × 4450毫米 × 2620毫米",
      cargoFitsContainer: "货物适合集装箱",
      cargoDoesntFit: "货物不适合集装箱",
      
      // Language selector
      languageSelector: "语言",
      englishLang: "English",
      russianLang: "Русский",
      chineseLang: "中文",

      // Added translations
      containerRoute: "广州 - 莫斯科",
      noContainersAvailable: "没有可用容器"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;