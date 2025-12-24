import { SbAuthClient } from "./sbAuthClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const remote = new SbAuthClient();

export class Auth {
  async register(name: string, email: string, password: string) {
    const user = await remote.getUser(email);
    if (user?.length) throw new Error("Already Registered");

    const encPas = await bcrypt.hash(
      password,
      process.env.NEXT_PUBLIC_SALT || ""
    );
    const status = await remote.addUser(name, email, encPas);
    if (status === -1) throw new Error("Error registering");

    const newUser = await remote.getUser(email);

    if (!newUser) throw new Error("Error");

    const tk = jwt.sign(
      { id: newUser[0].id, email: newUser[0].email, name: newUser[0].name },
      process.env.NEXT_PUBLIC_JWT_SECRET || ""
    );
    return { user: newUser[0], tk };
  }

  async login(email: string, password: string) {
    const user = await remote.getUser(email);
    if (!user?.length) throw new Error("No such user");
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    const tk = jwt.sign(
      { id: user[0].id, email: user[0].email, name: user[0].name },
      process.env.NEXT_PUBLIC_JWT_SECRET || ""
    );
    return { user: user[0], tk };
  }

  async getCurUser(token: string) {
    const obj: any = await jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET || ""
    );
    if (!obj) {
      throw new Error("Invalid token");
    }
    const user = await remote.getUser(obj.email);
    if (!user || !user.length) {
      throw new Error("User not found");
    }
    return user[0];
  }
}
