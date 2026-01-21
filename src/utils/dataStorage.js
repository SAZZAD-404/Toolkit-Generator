import { supabase, isSupabaseConfigured, testConnection, getConnectionStatus } from '../lib/supabase'

// Database connection timeout (reduced for faster response)
const DB_TIMEOUT = 2000; // 2 seconds

// Create a timeout promise
const createTimeout = (ms, operation = 'Database operation') => {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`${operation} timeout`)), ms)
  );
};

// Enhanced duplicate prevention - Get existing data with better filtering
export const getExistingDataValues = async (dataType, additionalFilters = {}) => {
  console.log('🔍 Getting existing data for type:', dataType);
  
  // Always check localStorage first for faster response
  try {
    const existingData = JSON.parse(localStorage.getItem('generatedData') || '[]');
    const filtered = existingData
      .filter(item => (item.dataType === dataType || item.data_type === dataType))
      .map(item => item.dataValue || item.data_value);
    console.log('📊 Found', filtered.length, 'existing items in localStorage');
    
    // If we have data in localStorage, return it immediately
    if (filtered.length > 0) {
      return filtered;
    }
  } catch (error) {
    console.error('❌ Error reading from localStorage:', error);
  }
  
  if (!isSupabaseConfigured) {
    console.log('⚠️ Supabase not configured, using localStorage only');
    return [];
  }

  try {
    // Short timeout for auth check
    const authPromise = supabase.auth.getUser();
    const { data: { user } } = await Promise.race([
      authPromise, 
      createTimeout(1000, 'Auth check')
    ]);
    
    if (!user) {
      console.log('⚠️ User not authenticated, using localStorage only');
      return [];
    }

    let query = supabase
      .from('generated_data')
      .select('data_value, metadata')
      .eq('user_id', user.id)
      .eq('data_type', dataType)

    // Apply additional filters if provided
    Object.keys(additionalFilters).forEach(key => {
      if (additionalFilters[key] !== undefined && additionalFilters[key] !== null) {
        query = query.eq(`metadata->${key}`, additionalFilters[key])
      }
    })

    // Short timeout for database query
    const dbTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 1500)
    );

    const { data, error } = await Promise.race([query, dbTimeout]);

    if (error) {
      console.log('⚠️ Database error, using localStorage only:', error.message);
      return [];
    }

    const result = data ? data.map(item => item.data_value) : [];
    console.log('📊 Found', result.length, 'existing items in database');
    return result;
  } catch (error) {
    console.log('⚠️ Database unavailable, using localStorage only:', error.message);
    return [];
  }
}

// Enhanced duplicate checking with metadata support
export const checkDataExists = async (dataType, dataValue, metadata = {}) => {
  if (!isSupabaseConfigured) {
    return false
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    let query = supabase
      .from('generated_data')
      .select('id')
      .eq('user_id', user.id)
      .eq('data_type', dataType)
      .eq('data_value', dataValue)

    // Check metadata if provided
    Object.keys(metadata).forEach(key => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        query = query.eq(`metadata->${key}`, metadata[key])
      }
    })

    const { data, error } = await query

    if (error) {
      console.error('Error checking data exists:', error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error('Error checking data exists:', error)
    return false
  }
}

