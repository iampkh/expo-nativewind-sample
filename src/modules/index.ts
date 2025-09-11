// Module Exports - Using namespace imports to avoid conflicts
import * as TodoModule from './todo';
import * as AuthModule from './auth';
import * as PollModule from './poll';
import * as FinanceModule from './finance';
import * as TaskModule from './task';
import * as SampleModule from './sample';

export {
  TodoModule,
  AuthModule,
  PollModule,
  FinanceModule,
  TaskModule,
  SampleModule,
};

// Export specific non-conflicting items for convenience
export type { CreatePollRequest, VotePollRequest } from './poll';
export type { CreateExpenseRequest, UpdateExpenseRequest } from './finance';
export type { CreateTaskRequest, UpdateTaskRequest } from './task';
export type { CreateSampleRequest, UpdateSampleRequest } from './sample';

// Note: chat, geomap, and analytics exports will be added when fully implemented