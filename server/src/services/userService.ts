// src/services/userService.ts
import { IUser } from "../models/User";
import {
  userRepository,
  type ListUsersParams,
} from "../dataAccess/userRepository";
import type { IUserAddress, UserRole } from "../models/User";

export const userService = {
  async createUser(data: Partial<IUser>): Promise<IUser> {
    return userRepository.createUser(data);
  },

  async getUserById(id: string): Promise<IUser | null> {
    return userRepository.findUserById(id);
  },

  async getUserByEmail(email: string): Promise<IUser | null> {
    return userRepository.findUserByEmail(email);
  },

  async getUserByUid(uid: string): Promise<IUser | null> {
    return userRepository.findUserByUid(uid);
  },

  async addUserAddress(
    userId: string,
    address: IUserAddress
  ): Promise<IUser | null> {
    return userRepository.addAddressToUser(userId, address);
  },

  async removeUserAddress(
    userId: string,
    index: number
  ): Promise<IUser | null> {
    return userRepository.removeAddressFromUser(userId, index);
  },

  async setDefaultAddress(
    userId: string,
    index: number
  ): Promise<IUser | null> {
    return userRepository.setDefaultAddress(userId, index);
  },

  async updateUserProfile(
    userId: string,
    data: { name?: string; photoUrl?: string }
  ): Promise<IUser | null> {
    return userRepository.updateUserProfile(userId, data);
  },

  async listUsers(
    params: ListUsersParams
  ): Promise<{ users: IUser[]; total: number }> {
    return userRepository.listUsers(params);
  },

  async updateUserRole(userId: string, role: UserRole): Promise<IUser | null> {
    return userRepository.updateUserRole(userId, role);
  },
};
