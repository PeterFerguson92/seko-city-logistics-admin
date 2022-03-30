export const REDIRECT_SECTION_AFTER_LOGIN = 'customers';
export const DEFAULT_INPUT_COLOR = '#b2b2b2';
export const ALERT_INPUT_COLOR = 'red';
export const POSTCODE_REGEX = /^^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/;
export const CUSTOMER_TYPES = ['PERSONAL', 'BUSINESS', 'CHARITY'];
export const PERSONAL_CUSTOMER_TYPE = 'PERSONAL';
export const CUSTOMER_SENDER_ROLE = 'SENDER';
export const CUSTOMER_RECEIVER_ROLE = 'RECEIVER';
export const CUSTOMER_TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Professor', 'Sir', 'Madam']
export const COUNTRIES = ['UNITED KINGDOM', 'GHANA'];
export const COUNTRY_CODES = ['+44', '+233'];
export const GH_DESTINATIONS = ['ACCRA', 'KUMASI', 'CAPECOAST', 'SEKONDI-TAKORADI','TEMA', 'KOFORIDUA', 'SUNYANI', 'MADINA', 'AKIM ODA', 'WINNEBA', 'OTHER']
export const ADD_CUSTOMER_MODE = 'ADD_CUSTOMER';
export const EDIT_CUSTOMER_MODE = 'EDIT_CUSTOMER';
export const CREATE_BOOKING_MODE = 'CREATE_BOOKING'
export const EDIT_BOOKING_MODE = 'EDIT_BOOKING'
export const VIEW_BOOKING_MODE = 'VIEW_BOOKING'
export const BOOKING_ITEMS_DISPLAY_NAMES = ['SMALL BOX','MEDIUM BOX','BIG BOX', 'OTHER']
export const BOOKING_ITEMS = [
  { DISPLAY_NAME: 'SMALL BOX', PRICE: '30'  },
  { DISPLAY_NAME: 'MEDIUM BOX', PRICE: '50'  },
  { DISPLAY_NAME: 'BIG BOX', PRICE: '70'  }
]
export const BOOKING_PICKUP_TIMES = ['MORNING', 'AFTERNOON', 'EVENING'];
export const PAYMENT_TYPES = ['CASH', 'DIRECT DEBIT',]
export const PAYMENT_STATUSES = ['PENDING', 'COMPLETED', 'REFUNDED', 'CANCELLED']
export const BOOKING_STATUSES = ['CREATED', 'IN PROCESS', 'SHIPPED', 'DELIVERED']
