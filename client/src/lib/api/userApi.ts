import { apiClient } from "./apiClient";
import type { User } from "../types/types";

export interface CreateUserInput {
  email: string;
  name: string;
  role?: "customer" | "admin";
  uid?: string;
  photoUrl?: string;
}

export async function createUser(input: CreateUserInput) {
  const res = await apiClient.post<User>("/users", input);
  return res.data;
}

export async function getUserById(id: string) {
  const res = await apiClient.get<User>(`/users/${id}`);
  return res.data;
}
