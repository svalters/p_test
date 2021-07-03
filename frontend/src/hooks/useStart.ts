import { useMutation, useQueryClient } from "react-query"

import { post } from "@/utils"
import { API_URL } from "@/constants"
import { Test } from "@/types"

export const startTest = (data: Test): Promise<Required<Test>> =>
  post(`${API_URL}/test`, data)

const useStart = () => {
  const queryClient = useQueryClient()

  return useMutation(startTest, {
    onSuccess: data => {
      queryClient.setQueryData(["test", data.id], data)
    },
  })
}

export default useStart
