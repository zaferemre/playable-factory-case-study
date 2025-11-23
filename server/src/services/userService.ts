import { IUser } from "../models/User";
import { userRepository } from "../dataAccess/userRepository";
import type { IUserAddress } from "../models/User";

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

  async listUsers(params: {
    q?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: IUser[]; total: number }> {
    return userRepository.listUsers(params);
  },

  async updateUserRole(
    userId: string,
    role: "customer" | "admin"
  ): Promise<IUser | null> {
    return userRepository.updateUserRole(userId, role);
  },
};
