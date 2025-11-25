// src/lib/api/userApi.ts
import { apiClient } from "./apiClient";
import type { User, UserAddress } from "../types/types";

export interface CreateUserInput {
  email: string;
  name: string;
  role?: "customer" | "admin";
  uid?: string;
  photoUrl?: string;
}

export interface UpdateUserProfileInput {
  name?: string;
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

// update profile (name, photo), backend route: PATCH /users/:id
export async function updateUserProfile(
  id: string,
  input: UpdateUserProfileInput
) {
  const res = await apiClient.patch<User>(`/users/${id}`, input);
  return res.data;
}

// add address, backend route: POST /users/:id/addresses
export async function addUserAddress(userId: string, address: UserAddress) {
  const res = await apiClient.post<User>(`/users/${userId}/addresses`, address);
  return res.data;
}

// delete address by index, backend route: DELETE /users/:id/addresses/:index
export async function deleteUserAddress(userId: string, index: number) {
  const res = await apiClient.delete<User>(
    `/users/${userId}/addresses/${index}`
  );
  return res.data;
}

// set default address, backend route: PATCH /users/:id/addresses/default
export async function setDefaultUserAddress(
  userId: string,
  addressIndex: number
) {
  const res = await apiClient.patch<User>(
    `/users/${userId}/addresses/default`,
    { index: addressIndex }
  );
  return res.data;
}

// admin update role, backend route: PATCH /users/:id/role
export async function updateUserRole(
  userId: string,
  role: "customer" | "admin"
) {
  const res = await apiClient.patch<User>(`/users/${userId}/role`, { role });
  return res.data;
}
