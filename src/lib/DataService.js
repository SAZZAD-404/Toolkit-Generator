import { supabase } from './supabase';

/**
 * DataService - Handles all data persistence operations with automatic user_id injection
 * 
 * This service ensures that all generated data is properly associated with the authenticated
 * user and enforces data isolation through Supabase Row Level Security (RLS) policies.
 */
class DataService {
  /**
   * Save generated data to database
   * @param {string} dataType - Type of data ('email', 'phone', 'user_agent', 'ip')
   * @param {string} dataValue - The generated value
   * @param {object} metadata - Additional information (optional)
   * @returns {Promise<object>} - Saved data record
   * @throws {Error} - If user is not authenticated or database operation fails
   */
  async saveGeneratedData(dataType, dataValue, metadata = {}) {
    try {
      // Verify user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User must be authenticated to save data');
      }

      // Validate required parameters
      if (!dataType || typeof dataType !== 'string') {
        throw new Error('dataType is required and must be a string');
      }

      if (!dataValue || typeof dataValue !== 'string') {
        throw new Error('dataValue is required and must be a string');
      }

      // Validate dataType is one of the allowed types
      const validTypes = ['email', 'phone', 'user_agent', 'ip'];
      if (!validTypes.includes(dataType)) {
        throw new Error(`dataType must be one of: ${validTypes.join(', ')}`);
      }

      // Insert data with user_id
      const { data, error } = await supabase
        .from('generated_data')
        .insert({
          user_id: user.id,
          data_type: dataType,
          data_value: dataValue,
          metadata: metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Database error saving data:', error);
        throw new Error(`Failed to save data: ${error.message}`);
      }

      return data;
    } catch (error) {
      // Re-throw with context if it's already an Error
      if (error instanceof Error) {
        throw error;
      }
      // Wrap unexpected errors
      throw new Error(`Unexpected error saving data: ${error}`);
    }
  }

  /**
   * Get user's generated data by type
   * @param {string} dataType - Type of data to retrieve (optional, returns all if not specified)
   * @param {number} limit - Maximum number of records (default: 100)
   * @returns {Promise<Array>} - Array of data records ordered by creation time (newest first)
   * @throws {Error} - If user is not authenticated or database operation fails
   */
  async getUserData(dataType = null, limit = 100) {
    try {
      // Verify user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User must be authenticated to retrieve data');
      }

      // Validate limit
      if (typeof limit !== 'number' || limit < 1) {
        throw new Error('limit must be a positive number');
      }

      // Build query with user_id filter
      let query = supabase
        .from('generated_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Add type filter if specified
      if (dataType) {
        query = query.eq('data_type', dataType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Database error retrieving data:', error);
        throw new Error(`Failed to retrieve data: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unexpected error retrieving data: ${error}`);
    }
  }

  /**
   * Get statistics for user's generated data
   * @param {object} options - Optional filtering options
   * @param {Date} options.startDate - Start date for filtering (optional)
   * @param {Date} options.endDate - End date for filtering (optional)
   * @returns {Promise<object>} - Statistics object with counts per type
   * @throws {Error} - If user is not authenticated or database operation fails
   */
  async getUserStatistics(options = {}) {
    try {
      // Verify user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User must be authenticated to retrieve statistics');
      }

      // Build query with user_id filter
      let query = supabase
        .from('generated_data')
        .select('data_type, created_at')
        .eq('user_id', user.id);

      // Apply date filters if provided
      if (options.startDate) {
        query = query.gte('created_at', options.startDate.toISOString());
      }
      if (options.endDate) {
        query = query.lte('created_at', options.endDate.toISOString());
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Database error retrieving statistics:', error);
        throw new Error(`Failed to retrieve statistics: ${error.message}`);
      }

      // Calculate statistics
      const stats = {
        email: 0,
        phone: 0,
        user_agent: 0,
        ip: 0,
        total: 0
      };

      if (data) {
        data.forEach(item => {
          if (stats.hasOwnProperty(item.data_type)) {
            stats[item.data_type]++;
          }
          stats.total++;
        });
      }
      
      return stats;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unexpected error retrieving statistics: ${error}`);
    }
  }

  /**
   * Delete a data record
   * @param {string} id - Record ID to delete
   * @returns {Promise<void>}
   * @throws {Error} - If user is not authenticated or database operation fails
   */
  async deleteData(id) {
    try {
      // Verify user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User must be authenticated to delete data');
      }

      // Validate id
      if (!id || typeof id !== 'string') {
        throw new Error('id is required and must be a string');
      }

      // Delete with user_id check (RLS will also enforce this)
      const { error } = await supabase
        .from('generated_data')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Database error deleting data:', error);
        throw new Error(`Failed to delete data: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unexpected error deleting data: ${error}`);
    }
  }

  /**
   * Check if data already exists for the user
   * @param {string} dataType - Type of data
   * @param {string} dataValue - Value to check
   * @returns {Promise<boolean>} - True if data exists
   */
  async checkDuplicateData(dataType, dataValue) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return false;
      }

      const { data, error } = await supabase
        .from('generated_data')
        .select('id')
        .eq('user_id', user.id)
        .eq('data_type', dataType)
        .eq('data_value', dataValue)
        .limit(1);

      if (error) {
        console.error('Error checking duplicate:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  }
}

export default DataService;