import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qaspkrqopipjdjtnsmut.supabase.co";
const supabaseKey = "sb_publishable_6QCPzubJSk_29hd4WhXmrQ_RCno5c7Y";

export const supabase = createClient(supabaseUrl, supabaseKey);