export const saveGeneratedData = async (dataType, dataValue, metadata = {}, addGeneratedDataCallback = null) => {
  console.log('💾 Saving data:', { dataType, dataValue: dataValue.substring(0, 50) + '...' });
  
  // Always save to localStorage first for immediate availability
  try {
    const existingData = JSON.parse(localStorage.getItem('generatedData') || '[]');
    const newData = {
      id: Date.now().toString(),
      dataType,
      dataValue,
      metadata,
      createdAt: new Date().toISOString()
    };
    existingData.push(newData);
    localStorage.setItem('generatedData', JSON.stringify(existingData));
    
    // Call the callback to update realtime data
    if (addGeneratedDataCallback) {
      addGeneratedDataCallback(dataType, dataValue, metadata);
    }
    
    console.log('✅ Data saved to localStorage');
  } catch (error) {
    console.error('❌ Error saving to localStorage:', error);
  }
  
  // Check if we should use localStorage only mode
  const useLocalStorageOnly = localStorage.getItem('useLocalStorage') === 'true';
  if (useLocalStorageOnly) {
    console.log('📱 Using localStorage-only mode (database disabled)');
    return { success: true, localStorage: true, mode: 'localStorage-only' };
  }
  
  // Try to save to database if available (but don't block if it fails)
  if (!isSupabaseConfigured) {
    console.log('⚠️ Supabase not configured, localStorage only');
    return { success: true, localStorage: true, reason: 'supabase-not-configured' };
  }

  try {
    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest) {
      const status = getConnectionStatus();
      console.log('⚠️ Database connection failed:', status.error);
      return { 
        success: true, 
        localStorage: true, 
        reason: 'connection-failed',
        connectionError: status.error 
      };
    }

    // Short timeout for auth check
    const authPromise = supabase.auth.getUser();
    const { data: { user } } = await Promise.race([
      authPromise, 
      createTimeout(1000, 'Auth check')
    ]);
    
    if (!user) {
      console.log('⚠️ User not authenticated, localStorage only');
      return { 
        success: true, 
        localStorage: true, 
        reason: 'not-authenticated',
        message: 'Please log in to save data to database' 
      };
    }

    // Check for duplicates before saving to database
    const exists = await checkDataExists(dataType, dataValue, metadata)
    if (exists) {
      console.log('⚠️ Duplicate data detected in database, skipping database save');
      return { success: true, duplicate: true, localStorage: true }
    }

    // Database save with timeout
    const dbPromise = supabase
      .from('generated_data')
      .insert([
        {
          user_id: user.id,
          data_type: dataType,
          data_value: dataValue,
          metadata: metadata
        }
      ])
      .select();

    const { data, error } = await Promise.race([
      dbPromise, 
      createTimeout(DB_TIMEOUT, 'Database save')
    ]);

    if (error) {
      console.log('⚠️ Database save failed, but localStorage succeeded:', error.message);
      return { 
        success: true, 
        localStorage: true, 
        reason: 'database-error',
        databaseError: error.message 
      };
    }

    console.log('✅ Data saved to both localStorage and database');
    return { success: true, data: data[0], localStorage: true, database: true }
  } catch (error) {
    console.log('⚠️ Database unavailable, but localStorage succeeded:', error.message);
    return { 
      success: true, 
      localStorage: true, 
      reason: 'database-unavailable',
      databaseError: error.message 
    };
  }
}

// Enhanced duplicate prevention with intelligent generation
export const generateWithDuplicatePrevention = async (
  dataType, 
  generatorFunction, 
  generatorParams, 
  targetCount, 
  maxAttempts = null
) => {
  if (!maxAttempts) {
    maxAttempts = targetCount * 10 // Default: try 10 times more than needed
  }

  try {
    // Get existing data for this user
    const existingData = await getExistingDataValues(dataType)
    
    let uniqueResults = []
    let attempts = 0
    
    while (uniqueResults.length < targetCount && attempts < maxAttempts) {
      // Generate new data
      const generated = await generatorFunction({
        ...generatorParams,
        count: targetCount - uniqueResults.length
      })
      
      // Filter out duplicates (both from database and current batch)
      const newUnique = generated.filter(item => {
        const value = typeof item === 'string' ? item : item.value || item.email || item.number || item.userAgent
        return !existingData.includes(value) && 
               !uniqueResults.some(existing => {
                 const existingValue = typeof existing === 'string' ? existing : existing.value || existing.email || existing.number || existing.userAgent
                 return existingValue === value
               })
      })
      
      uniqueResults.push(...newUnique)
      attempts++
      
      // If we're not making progress, break to avoid infinite loop
      if (newUnique.length === 0 && attempts > 3) {
        break
      }
    }
    
    return uniqueResults.slice(0, targetCount)
  } catch (error) {
    console.error('Error in duplicate prevention:', error)
    // Fallback: generate without duplicate checking
    return await generatorFunction({
      ...generatorParams,
      count: targetCount
    })
  }
}

