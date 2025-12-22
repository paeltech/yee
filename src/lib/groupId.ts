/**
 * Generates a unique 6-character alphanumeric ID (uppercase)
 * Format: A-Z, 0-9 (e.g., "A3B9K2")
 */
export function generateGroupId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Checks if a group ID already exists in the database
 */
export async function isGroupIdUnique(groupId: string, supabase: any, excludeId?: number): Promise<boolean> {
  let query = supabase
    .from('groups')
    .select('id')
    .eq('group_number', groupId)
    .limit(1);
  
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error checking group ID uniqueness:', error);
    return false;
  }
  
  return !data || data.length === 0;
}

/**
 * Generates a unique group ID that doesn't exist in the database
 */
export async function generateUniqueGroupId(supabase: any, excludeId?: number, maxAttempts: number = 10): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const groupId = generateGroupId();
    const isUnique = await isGroupIdUnique(groupId, supabase, excludeId);
    
    if (isUnique) {
      return groupId;
    }
  }
  
  // If we couldn't generate a unique ID after max attempts, throw an error
  throw new Error('Failed to generate unique group ID after multiple attempts');
}

