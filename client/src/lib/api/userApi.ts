import { apiClient } from "./apiClient";
import type { User, UserAddress } from "../types/types";

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

// add address
export async function addUserAddress(userId: string, address: UserAddress) {
  const res = await apiClient.post<User>(`/users/${userId}/addresses`, address);
  return res.data;
}

// delete address by index
export async function deleteUserAddress(userId: string, index: number) {
  const res = await apiClient.delete<User>(
    `/users/${userId}/addresses/${index}`
  );
  return res.data;
}
