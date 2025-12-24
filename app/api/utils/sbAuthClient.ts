import bcrypt from "bcryptjs";
import { SbClient } from "./sbClient";
import { ResendEmail } from "./email";

export class SbAuthClient extends SbClient {
  private emailService: ResendEmail;

  constructor() {
    super();
    this.emailService = new ResendEmail();
  }

  async addUser(name: string, email: string, password: string) {
    let { data: user, error } = await this.sbInstance
      .from("usersAuth")
      .insert([{ name: name, email: email, password: password }]);
    if (error) return -1;

    await this.emailService.sendWelcome(email, name);
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

  async updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.getUser(email);
    if (!user || user.length === 0) {
      throw new Error("User not registered yet");
    }

    const encPass = user[0].password;
    const res = await bcrypt.compare(oldPassword, encPass);
    if (!res) {
      throw new Error("Invalid password");
    }

    const hashedNewPass = await bcrypt.hash(newPassword, 10);

    await this.sbInstance
      .from("usersAuth")
      .update({ password: hashedNewPass })
      .eq("email", email);

    await this.emailService.sendProfileUpdated(email, user[0].name, [
      "password",
    ]);
  }

  async requestPasswordReset(email: string) {
    const user = await this.getUser(email);
    if (!user || user.length === 0) {
      throw new Error("User not registered yet");
    }

    const resetToken = crypto.randomUUID();
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await this.sbInstance
      .from("usersAuth")
      .update({
        reset_token: resetToken,
        reset_expires: new Date(Date.now() + 3600000),
      })
      .eq("email", email);

    await this.emailService.sendPasswordReset(email, user[0].name, resetLink);
  }

  async resetPassword(token: string, newPassword: string) {
    let { data: user, error } = await this.sbInstance
      .from("usersAuth")
      .select("*")
      .eq("reset_token", token)
      .gt("reset_expires", new Date().toISOString());

    if (error || !user || user.length === 0) {
      throw new Error("Invalid or expired token");
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    await this.sbInstance
      .from("usersAuth")
      .update({
        password: hashedPass,
        reset_token: null,
        reset_expires: null,
      })
      .eq("reset_token", token);

    await this.emailService.sendProfileUpdated(user[0].email, user[0].name, [
      "password",
    ]);
  }

  async updateName(email: string, name: string) {
    await this.sbInstance
      .from("usersAuth")
      .update({ name: name, updated_at: new Date().toISOString() })
      .eq("email", email);
  }
}
