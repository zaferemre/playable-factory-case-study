import { apiClient } from "./apiClient";
import type { User, Cart } from "../types/types";

export interface SyncFirebaseUserInput {
  uid: string;
  email: string;
  name: string;
  photoUrl?: string;
  sessionId?: string;
}

export interface SyncFirebaseUserResponse {
  user: User;
  cart: Cart | null;
}

export async function syncFirebaseUser(
  input: SyncFirebaseUserInput
): Promise<SyncFirebaseUserResponse> {
  const res = await apiClient.post<SyncFirebaseUserResponse>(
    "/auth/firebase",
    input
  );
  return res.data;
}
