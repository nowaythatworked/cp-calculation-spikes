export interface Argument {
  type: string;
  value: any;
  parameter: boolean;
  paramter?: boolean;
  name: string;
}

export interface Argument2 {
  type: string;
  value: number;
  parameter: boolean;
}

export interface Expression2 {
  type: string;
  parameter: boolean;
  name: string;
  operator: string;
  arguments: Argument2[];
}

export interface Expression {
  name: string;
  type: string;
  paramter: boolean;
  operator: string;
  arguments: Argument[];
  expressions: Expression2[];
}

export interface Formula {
  name: string;
  expressions: Expression[];
}
