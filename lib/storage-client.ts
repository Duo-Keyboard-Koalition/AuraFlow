import { supabase } from './supabase-client'

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  // Key naming convention: user-id/avatar-<timestamp>.<ext>
  const fileExt = file.name.split('.').pop()
  const fileName = `avatar-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  // 1. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) {
    console.error("Supabase Storage Upload Error:", uploadError)
    throw new Error(uploadError.message || "Failed to upload file to storage")
  }

  // 2. Get Public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const publicUrl = data.publicUrl

  // 3. Update Profile in DB
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)

  if (updateError) throw updateError

  return publicUrl
}
