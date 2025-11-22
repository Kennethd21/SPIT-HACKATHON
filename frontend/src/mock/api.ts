// Mock API functions with async behavior

import {
  Product,
  Warehouse,
  Receipt,
  Delivery,
  Transfer,
  Activity,
  Notification,
  MovementHistory,
  sampleProducts,
  sampleWarehouses,
  sampleReceipts,
  sampleDeliveries,
  sampleTransfers,
  sampleActivities,
  sampleNotifications,
  sampleMovementHistory,
} from './data';

// Simulate API delay
const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (mutable state)
let products = [...sampleProducts];
let warehouses = [...sampleWarehouses];
let receipts = [...sampleReceipts];
let deliveries = [...sampleDeliveries];
let transfers = [...sampleTransfers];
let activities = [...sampleActivities];
let notifications = [...sampleNotifications];
let movementHistory = [...sampleMovementHistory];

// Helper function to add activity
function addActivity(type: string, description: string, icon: string) {
  const newActivity: Activity = {
    id: `a${Date.now()}`,
    type,
    description,
    date: new Date().toISOString(),
    user: 'Admin',
    icon,
  };
  activities.unshift(newActivity);
  return newActivity;
}

// Helper function to add notification
function addNotification(
  type: Notification['type'],
  title: string,
  message: string
) {
  const newNotification: Notification = {
    id: `n${Date.now()}`,
    type,
    title,
    message,
    date: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(newNotification);
  return newNotification;
}

// Helper function to add movement history
function addMovementHistory(
  type: MovementHistory['type'],
  product: string,
  quantity: number,
  fromWarehouse?: string,
  toWarehouse?: string
) {
  const newMovement: MovementHistory = {
    id: `mh${Date.now()}`,
    type,
    product,
    quantity,
    fromWarehouse,
    toWarehouse,
    date: new Date().toISOString(),
    user: 'Admin',
  };
  movementHistory.unshift(newMovement);
  return newMovement;
}

// Products API
export async function fetchProducts(): Promise<Product[]> {
  await delay();
  return [...products];
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  await delay();
  const newProduct = {
    ...product,
    id: `p${Date.now()}`,
  };
  products.push(newProduct);
  
  // Add activity
  addActivity('Product', `Product added: ${newProduct.name}`, 'Package');
  
  return newProduct;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  await delay();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...product };
    
    // Add activity
    addActivity('Product', `Product updated: ${products[index].name}`, 'Package');
    
    return products[index];
  }
  throw new Error('Product not found');
}

// Warehouses API
export async function fetchWarehouses(): Promise<Warehouse[]> {
  await delay();
  return [...warehouses];
}

export async function createWarehouse(warehouse: Omit<Warehouse, 'id'>): Promise<Warehouse> {
  await delay();
  const newWarehouse = {
    ...warehouse,
    id: `wh${Date.now()}`,
  };
  warehouses.push(newWarehouse);
  
  // Add activity
  addActivity('Warehouse', `Warehouse added: ${newWarehouse.name}`, 'Warehouse');
  
  return newWarehouse;
}

