import { IUser, UserModel } from "../models/User";

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
};
