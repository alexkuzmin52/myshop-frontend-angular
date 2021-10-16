export interface IUserFilterQuery {
  role?: string;
  ageGte?: number;
  ageLte?: number;
  createdAtGte?: string;
  createdAtLte?: string;
  updatedAtGte?: string;
  updatedAtLte?: string;
  status?: string;
  isPhoto?: boolean;
}