export async function updateWarehouse(id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> {
  await delay();
  const index = warehouses.findIndex(w => w.id === id);
  if (index !== -1) {
    warehouses[index] = { ...warehouses[index], ...warehouse };
    
    // Add activity
    addActivity('Warehouse', `Warehouse updated: ${warehouses[index].name}`, 'Warehouse');
    
    return warehouses[index];
  }
  throw new Error('Warehouse not found');
}

// Receipts API
export async function fetchReceipts(): Promise<Receipt[]> {
  await delay();
  return [...receipts];
}

export async function createReceipt(receipt: Omit<Receipt, 'id'>): Promise<Receipt> {
  await delay();
  const newReceipt = {
    ...receipt,
    id: `r${Date.now()}`,
  };
  receipts.push(newReceipt);
  return newReceipt;
}

export async function validateReceipt(id: string): Promise<Receipt> {
  await delay();
  const index = receipts.findIndex(r => r.id === id);
  if (index !== -1) {
    receipts[index] = { ...receipts[index], status: 'completed' };
    
    // Add activity
    addActivity(
      'Receipt',
      `Receipt validated: ${receipts[index].quantity} units of ${receipts[index].product}`,
      'FileText'
    );
    
    // Add notification
    addNotification(
      'receipt_validated',
      'Receipt Validated',
      `${receipts[index].quantity} units of ${receipts[index].product} received from ${receipts[index].supplier}`
    );
    
    // Add movement history
    addMovementHistory(
      'receipt',
      receipts[index].product,
      receipts[index].quantity,
      undefined,
      receipts[index].warehouse
    );
    
    return receipts[index];
  }
  throw new Error('Receipt not found');
}

// Deliveries API
export async function fetchDeliveries(): Promise<Delivery[]> {
  await delay();
  return [...deliveries];
}

export async function createDelivery(delivery: Omit<Delivery, 'id'>): Promise<Delivery> {
  await delay();
  const newDelivery = {
    ...delivery,
    id: `d${Date.now()}`,
  };
  deliveries.push(newDelivery);
  return newDelivery;
}

export async function updateDeliveryStatus(id: string, status: Delivery['status']): Promise<Delivery> {
  await delay();
  const index = deliveries.findIndex(d => d.id === id);
  if (index !== -1) {
    deliveries[index] = { ...deliveries[index], status };
    
    // Add activity for status changes
    const statusMessages = {
      picked: 'picked',
      packed: 'packed',
      delivered: 'delivered',
      pending: 'created',
    };
    
    addActivity(
      'Delivery',
      `Delivery ${statusMessages[status]}: ${deliveries[index].quantity} units of ${deliveries[index].product}`,
      'Truck'
    );
    
    // Add notification on delivery completion
    if (status === 'delivered') {
      addNotification(
        'delivery_validated',
        'Delivery Completed',
        `${deliveries[index].quantity} units of ${deliveries[index].product} delivered successfully`
      );
      
      // Add movement history
      addMovementHistory(
        'delivery',
        deliveries[index].product,
        deliveries[index].quantity,
        deliveries[index].warehouse,
        undefined
      );
    }
    
    return deliveries[index];
  }
  throw new Error('Delivery not found');
}

// Transfers API
export async function fetchTransfers(): Promise<Transfer[]> {
  await delay();
  return [...transfers];
}

export async function createTransfer(transfer: Omit<Transfer, 'id'>): Promise<Transfer> {
  await delay();
  const newTransfer = {
    ...transfer,
    id: `t${Date.now()}`,
  };
  transfers.push(newTransfer);
  return newTransfer;
}

export async function validateTransfer(id: string): Promise<Transfer> {
  await delay();
  const index = transfers.findIndex(t => t.id === id);
  if (index !== -1) {
    transfers[index] = { ...transfers[index], status: 'completed' };
    
    // Add activity
    addActivity(
      'Transfer',
      `Transfer completed: ${transfers[index].quantity} units of ${transfers[index].product} from ${transfers[index].fromWarehouse} to ${transfers[index].toWarehouse}`,
      'ArrowLeftRight'
    );
    
    // Add notification
    addNotification(
      'transfer_completed',
      'Transfer Completed',
      `${transfers[index].quantity} units of ${transfers[index].product} transferred from ${transfers[index].fromWarehouse} to ${transfers[index].toWarehouse}`
    );
    
    // Add movement history
    addMovementHistory(
      'transfer',
      transfers[index].product,
      transfers[index].quantity,
      transfers[index].fromWarehouse,
      transfers[index].toWarehouse
    );
    
    return transfers[index];
  }
  throw new Error('Transfer not found');
}

// Adjustment API
export async function applyStockAdjustment(
  productId: string,
  countedQuantity: number,
  difference: number
): Promise<void> {
  await delay();
  const product = products.find(p => p.id === productId);
  if (product) {
    // Add activity
    addActivity(
      'Adjustment',
      `Stock adjusted for ${product.name}: ${difference > 0 ? '+' : ''}${difference} units`,
      'Settings'
    );
    
    // Add notification
    addNotification(
      'adjustment_made',
      'Stock Adjustment',
      `Stock adjusted for ${product.name}: ${difference > 0 ? '+' : ''}${difference} units`
    );
    
    // Add movement history
    addMovementHistory(
      'adjustment',
      product.name,
      Math.abs(difference),
      difference < 0 ? 'System Adjustment' : undefined,
      difference > 0 ? 'System Adjustment' : undefined
    );
  }
}

// Activities API
export async function fetchActivities(): Promise<Activity[]> {
  await delay();
  return [...activities];
}

// Notifications API
export async function fetchNotifications(): Promise<Notification[]> {
  await delay();
  return [...notifications];
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  await delay();
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index] = { ...notifications[index], read: true };
    return notifications[index];
  }
  throw new Error('Notification not found');
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await delay();
  notifications = notifications.map(n => ({ ...n, read: true }));
}

// Movement History API
export async function fetchMovementHistory(): Promise<MovementHistory[]> {
  await delay();
  return [...movementHistory];
}

// Dashboard API
export async function fetchDashboardStats() {
  await delay();
  
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => 
    Object.values(p.stock).some(qty => qty < 50)
  ).length;
  const pendingReceipts = receipts.filter(r => r.status === 'pending').length;
  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const scheduledTransfers = transfers.filter(t => t.status === 'pending').length;

  return {
    totalProducts,
    lowStockItems,
    pendingReceipts,
    pendingDeliveries,
    scheduledTransfers,
  };
}

// Warehouse deliveries for graph
export async function fetchWarehouseDeliveries() {
  await delay();
  
  const warehouseDeliveries: Record<string, number> = {};
  
  warehouses.forEach(w => {
    warehouseDeliveries[w.name] = deliveries
      .filter(d => d.warehouse === w.name && d.status === 'delivered')
      .reduce((sum, d) => sum + d.quantity, 0);
  });
  
  return warehouseDeliveries;
}