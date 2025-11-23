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
      return user;
    }

    user.addresses.splice(index, 1);
    await user.save();
    return user;
  },

  async listUsers(params: {
    q?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: IUser[]; total: number }> {
    const { q, page = 1, limit = 20 } = params;

    const filter: Record<string, any> = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const query = UserModel.find(filter).sort({ createdAt: -1 });

    const [users, total] = await Promise.all([
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      UserModel.countDocuments(filter).exec(),
    ]);

    return { users, total };
  },

  async updateUserRole(
    userId: string,
    role: "customer" | "admin"
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true }
    ).exec();
  },
};
