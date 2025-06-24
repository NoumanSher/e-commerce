export interface OrderStatus {
    _id: string; // Unique identifier for the status
    status: string; // Current status of the order
    statusDesc: string; // Description of the current status
    updatedAt: string; // Timestamp of when the status was last updated
  }