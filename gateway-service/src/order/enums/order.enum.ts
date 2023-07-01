export enum OrderStatus {
  PENDING = 'PENDING',
  REFUSED = 'REFUSED',
  IN_PROGRESS = 'IN_PROGRESS',
  TERMINATED = 'TERMINATED', //When the service provider marks the order as done
  DONE = 'DONE', //When the user validates the order is done
  CANCELLED = 'CANCELLED',
}
