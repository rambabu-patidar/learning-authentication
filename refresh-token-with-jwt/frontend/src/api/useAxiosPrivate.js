import { useContext, useEffect } from "react";
import api from "./axios";
import axios from "axios";
import tokenContext from "../store/contextStore";

const useAxiosPrivate = () => {
	const { accessToken, setAccessToken } = useContext(tokenContext);

	useEffect(() => {
		const requestIntercept = api.interceptors.request.use(
			(config) => {
				// if we don't have the accessToken due to page refresh
				// we can call the /refresh endpoint and then provide it before sending any request to
				// our server.

				// after researching a bit I understand that this is a bad idea, and here is why.

				// At first it seems to be a good solution becuase if the user is refreshing the page
				// we the react local storage will be reset and we'll not have access token
				// and the /refresh call is must needed, either you make it in request interceptor
				// or in response interceptor.

				// The problem comes where let's say simultaneously server calls 5 request
				// all of them didn't found the accesstoken and in request interceptor all
				// of them have triggered the 5 /refresh endpoint call.
				// Here arises the conflit, as we don't know which request will come first out of 5 and
				// then the other will bring different accessToken and will set on the context and it's a race condition.

				// but in the case where if first let the one request fails, and get the accesstoken in response interceptor
				// and then attach the same accessToken with all the request is very efficient and healthy option.

				if (accessToken && !config.headers.Authorization) {
					config.headers.Authorization = "Bearer " + accessToken;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = api.interceptors.response.use(
			(response) => response,
			(error) => {
				const prevRequest = error?.config;

				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;

					// return the promise
					return axios
						.get("https://localhost:5000/api/auth/refresh", {
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
