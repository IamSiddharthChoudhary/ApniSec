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
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [-1];
    return posts;
  }

  async getuserSpecificPosts(email: string) {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });
    if (error) return [-1];
    return posts;
  }

  async addPost(email: string, title: string, desc: string, type: string) {
    const { data, error } = await this.sbInstance
      .from("posts")
      .insert([
        {
          email: email,
          title: title,
          description: desc,
          type: type,
          status: "open",
        },
      ])
      .select();
    if (error) return -1;
    return data[0].id;
  }

  async updateStatus(email: string, status: string, id: number) {
    const { data, error } = await this.sbInstance
      .from("posts")
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("email", email)
      .select();
    if (error) return -1;
    return 1;
  }

  async deletePost(email: string, id: number) {
    const { data, error } = await this.sbInstance
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("email", email);
    if (error) return -1;
    return 1;
  }

  async getPostById(id: number) {
    let { data: post, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return -1;
    return post;
  }

  async getPostsByType(type: string) {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });
    if (error) return [-1];
    return posts;
  }
}
