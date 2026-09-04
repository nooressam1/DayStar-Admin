import {
  ContactSubmission,
  ContactSubmissionQueryParams,
  ContactSubmissionsResponse,
  UpdateContactSubmissionDto,
} from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryApi } from "../endpoints/queries";

export const useGetQueries = (params?: ContactSubmissionQueryParams) => {
  return useQuery<ContactSubmissionsResponse, Error>({
    queryKey: ["queries", params],
    queryFn: () => queryApi.getQueries(params),
  });
};

export const useUpdateQueryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ContactSubmission,
    Error,
    { id: string; dto: UpdateContactSubmissionDto }
  >({
    mutationFn: ({ id, dto }) => queryApi.updateQueryStatus(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    },
  });
};
