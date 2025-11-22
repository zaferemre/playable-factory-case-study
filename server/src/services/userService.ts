import { IUser } from "../models/User";
import { userRepository } from "../dataAccess/userRepository";

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
};
