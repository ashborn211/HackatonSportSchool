// Domain classes
export class SubscriptionType {
  id!: number;
  name!: string;
  hoursPerWeek!: number;
}

export class Course {
  id!: number;
  name!: string;
}

export class User {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  subscriptionId!: number;
}

export class PersonalTrainer {
  id!: number;
  name!: string;
  availableHours!: number;
}
