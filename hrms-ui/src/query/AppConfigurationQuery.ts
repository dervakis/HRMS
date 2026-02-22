import { useMutation, useQuery } from "@tanstack/react-query";
import { addConfiguration, deleteConfiguration, getConfigurationByKey } from "../api/AppConfigurationApiCall";

export const useGetConfiguration = (key: string) => {
    return useQuery({
        queryKey: ["config", key],
        queryFn: () => getConfigurationByKey(key),
    });
};

export const useAddConfiguration = () => {
    return useMutation({
        mutationFn: addConfiguration,
    });
};

export const useDeleteConfiguration = () => {
    return useMutation({
        mutationFn: deleteConfiguration
    });
};