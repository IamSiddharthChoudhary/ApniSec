import { SbAuthClient } from "./sbAuthClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const remote = new SbAuthClient();

export class Auth {
  async register(name: string, email: string, password: string) {
    const user = await remote.getUser(email);
    if (user?.length) throw new Error("Alerady Registered");

    const encPas = await bcrypt.hash(
      password,
      process.env.NEXT_PUBLIC_SALT || ""
    );
    const status = await remote.addUser(name, email, encPas);
    if (status === -1) throw new Error("Error registering");

    const tk = jwt.sign(
      JSON.stringify(user),
      process.env.NEXT_PUBLIC_JWT_SECRET || ""
    );

    return { user, tk };
  }

  async login(email: string, password: string) {
    const user = await remote.getUser(email);

    if (!user?.length) throw new Error("No such user");

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const tk = jwt.sign(
      JSON.stringify(user),
      process.env.NEXT_PUBLIC_JWT_SECRET || ""
    );

    return { user, tk };
  }

  async getCurUser(token: string) {
    const obj = await jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET || ""
    );
    if (!obj) {
      throw new Error("Invalid token");
    }

    const user = await remote.getUser(JSON.parse(obj.toString()).email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
