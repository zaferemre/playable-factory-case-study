// src/dataAccess/userRepository.ts
import {
  IUser,
  UserModel,
  type UserRole,
  type IUserAddress,
} from "../models/User";

export interface ListUsersParams {
  q?: string;
  page?: number;
  limit?: number;
  role?: UserRole | "all";
  sortBy?: "createdAt" | "totalSpent" | "orderCount" | "lastOrderAt";
  sortDir?: "asc" | "desc";
}

export const userRepository = {
  async createUser(data: Partial<IUser>): Promise<IUser> {
    // avoid duplicate users by email if create is called multiple times
    if (data.email) {
      const existing = await UserModel.findOne({ email: data.email }).exec();
      if (existing) {
        return existing;
      }
    }

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

  async setDefaultAddress(
    userId: string,
    index: number
  ): Promise<IUser | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    if (index < 0 || index >= user.addresses.length) {
      return user;
    }

    user.addresses.forEach((addr, i) => {
      addr.isDefault = i === index;
    });

    await user.save();
    return user;
  },

  async updateUserProfile(
    userId: string,
    data: { name?: string; photoUrl?: string }
  ): Promise<IUser | null> {
    const updates: Record<string, any> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.photoUrl !== undefined) updates.photoUrl = data.photoUrl;

    if (Object.keys(updates).length === 0) {
      return UserModel.findById(userId).exec();
    }

    return UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).exec();
  },

  async listUsers(
    params: ListUsersParams
  ): Promise<{ users: IUser[]; total: number }> {
    const {
      q,
      page = 1,
      limit = 20,
      role = "customer",
      sortBy = "createdAt",
      sortDir = "desc",
    } = params;

    const filter: Record<string, any> = {};

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    if (role !== "all") {
      filter.role = role;
    }

    const sort: Record<string, 1 | -1> = {};
    const direction = sortDir === "asc" ? 1 : -1;

    if (sortBy === "totalSpent") sort.totalSpent = direction;
    else if (sortBy === "orderCount") sort.orderCount = direction;
    else if (sortBy === "lastOrderAt") sort.lastOrderAt = direction;
    else sort.createdAt = direction;

    const query = UserModel.find(filter).sort(sort);

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
