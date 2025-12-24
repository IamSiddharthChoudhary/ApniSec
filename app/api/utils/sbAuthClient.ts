import { SbClient } from "./sbClient";

export class SbAuthClient extends SbClient {
  async addUser(name: string, email: string, password: string) {
    let { data: user, error } = await this.sbInstance
      .from("usersAuth")
      .insert([{ name: name, email: email, password: password }]);

    if (error) return -1;
    return 1;
  }

  async getUser(email: string) {
    let { data: user, error } = await this.sbInstance
      .from("usersAuth")
      .select("*")
      .eq("email", email);

    if (error) return [];

    return user;
  }

  async updatePasswrod(email: string, password: string) {
    await this.sbInstance
      .from("usersAuth")
      .update({ password: password })
      .eq("email", email);
  }
}
