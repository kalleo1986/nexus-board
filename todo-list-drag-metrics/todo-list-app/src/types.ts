export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Comment = {
  id: string;
  text: string;
  createdAt: number;
};

export type Todo = {
  id: string;
  text: string;
  status: Status;
  priority: Priority;
  createdAt: number;
  checklist: ChecklistItem[];
  comments: Comment[];
};