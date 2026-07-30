import { type TeamDto as TeamDtoLegacy } from '@grafana/api-clients/internal/rtkq/legacy';

import { type Role } from './dependencies';

export interface TeamDTO {
  /**
   * Email of the team.
   */
  email?: string;
  /**
   * Name of the team.
   */
  name: string;
}

export type Team = TeamDtoLegacy;

export interface TeamWithRoles extends Team {
  /**
   * RBAC roles assigned to the team.
   */
  roles?: Role[];
}
