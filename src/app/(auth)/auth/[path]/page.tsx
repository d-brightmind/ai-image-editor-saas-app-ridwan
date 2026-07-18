import { viewPaths } from "@better-auth-ui/core"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Auth } from "@/components/auth/auth"
import { auth } from "~/lib/auth"

// Views a logged-in user shouldn't be able to visit — they get redirected
// to the dashboard instead.
const AUTHENTICATED_REDIRECT_VIEWS = ["signIn", "signUp", "signOut"]

export default async function AuthPage({
  params
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params

  if (!Object.values(viewPaths.auth).includes(path)) {
    notFound()
  }

  const session = await auth.api.getSession({
    headers: await headers()
  })

  const authView = (Object.keys(viewPaths.auth) as (keyof typeof viewPaths.auth)[]).find(
    (key) => viewPaths.auth[key] === path
  )

  if (session && authView && AUTHENTICATED_REDIRECT_VIEWS.includes(authView)) {
    redirect("/dashboard")
  }

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} />
    </div>
  )
}