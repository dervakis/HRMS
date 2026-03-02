import { useMutation, useQuery } from "@tanstack/react-query";
import { addConfiguration, deleteConfiguration, getConfigurationByKey, updateConfigurationByKey } from "../api/AppConfigurationApiCall";

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

export const useUpdateConfigurationByKey = () => {
    return useMutation({
        mutationFn: updateConfigurationByKey,
    });
};

export const useDeleteConfiguration = () => {
    return useMutation({
        mutationFn: deleteConfiguration
    });
};