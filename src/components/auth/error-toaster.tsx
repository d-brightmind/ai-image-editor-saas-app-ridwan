import { authMutationKeys, authQueryKeys } from "@better-auth-ui/core"
import {
  matchMutation,
  matchQuery,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"

/** Shape of the `error.error` payload better-auth sends on failed requests. */
interface AuthErrorBody {
  code?: string
  message?: string
}

export function ErrorToaster() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const queryCache = queryClient.getQueryCache()
    const previousQueryOnError = queryCache.config.onError

    queryCache.config.onError = (error, query) => {
      previousQueryOnError?.(error, query)

      if (!matchQuery({ queryKey: authQueryKeys.all }, query)) return

      const err = error as BetterFetchError
      const errBody = err?.error as AuthErrorBody | undefined
      if (errBody?.code === "EMAIL_NOT_VERIFIED") return
      if (errBody) toast.error(errBody.message)
    }

    const mutationCache = queryClient.getMutationCache()
    const previousMutationOnError = mutationCache.config.onError

    mutationCache.config.onError = (
      error,
      variables,
      onMutateResult,
      mutation,
      context
    ) => {
      previousMutationOnError?.(
        error,
        variables,
        onMutateResult,
        mutation,
        context
      )

      if (!matchMutation({ mutationKey: authMutationKeys.all }, mutation)) {
        return
      }

      const err = error as BetterFetchError
      const errBody = err.error as AuthErrorBody | undefined
      if (errBody?.code === "EMAIL_NOT_VERIFIED") return
      toast.error(errBody?.message ?? err.message)
    }

    return () => {
      queryCache.config.onError = previousQueryOnError
      mutationCache.config.onError = previousMutationOnError
    }
  }, [queryClient])

  return null
}
