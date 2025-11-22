import { IUser, UserModel } from "../models/User";
import type { IUserAddress } from "../models/User";

export const userRepository = {
  async createUser(data: Partial<IUser>): Promise<IUser> {
    const doc = new UserModel(data);
    return doc.save();
  },

  async findUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  },

  async findUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  },

  async findUserByUid(uid: string): Promise<IUser | null> {
    return UserModel.findOne({ uid }).exec();
  },

  async addAddressToUser(
    userId: string,
    address: IUserAddress
  ): Promise<IUser | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    // if this address is default, clear other defaults
    if (address.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(address);
    await user.save();
    return user;
  },

  async removeAddressFromUser(
    userId: string,
    index: number
  ): Promise<IUser | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    if (index < 0 || index >= user.addresses.length) {
      return user; // nothing removed, but do not crash
    }

    user.addresses.splice(index, 1);
    await user.save();
    return user;
  },
};
