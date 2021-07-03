import { useQuery, UseQueryOptions } from "react-query"

import { get } from "@/utils"
import { API_URL } from "@/constants"
import { Test } from "@/types"

export const fetchTest = ({
  id,
}: Required<Pick<Test, "id">>): Promise<Required<Test>> =>
  get(`${API_URL}/test/${id}`)

const useTest = (
  { id }: Required<Pick<Test, "id">>,
  options?: UseQueryOptions<Required<Test>>
) => useQuery(["test", id], () => fetchTest({ id }), options)

export default useTest
