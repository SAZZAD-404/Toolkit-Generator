import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Enhanced duplicate prevention - Get existing data with better filtering
export const getExistingDataValues = async (dataType, additionalFilters = {}) => {
  if (!isSupabaseConfigured) {
    return []
  }

  try {
    let query = supabase
      .from('generated_data')
      .select('data_value, metadata')
      .eq('data_type', dataType)

    // Apply additional filters if provided
    Object.keys(additionalFilters).forEach(key => {
      if (additionalFilters[key] !== undefined && additionalFilters[key] !== null) {
        query = query.eq(`metadata->${key}`, additionalFilters[key])
      }
    })

    const { data, error } = await query

    if (error) {
      console.error('Error getting existing data:', error)
      return []
    }

    return data ? data.map(item => item.data_value) : []
  } catch (error) {
    console.error('Error getting existing data:', error)
    return []
  }
}

// Enhanced duplicate checking with metadata support
export const checkDataExists = async (dataType, dataValue, metadata = {}) => {
  if (!isSupabaseConfigured) {
    return false
  }

  try {

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

    const { data, error } = await query.limit(1)

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
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured, skipping data save')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    // Check for duplicates before saving
    const exists = await checkDataExists(dataType, dataValue, metadata)
    if (exists) {
      console.log('Duplicate data detected, skipping save:', dataValue)
      return { success: true, duplicate: true }
    }

    const { data, error } = await supabase
      .from('generated_data')
      .insert([
        {
          data_type: dataType,
          data_value: dataValue,
          metadata: metadata
        }
      ])
      .select()

    if (error) {
      // If it's a unique constraint violation, it's not really an error
      if (error.code === '23505') {
        return { success: true, duplicate: true }
      }
      console.error('Error saving data:', error)
      return { success: false, error: error.message }
    }

    // Call the callback to update realtime data
    if (addGeneratedDataCallback) {
      addGeneratedDataCallback(dataType, dataValue, metadata)
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error saving data:', error)
    return { success: false, error: error.message }
  }
}

// Universal duplicate prevention for all generators
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
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured, skipping email save')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    // Save to email_history table
    const { data: emailData, error: emailError } = await supabase
      .from('email_history')
      .insert([
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          country: country,
          style: style
        }
      ])
      .select()

    if (emailError) {
      // If it's a unique constraint violation, it's not really an error
      if (emailError.code === '23505') {
        return { success: true, duplicate: true }
      }
      console.error('Error saving email:', emailError)
      return { success: false, error: emailError.message }
    }

    // Also save to generated_data table
    const { data: generatedData, error: generatedError } = await supabase
      .from('generated_data')
      .insert([
        {
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

    return { success: true, data: emailData[0] }
  } catch (error) {
    console.error('Error saving email:', error)
    return { success: false, error: error.message }
  }
}