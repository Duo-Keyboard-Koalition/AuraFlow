import ProfileForm from "./profile-form"

export default async function CreateProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Create Your Profile</h1>
      <ProfileForm />
    </div>
  )
}
