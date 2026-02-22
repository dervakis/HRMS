import type { ApiResponseType } from "../types/ApiResponse";
import { Api } from "./AxiosBase";

export interface AppConfigurationType {
    appConfigurationId: number;
    configKey: string;
    configValue: string;
}

export interface AppConfigurationCreateType {
    key: string;
    value: string;
}

export const addConfiguration = async (data:AppConfigurationCreateType): Promise<ApiResponseType<Object>> => {
    const res = await Api.post(`/config/${data.key}/${data.value}`);
    return res.data;
};

export const getConfigurationByKey = async (key: string): Promise<AppConfigurationType[]> => {
    const res = await Api.get(`/config/${key}`);
    return res.data.data;
};

export const deleteConfiguration = async (configId: number) : Promise<ApiResponseType<Object>> => {
    const res = await Api.delete(`/config/${configId}`);
    return res.data;
  };