export type StatusType = 'info' | 'warning' | 'error' | 'success';

export interface StatusAction {
  label: string;
  actionId: string;
}

export interface StatusMessage {
  type: StatusType;
  message: string;
  actions?: StatusAction[];
}