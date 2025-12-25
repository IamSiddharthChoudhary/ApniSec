import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class SbClient {
  private url: string;
  private key: string;
  protected sbInstance: SupabaseClient;

  constructor(
    url = process.env.NEXT_PUBLIC_SB_URL,
    key = process.env.NEXT_PUBLIC_SB_KEY
  ) {
    this.url = url ? url : " ";
    this.key = key ? key : " ";

    this.sbInstance = createClient(this.url, this.key);
  }
}
