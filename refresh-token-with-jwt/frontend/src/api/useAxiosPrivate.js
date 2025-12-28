import { useContext, useEffect } from "react";
import api from "./axios";
import axios from "axios";
import tokenContext from "../store/contextStore";

const useAxiosPrivate = () => {
	const { accessToken, setAccessToken } = useContext(tokenContext);

	useEffect(() => {
		// REQUEST INTERCEPTOR
		const requestIntercept = api.interceptors.request.use(
			(config) => {
				if (accessToken && !config.headers.Authorization) {
					config.headers.Authorization = "Bearer " + accessToken;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		// RESPONSE INTERCEPTOR
		const responseIntercept = api.interceptors.response.use(
			(response) => response,
			(error) => {
				const prevRequest = error?.config;

				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;

					// 🔑 IMPORTANT: return the promise
					return axios
						.get("http://localhost:5000/api/auth/refresh", {
							withCredentials: true,
						})
						.then((refreshResponse) => {
							const newAccessToken = refreshResponse.data.accessToken;

							// update context
							setAccessToken(newAccessToken);

							// retry original request
							prevRequest.headers.Authorization = "Bearer " + newAccessToken;

							return api(prevRequest);
						})
						.catch((refreshError) => {
							console.log("Refresh token expired or invalid");
							return Promise.reject(refreshError);
						});
				}

				return Promise.reject(error);
			}
		);

		return () => {
			api.interceptors.request.eject(requestIntercept);
			api.interceptors.response.eject(responseIntercept);
		};
	}, [accessToken, setAccessToken]);

	return api;
};

export default useAxiosPrivate;
