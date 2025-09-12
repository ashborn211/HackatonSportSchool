// Domain classes
export interface SubscriptionType {
  id: number;
  name: string;
  timesPerWeek: number;
}

export interface Subscription {
  id: number;
  subscriptionTypeId: number
  userId: number;
}

export interface Course {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface PersonalTrainer {
  id: number;
  name: string;
}

export interface SubscriptionCourseJoint {
  subscriptionId: number;
  courseId: number;
}

export interface Course {
  id: number;
  name: string;
}

export interface PersonalTrainerAppointment {
  id: number;
  userId: number;
  trainerId: number;
  appointmentDate: Date;
}