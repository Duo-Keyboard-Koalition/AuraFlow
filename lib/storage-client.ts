import { supabase } from './supabase-client'

/**
 * Uploads a profile avatar
 */
export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `avatar-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const publicUrl = data.publicUrl

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)

  if (updateError) throw updateError

  return publicUrl
}

/**
 * Uploads media for an Aura (post)
 */
export const uploadAuraMedia = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `aura-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('auras_media')
    .upload(filePath, file)

  if (uploadError) {
    // If bucket doesn't exist, this might fail, but in a real app we'd ensure it exists
    console.error("Storage upload failed", uploadError)
    throw uploadError
  }

  const { data } = supabase.storage
    .from('auras_media')
    .getPublicUrl(filePath)

  return data.publicUrl
}
