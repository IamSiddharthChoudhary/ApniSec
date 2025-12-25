import { SbClient } from "./sbClient";

export class SbDataClient extends SbClient {
  async getDataPageWise(start: number, end: number) {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .range(start, end);
    if (error) {
      console.error("getDataPageWise error:", error);
      return [-1];
    }
    return posts;
  }

  async getAllPosts() {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("getAllPosts error:", error);
      return [-1];
    }
    return posts;
  }

  async getuserSpecificPosts(email: string) {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("getuserSpecificPosts error:", error);
      return [-1];
    }
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
    if (error) {
      console.error("addPost error:", error);
      return -1;
    }
    return data[0].id;
  }

  async updateStatus(email: string, status: string, id: string) {
    console.log("updateStatus called with:", { email, status, id });

    const { data, error } = await this.sbInstance
      .from("posts")
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("email", email)
      .select();

    console.log("updateStatus result:", { data, error });

    if (error) {
      console.error("updateStatus error:", error);
      return -1;
    }

    // Check if any rows were updated
    if (!data || data.length === 0) {
      console.error("No rows updated - post not found or email mismatch");
      return -1;
    }

    return 1;
  }

  async deletePost(email: string, id: string) {
    console.log("deletePost called with:", { email, id });

    const { data, error } = await this.sbInstance
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("email", email)
      .select(); // Add .select() to see what was deleted

    console.log("deletePost result:", { data, error });

    if (error) {
      console.error("deletePost error:", error);
      return -1;
    }

    // Check if any rows were deleted
    if (!data || data.length === 0) {
      console.error("No rows deleted - post not found or email mismatch");
      return -1;
    }

    return 1;
  }

  async getPostById(id: string) {
    console.log("getPostById called with:", { id });

    let { data: post, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    console.log("getPostById result:", { post, error });

    if (error) {
      console.error("getPostById error:", error);
      return -1;
    }
    return post;
  }

  async getPostsByType(type: string) {
    let { data: posts, error } = await this.sbInstance
      .from("posts")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("getPostsByType error:", error);
      return [-1];
    }
    return posts;
  }
}
