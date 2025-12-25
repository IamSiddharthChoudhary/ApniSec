import { Resend } from "resend";

type IssuePayload = {
  id: string;
  type: string;
  description: string;
  createdBy: string;
};

export class ResendEmail {
  private r: Resend;

  constructor() {
    this.r = new Resend(process.env.NEXT_PUBLIC_RESEND);
  }

  async sendWelcome(to: string, name: string) {
    await this.r.emails.send({
      from: "ApniSec <onboarding@resend.dev>",
      to,
      subject: "Welcome to ApniSec",
      html: `
        <h2>Welcome ${name} </h2>
        <p>Your account has been created successfully.</p>
        <p>Start reporting and tracking security issues securely.</p>
      `,
    });
  }

  async sendIssueCreated(to: string, issue: IssuePayload) {
    await this.r.emails.send({
      from: "ApniSec <alerts@resend.dev>",
      to,
      subject: `New Security Issue #${issue.id}`,
      html: `
        <h3>New Issue Reported</h3>
        <p><strong>Issue ID:</strong> #${issue.id}</p>
        <p><strong>Type:</strong> ${issue.type}</p>
        <p><strong>Created by:</strong> ${issue.createdBy}</p>
        <p><strong>Description:</strong></p>
        <p>${issue.description}</p>
      `,
    });
  }

  async sendPasswordReset(to: string, name: string, link: string) {
    await this.r.emails.send({
      from: "ApniSec <security@resend.dev>",
      to,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset</h3>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <p>Click the link below to reset your password. This link expires in 1 hour:</p>
        <a href="${link}">${link}</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
  }

  async sendProfileUpdated(to: string, name: string, fields: string[]) {
    await this.r.emails.send({
      from: "ApniSec <no-reply@resend.dev>",
      to,
      subject: "Profile Updated",
      html: `
        <p>Hi ${name}, your profile details were updated successfully.</p>
        <p><strong>Updated fields:</strong> ${fields.join(", ")}</p>
        <p>If this wasn't you, please contact support immediately.</p>
      `,
    });
  }
}
