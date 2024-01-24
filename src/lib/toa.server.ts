import { TOA_API_KEY, TOA_ORIGIN } from "$env/static/private";
import { API } from "@the-orange-alliance/api";

export const toa = new API(TOA_API_KEY, TOA_ORIGIN);
