import { axiosInstance } from "../apiServices";
import { getAuthHeaders } from "@/utils/get.auth-headers";



export const getMyProfile = async () => {
    const headers = await getAuthHeaders();
    const response = await axiosInstance.get("/users/me", { headers });
    return response.data;
};

export const getUser = async (username: string) => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/users/${username}`, { headers });
  return response.data;
};

export const getAllUsers = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get("/users", { headers });
  return response.data;
};

export const getConversationData = async (conversationId: string) => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/conversations/${conversationId}`, { headers });
  return response.data;
};

export const getInitialChatData = async (conversationId: string, limit: number) => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/messages?conversationId=${conversationId}&limit=${limit}`, { headers });
  return response.data;
}

export const getCrrentUserChats = async () => {
  const headers = await getAuthHeaders();
  console.log("Headers", headers);
  const response = await axiosInstance.get(`/conversations/user/me/data`, { headers });
  return response.data;
};

export const getPlansHistory = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/purchase/history/`, { headers });
  return response.data;
};

export const getAllGroups = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/groups`, { headers });
  return response.data;
};

export const getAllReports = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/reports`, { headers });
  return response.data;
};

export const getChallenges = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/challanges`, { headers });
  return response.data;
};

export const getLevels = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/levels`, { headers });
  return response.data;
};

export const getDomain = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/challanges/${id}`, { headers });
  return response.data;
};

export const getLeaderboardData = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/analytics/leaderboard`, { headers });
  return response.data;
};

export const getCurrentUserProgress = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/progresses/recent/user/me`, { headers });
  return response.data;
};

export const getUserProgress = async (username: string) => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/progresses/recent/user/${username}`, { headers });
  return response.data;
};

export const getMarketItems = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/market`, { headers });
  return response.data;
};

export const getCurrentNotifications = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get("/notifications/user/me", { headers });
  return response.data;
};

export const getUserAnalytics = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/analytics/users`, { headers });
  return response.data;
};

export const getChallengesAnalytics = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/analytics/challenges`, { headers });
  return response.data;
};

export const getLeaderboardAnalytics = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/analytics/leaderboard`, { headers });
  return response.data;
};

export const getAllChallenges = async () => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/challanges/admin/all`, { headers });
  return response.data;
};


export const getItems = async (type: string) => {

  console.log("TYPE", type)
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/admin/inventory/${type}`, { headers });
  return response.data;
};

export const getItem = async (type: string, id: string) => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/admin/inventory/${type}/${id}`, { headers });
  return response.data;
};
