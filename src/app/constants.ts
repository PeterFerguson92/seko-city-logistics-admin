export const REDIRECT_SECTION_AFTER_LOGIN = 'home';
export const DEFAULT_INPUT_COLOR = '#b2b2b2';
export const ALERT_INPUT_COLOR = 'red';
export const POSTCODE_REGEX =
    /^^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/;
export const CUSTOMER_TYPES = ['PERSONAL', 'BUSINESS', 'CHARITY'];
export const PERSONAL_CUSTOMER_TYPE = 'PERSONAL';
export const CUSTOMER_SENDER_ROLE = 'SENDER';
export const CUSTOMER_RECEIVER_ROLE = 'RECEIVER';
export const CUSTOMER_TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Professor', 'Sir', 'Madam'];
export const COUNTRIES = ['UNITED KINGDOM', 'GHANA'];
export const COUNTRY_CODES = ['+44', '+233'];
export const GH_DESTINATIONS = [
    'TBD',
    'ACCRA',
    'ADENTA',
    'ADENTA EAST',
    'AFLAO',
    'AGOGO',
    'AGONA SWEDRU',
    'AKIM ODA',
    'AKOSOMBO',
    'ASAMANKESE',
    'ASHIAMAN',
    'BAWKU',
    'BEREKUM',
    'BOLGATANGA',
    'CAPE COAST',
    'DAMBAI',
    'DAMOGO',
    'DOME',
    'EFFIAKUMA',
    'EJURA',
    'GOASO',
    'HO',
    'HOHOE',
    'KASOA',
    'KINTAMPO',
    'KOFORIDUA',
    'KONONGO',
    'KUMASI',
    'MADINA',
    'MAMPONG',
    'NALERIGU',
    'NKAWKAW',
    'NSAWAM',
    'NUNGUA',
    'OBUASI',
    'ODUPONKPEHE',
    'PRESTEA',
    'SAVELUGU',
    'SEFWI WIAWSO',
    'SEKONDI',
    'SEKONDI-TAKORADI',
    'SAHUM',
    'SUNYANI',
    'TAFO',
    'TAIFA',
    'TAKORADI',
    'TAMALE',
    'TARKWA',
    'TECHIMAN',
    'TEMA',
    'TESHIE',
    'WA',
    'WENCHI',
    'WINNEBA',
    'YENDI',
    'OTHER',
];
export const ADD_CUSTOMER_MODE = 'ADD_CUSTOMER';
export const EDIT_CUSTOMER_MODE = 'EDIT_CUSTOMER';
export const CREATE_BOOKING_MODE = 'CREATE_BOOKING';
export const EDIT_BOOKING_MODE = 'EDIT_BOOKING';
export const VIEW_BOOKING_MODE = 'VIEW_BOOKING';
export const ADD_BOOKING_ORDER_CUSTOMER_MODE = 'ADD_BOOKING_ORDER_CUSTOMER_MODE';
export const ADD_BOOKING_CUSTOMER_MODE = 'ADD_BOOKING_CUSTOMER_MODE';
export const BOOKING_ITEMS_TYPES_DISPLAY_NAMES = ['SMALL BOX', 'MEDIUM BOX', 'BIG BOX', 'OTHER'];
export const BOOKING_ITEMS = [
    { DISPLAY_NAME: 'SMALL BOX', PRICE: '30' },
    { DISPLAY_NAME: 'MEDIUM BOX', PRICE: '50' },
    { DISPLAY_NAME: 'BIG BOX', PRICE: '70' },
];
export const BOOKING_PICKUP_TIMES = ['TO BE CONFIRMED', 'MORNING', 'AFTERNOON', 'EVENING'];
export const BANK_TRANSFER_PAYMENT_TYPE = 'BANK TRANSFER';
export const CASH_PAYMENT_TYPES = 'CASH';
export const PAYMENT_TYPES = [BANK_TRANSFER_PAYMENT_TYPE, CASH_PAYMENT_TYPES];
export const TO_BE_DEFINED = 'TBD';
export const FULL_PAYMENT_STATUS_ALIAS = 'FULL PAYMENT';
export const PARTIAL_PAYMENT_STATUS_ALIAS = 'PARTIAL PAYMENT';
export const NO_PAYMENT_PAYMENT_STATUS_ALIAS = 'NOT PAID';
export const PAYMENT_STATUSES = [
    TO_BE_DEFINED,
    FULL_PAYMENT_STATUS_ALIAS,
    PARTIAL_PAYMENT_STATUS_ALIAS,
    NO_PAYMENT_PAYMENT_STATUS_ALIAS,
];
export const SHIPMENT_STATUSES = [
    'OPEN',
    'IN PROCESS',
    'COMPLETED',
    'IN TRANSIT',
    'ARRIVED',
    'UN-PACKING',
    'CLOSED',
];
export const BOOKING_STATUSES = [
    'PENDING',
    'CREATED',
    'COLLECTED',
    'PROCESSING',
    'IN TRANSIT',
    'DELIVERED',
    'CLOSED',
];
export const ITEM_STATUSES = ['COLLECTED', 'PROCESSING', 'IN TRANSIT', 'DELIVERED', 'CLOSED'];
export const ALL_PAYMENT_STATUSES = ['ALL'].concat(PAYMENT_STATUSES);
export const ALL_BOOKING_STATUSES = ['ALL', 'OPEN'].concat(BOOKING_STATUSES);
export const DISCOUNT_REASONS = ['REASON 1', 'REASON2'];
export const DISCOUNT_TYPES = ['AMOUNT', 'PERCENTAGE'];
export const PORTS_OF_LOADING = ['London Gateway'];
export const PORTS_OF_DISCHARGE = ['Tema Port'];
export const PLACES_OF_RECEIPT = ['Northampton'];
export const LIMIT = 100;
export const CURSOR = null;
export const ACCOUNT_NAME = 'SEKO LOGISTICS LTD';
export const ACCOUNT_SORT_CODE = '90-34-11';
export const ACCOUNT_NUMBER = '6373746362';
export const TASK_PRIORITY_STATUSES = ['LOW', 'MEDIUM', 'HIGH'];
export const WEB_TASK_PICK_UP_REQUEST = 'WEB Collection Request';
export const WEB_TASK_ORDER_REQUEST = 'WEB Order Request';
export const CUSTOMER_ORDER_ROLE = 'ORDER_CUSTOMER';
export const CREATE_ORDER_MODE = 'CREATE_ORDER';
export const EDIT_ORDER_MODE = 'EDIT_ORDER';
export const ADD_ORDER_CUSTOMER_MODE = 'ADD_ORDER_CUSTOMER_MODE';
export const ORDER_PICKUP_TIMES = ['MORNING', 'AFTERNOON', 'EVENING'];
export const ORDER_ITEMS_TYPES_DISPLAY_NAMES = ['BARRELS', 'LARGE SHIPPING BOXES', 'MEDIUM SHIPPING BOXES'];
export const ORDER_ITEMS = [
    { DISPLAY_NAME: 'BARRELS', PRICE: '40' },
    { DISPLAY_NAME: 'LARGE SHIPPING BOXES', PRICE: '7' },
    { DISPLAY_NAME: 'MEDIUM SHIPPING BOXES', PRICE: '5' },
];
export const ORDER_STATUSES = ['PENDING', 'CREATED', 'DELIVERED'];
