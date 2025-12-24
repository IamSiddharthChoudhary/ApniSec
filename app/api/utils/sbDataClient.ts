import { SbClient } from "./sbClient";

export class SbDataClient extends SbClient {
  async getDataPageWise(start: number, end: number) {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .range(start, end);

    if (error) return [-1];
    return posts;
  }

  async getAllPosts() {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*");
    if (error) return [-1];
    return posts;
  }

  async getuserSpecificPosts(email: string) {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .eq("email", email);
    if (error) return [-1];
    return posts;
  }

  async addPost(email: string, desc: string) {
    const { data, error } = await this.sbInstance
      .from("posts")
      .insert([{ some_column: "someValue", other_column: "otherValue" }]);

    if (error) return -1;
    return 1;
  }

  async updateStatus(email: string, status: string, id: number) {
    const { data, error } = await this.sbInstance
      .from("posts")
      .update({ status: "" })
      .eq("id", id)
      .select();

    if (error) return -1;
    return 1;
  }

  async deletePost(email: string, id: number) {
    const { data, error } = await this.sbInstance
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) return -1;
    return 1;
  }
}