export const saveEmailHistory = async (email, firstName, lastName, country, style, addGeneratedDataCallback = null) => {
  console.log('📧 Saving email history:', { email, firstName, lastName, country, style });
  
  if (!isSupabaseConfigured) {
    console.log('⚠️ Supabase not configured, using localStorage fallback');
    
    // Local storage fallback
    try {
      const existingData = JSON.parse(localStorage.getItem('generatedData') || '[]');
      const newData = {
        id: Date.now().toString(),
        dataType: 'email',
        dataValue: email,
        metadata: { firstName, lastName, country, style },
        createdAt: new Date().toISOString()
      };
      existingData.push(newData);
      localStorage.setItem('generatedData', JSON.stringify(existingData));
      
      if (addGeneratedDataCallback) {
        addGeneratedDataCallback('email', email, { firstName, lastName, country, style });
      }
      
      console.log('✅ Email saved to localStorage');
      return { success: true, data: newData };
    } catch (error) {
      console.error('❌ Error saving email to localStorage:', error);
      return { success: false, error: error.message };
    }
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('⚠️ User not authenticated, using localStorage fallback');
      
      // Local storage fallback for non-authenticated users
      const existingData = JSON.parse(localStorage.getItem('generatedData') || '[]');
      const newData = {
        id: Date.now().toString(),
        dataType: 'email',
        dataValue: email,
        metadata: { firstName, lastName, country, style },
        createdAt: new Date().toISOString()
      };
      existingData.push(newData);
      localStorage.setItem('generatedData', JSON.stringify(existingData));
      
      if (addGeneratedDataCallback) {
        addGeneratedDataCallback('email', email, { firstName, lastName, country, style });
      }
      
      console.log('✅ Email saved to localStorage (no auth)');
      return { success: true, data: newData };
    }

    // Save to email_history table
    const { data: emailData, error: emailError } = await supabase
      .from('email_history')
      .insert([
        {
          user_id: user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          country: country,
          style: style
        }
      ])
      .select()

    if (emailError) {
      console.error('❌ Database error, using localStorage fallback:', emailError);
      
      // Fallback to localStorage if database fails
      const existingData = JSON.parse(localStorage.getItem('generatedData') || '[]');
      const newData = {
        id: Date.now().toString(),
        dataType: 'email',
        dataValue: email,
        metadata: { firstName, lastName, country, style },
        createdAt: new Date().toISOString()
      };
      existingData.push(newData);
      localStorage.setItem('generatedData', JSON.stringify(existingData));
      
      if (addGeneratedDataCallback) {
        addGeneratedDataCallback('email', email, { firstName, lastName, country, style });
      }
      
      return { success: true, data: newData, fallback: true };
    }

    // Also save to generated_data table
    const { data: generatedData, error: generatedError } = await supabase
      .from('generated_data')
      .insert([
        {
          user_id: user.id,
          data_type: 'email',
          data_value: email,
          metadata: {
            firstName,
            lastName,
            country,
            style
          }
        }
      ])
      .select()

    if (generatedError) {
      console.error('Error saving to generated_data:', generatedError)
    }

    // Call the callback to update realtime data (only once)
    if (addGeneratedDataCallback) {
      addGeneratedDataCallback('email', email, {
        firstName,
        lastName,
        country,
        style
      })
    }

    console.log('✅ Email saved to database successfully');
    return { success: true, data: emailData[0] }
  } catch (error) {
    console.error('❌ Error saving email, using localStorage fallback:', error);
    
    // Final fallback to localStorage
    try {
      const existingData = JSON.parse(localStorage.getItem('generatedData') || '[]');
      const newData = {
        id: Date.now().toString(),
        dataType: 'email',
        dataValue: email,
        metadata: { firstName, lastName, country, style },
        createdAt: new Date().toISOString()
      };
      existingData.push(newData);
      localStorage.setItem('generatedData', JSON.stringify(existingData));
      
      if (addGeneratedDataCallback) {
        addGeneratedDataCallback('email', email, { firstName, lastName, country, style });
      }
      
      return { success: true, data: newData, fallback: true };
    } catch (localError) {
      return { success: false, error: localError.message };
    }
  }
}

// Get all generated data for Data Archive
export const getAllGeneratedData = async () => {
  console.log('📊 Getting all generated data...');
  
  // Always try localStorage first for faster loading
  try {
    const existingData = JSON.parse(localStorage.getItem('generatedData') || '[]');
    if (existingData.length > 0) {
      console.log('📊 Found', existingData.length, 'items in localStorage (fast path)');
      return existingData.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
    }
  } catch (error) {
    console.error('❌ Error reading from localStorage:', error);
  }
  
  if (!isSupabaseConfigured) {
    console.log('⚠️ Supabase not configured, using localStorage only');
    return [];
  }

  try {
    // Auth check with timeout
    const authPromise = supabase.auth.getUser();
    const { data: { user } } = await Promise.race([
      authPromise, 
      createTimeout(1000, 'Auth check')
    ]);
    
    if (!user) {
      console.log('⚠️ User not authenticated, using localStorage only');
      return [];
    }

    // Database query with timeout
    const dbPromise = supabase
      .from('generated_data')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    const { data, error } = await Promise.race([
      dbPromise, 
      createTimeout(DB_TIMEOUT, 'Database query')
    ]);

    if (error) {
      console.error('❌ Database error:', error);
      return [];
    }

    console.log('📊 Found', data?.length || 0, 'items in database');
    return data || [];
  } catch (error) {
    console.log('⚠️ Database unavailable, using localStorage only:', error.message);
    return [];
  }
}