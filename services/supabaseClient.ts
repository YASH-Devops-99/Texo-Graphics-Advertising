import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhyjhfosikhrqoeoivmm.supabase.co';
const supabaseKey = 'sb_publishable_e6yCXqgUh9ZsoaVHWVCQzg_lK9GvIOd';

export const supabase = createClient(supabaseUrl, supabaseKey);