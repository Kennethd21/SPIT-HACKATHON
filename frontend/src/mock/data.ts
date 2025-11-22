// Mock data for the application

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  initialStock: number;
  stock: Record<string, number>; // warehouseId -> quantity
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
}

export interface Receipt {
  id: string;
  supplier: string;
  product: string;
  quantity: number;
  warehouse: string;
  date: string;
  status: 'pending' | 'completed';
}

export interface Delivery {
  id: string;
  product: string;
  quantity: number;
  warehouse: string;
  date: string;
  status: 'pending' | 'picked' | 'packed' | 'delivered';
}

export interface Transfer {
  id: string;
  product: string;
  fromWarehouse: string;
  toWarehouse: string;
  quantity: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
  user: string;
  icon?: string;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'receipt_validated' | 'delivery_validated' | 'transfer_completed' | 'adjustment_made';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface MovementHistory {
  id: string;
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  product: string;
  quantity: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  date: string;
  user: string;
}

// Sample warehouses
export const sampleWarehouses: Warehouse[] = [
  { id: 'wh1', name: 'Main Warehouse', code: 'MW-01', address: '123 Main St, New York, NY 10001' },
  { id: 'wh2', name: 'Distribution Center', code: 'DC-01', address: '456 Commerce Ave, Los Angeles, CA 90001' },
  { id: 'wh3', name: 'Regional Hub', code: 'RH-01', address: '789 Industrial Blvd, Chicago, IL 60601' },
];

// Sample products
export const sampleProducts: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    category: 'Electronics',
    initialStock: 275,
    stock: { wh1: 150, wh2: 80, wh3: 45 },
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    sku: 'MK-002',
    category: 'Electronics',
    initialStock: 225,
    stock: { wh1: 75, wh2: 120, wh3: 30 },
  },
  {
    id: 'p3',
    name: 'USB-C Cable',
    sku: 'UC-003',
    category: 'Accessories',
    initialStock: 730,
    stock: { wh1: 300, wh2: 250, wh3: 180 },
  },
  {
    id: 'p4',
    name: 'Laptop Stand',
    sku: 'LS-004',
    category: 'Accessories',
    initialStock: 130,
    stock: { wh1: 45, wh2: 60, wh3: 25 },
  },
  {
    id: 'p5',
    name: 'Webcam HD',
    sku: 'WC-005',
    category: 'Electronics',
    initialStock: 43,
    stock: { wh1: 20, wh2: 15, wh3: 8 },
  },
  {
    id: 'p6',
    name: 'Monitor 27"',
    sku: 'MN-006',
    category: 'Electronics',
    initialStock: 95,
    stock: { wh1: 35, wh2: 42, wh3: 18 },
  },
];

// Sample receipts
export const sampleReceipts: Receipt[] = [
  {
    id: 'r1',
    supplier: 'Tech Supplies Inc',
    product: 'Wireless Mouse',
    quantity: 100,
    warehouse: 'Main Warehouse',
    date: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: 'r2',
    supplier: 'Global Electronics',
    product: 'Mechanical Keyboard',
    quantity: 50,
    warehouse: 'Distribution Center',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
  },
];

// Sample deliveries
export const sampleDeliveries: Delivery[] = [
  {
    id: 'd1',
    product: 'USB-C Cable',
    quantity: 25,
    warehouse: 'Main Warehouse',
    date: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: 'd2',
    product: 'Laptop Stand',
    quantity: 10,
    warehouse: 'Distribution Center',
    date: new Date(Date.now() - 3600000).toISOString(),
    status: 'picked',
  },
];

// Sample transfers
export const sampleTransfers: Transfer[] = [
  {
    id: 't1',
    product: 'Wireless Mouse',
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Distribution Center',
    quantity: 30,
    date: new Date().toISOString(),
    status: 'pending',
  },
];

// Sample activities
export const sampleActivities: Activity[] = [
  {
    id: 'a1',
    type: 'Receipt',
    description: 'Received 100 units of Wireless Mouse from Tech Supplies Inc',
    date: new Date(Date.now() - 1800000).toISOString(),
    user: 'Admin',
    icon: 'FileText',
  },
  {
    id: 'a2',
    type: 'Delivery',
    description: 'Delivered 25 units of USB-C Cable',
    date: new Date(Date.now() - 3600000).toISOString(),
    user: 'Admin',
    icon: 'Truck',
  },
  {
    id: 'a3',
    type: 'Transfer',
    description: 'Transferred 30 units of Wireless Mouse from Main Warehouse to Distribution Center',
    date: new Date(Date.now() - 7200000).toISOString(),
    user: 'Admin',
    icon: 'ArrowLeftRight',
  },
  {
    id: 'a4',
    type: 'Adjustment',
    description: 'Stock adjusted for Webcam HD: -5 units',
    date: new Date(Date.now() - 10800000).toISOString(),
    user: 'Admin',
    icon: 'Settings',
  },
];

// Sample notifications
export const sampleNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Webcam HD is running low on stock (43 units remaining)',
    date: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    type: 'receipt_validated',
    title: 'Receipt Validated',
    message: '50 units of Mechanical Keyboard received from Global Electronics',
    date: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    type: 'delivery_validated',
    title: 'Delivery Completed',
    message: '10 units of Laptop Stand delivered successfully',
    date: new Date(Date.now() - 10800000).toISOString(),
    read: true,
  },
];

// Sample movement history
export const sampleMovementHistory: MovementHistory[] = [
  {
    id: 'mh1',
    type: 'receipt',
    product: 'Wireless Mouse',
    quantity: 100,
    toWarehouse: 'Main Warehouse',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    user: 'Admin',
  },
  {
    id: 'mh2',
    type: 'delivery',
    product: 'USB-C Cable',
    quantity: 25,
    fromWarehouse: 'Main Warehouse',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    user: 'Admin',
  },
  {
    id: 'mh3',
    type: 'delivery',
    product: 'Wireless Mouse',
    quantity: 15,
    fromWarehouse: 'Distribution Center',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    user: 'Admin',
  },
  {
    id: 'mh4',
    type: 'delivery',
    product: 'Mechanical Keyboard',
    quantity: 8,
    fromWarehouse: 'Main Warehouse',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    user: 'Admin',
  },
  {
    id: 'mh5',
    type: 'transfer',
    product: 'Monitor 27"',
    quantity: 10,
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Regional Hub',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    user: 'Admin',
  },
];