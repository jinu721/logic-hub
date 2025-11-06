import { User } from "@/types/user.types";
import { axiosInstance } from "../apiServices";
import { ReportIF } from "@/types/report.types";
import { CheckUserIF, LoginIF, RegisterIF } from "@/types/auth.types";
import { ROUTES } from "@/constants/routes";
import { AdminUpdateIF, GroupDataIF, MemberUpdateIF, UpdateGroupIF } from "@/types/group.types copy";


// Auth & User related calls

export const register = async (userData: RegisterIF) => {
  const response = await axiosInstance.post(ROUTES.AUTH.REGISTER, userData);
  localStorage.setItem("userEmail", response.data.data.email);
  return response.data;
};

export const login = async (userData: LoginIF) => {
  const response = await axiosInstance.post(ROUTES.AUTH.LOGIN, userData);
  console.log(`Login Response: ${JSON.stringify(response.data)}`);
  const data = response.data.data;
  console.log("Data: ", data);
  if (!data.isVerified) {
    localStorage.setItem("userEmail", data.email);
  } else {
    localStorage.setItem("user", "true");
    const accessToken = data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken);
  }
  return data;
};

export const checkUser = async (userData: CheckUserIF) => {
  const response = await axiosInstance.post(ROUTES.USERS.CHECK, userData);
  console.log(`Check User Response: ${JSON.stringify(response.data)}`);
  return response.data.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axiosInstance.post(
    ROUTES.AUTH.VERIFY_OTP,
    { email, otp },
    { withCredentials: true }
  );
  const data = response.data.data;
  const accessToken = data.accessToken;
  localStorage.removeItem("userEmail");
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", "true");
  return response.data.userData;
};

export const verifyLogin = async (token: string) => {
  const response = await axiosInstance.get(`${ROUTES.AUTH.VERIFY_LOGIN}?token=${token}`);
  const accessToken = response.data.accessToken;
  localStorage.setItem("user", "true");
  localStorage.setItem("accessToken", accessToken);
  return response.data.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post(ROUTES.AUTH.FORGOT_PASSWORD, { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await axiosInstance.post(
    `${ROUTES.AUTH.RESET_PASSWORD}?token=${token}`,
    { password }
  );
  return response.data;
};

export const banUser = async (userId: string) => {
  const response = await axiosInstance.patch(ROUTES.USERS.BAN(userId));
  return response.data;
};

export const updateUser = async (userData: User) => {
  const response = await axiosInstance.put(ROUTES.USERS.ME, { userData });
  return response.data;
};

export const giftItem = async (type: string, itemId: string, userId: string) => {
  const response = await axiosInstance.post(ROUTES.USERS.GIFT(userId, type), {
    itemId,
  });
  return response.data;
};

export const searchUser = async (query: string) => {
  const response = await axiosInstance.get(`${ROUTES.USERS.SEARCH}?search=${query}`);
  return response.data;
};

export const messageUser = async (userId: string) => {
  const response = await axiosInstance.post(ROUTES.CONVERSATIONS.BASE, { userId });
  return response.data;
};

export const getCrrentUserFriends = async () => {
  const response = await axiosInstance.get(ROUTES.CONVERSATIONS.USER_ME_DATA);
  return response.data;
};


export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await axiosInstance.post(ROUTES.USERS.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Group related calls


export const createGroup = async (groupData: GroupDataIF) => {
  const response = await axiosInstance.post(ROUTES.GROUPS.BASE, groupData);
  return response.data;
};

export const getAllGroups = async (filter: any) => {
  const response = await axiosInstance.get(`${ROUTES.GROUPS.BASE}?${new URLSearchParams(filter)}`);
  return response.data;
};

export const getGroupDetails = async (groupId: string) => {
  const response = await axiosInstance.get(ROUTES.GROUPS.ID(groupId));
  return response.data;
};

export const updateGroup = async (groupData: UpdateGroupIF) => {
  const response = await axiosInstance.put(ROUTES.GROUPS.ID(groupData.groupId), groupData);
  return response.data;
};

export const deleteGroup = async (groupId: string) => {
  const response = await axiosInstance.delete(`${ROUTES.GROUPS.ID(groupId)}/`);
  return response.data;
};

export const addMemberToGroup = async (groupId: string, members: string[]) => {
  const response = await axiosInstance.post(ROUTES.GROUPS.MEMBERS(groupId), { members });
  return response.data;
};

export const removeMemberFromGroup = async (data: MemberUpdateIF) => {
  const response = await axiosInstance.delete(
    ROUTES.GROUPS.MEMBER_REMOVE(data.groupId, data.userId)
  );
  return response.data;
};

export const makeAdmin = async (data: AdminUpdateIF) => {
  const response = await axiosInstance.post(ROUTES.GROUPS.ADMINS(data.groupId), {
    userId: data.userId,
  });
  return response.data;
};

export const removeAdmin = async (data: AdminUpdateIF) => {
  const response = await axiosInstance.delete(
    ROUTES.GROUPS.ADMIN_REMOVE(data.groupId, data.userId)
  );
  return response.data;
};


//   Membership / Purchase related calls

export const createPlan = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.MEMBERSHIP.BASE, data);
  return response.data;
};

export const updatePlan = async (planId: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.MEMBERSHIP.ID(planId), data);
  return response.data;
};

export const createOrder = async (amount: number) => {
  const response = await axiosInstance.post(ROUTES.PURCHASE.CREATE_ORDER, { amount });
  return response.data;
};

export const purchasePlan = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.PURCHASE.BASE, data);
  return response.data;
};

export const getPlanHistory = async (id: any) => {
  const response = await axiosInstance.get(ROUTES.PURCHASE.HISTORY(id));
  return response.data;
};


//   Conversations / Messages related calls

export const getConversation = async (groupId: string) => {
  const response = await axiosInstance.get(ROUTES.CONVERSATIONS.BY_GROUP(groupId));
  return response.data;
};

export const getConversationData = async (conversationId: string) => {
  const response = await axiosInstance.get(ROUTES.CONVERSATIONS.ID(conversationId));
  return response.data;
};

export const getInitialMessages = async (conversationId: string, limit: number) => {
  const response = await axiosInstance.get(ROUTES.MESSAGES.GET_INITIAL_MESSAGES(conversationId,limit));
  return response.data;
};


//   Reports related calls

export const report = async (data: Partial<ReportIF>) => {
  const response = await axiosInstance.post(ROUTES.REPORTS.BASE, data);
  return response.data;
};

export const updateReportStatus = async (id: string, status: string) => {
  const response = await axiosInstance.patch(ROUTES.REPORTS.ID_STATUS(id), { status });
  return response.data;
};

// Challenges related calls

export const createChallenge = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.CHALLENGES.BASE, data);
  return response.data;
};

export const updateChallenge = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.CHALLENGES.ID(id), data);
  return response.data;
};

export const getChallenges = async (filter: any) => {
  const queryParams = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]: [string, any]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => queryParams.append(`${key}[]`, item));
    } else {
      queryParams.append(key, value);
    }
  });

  const response = await axiosInstance.get(`${ROUTES.CHALLENGES.BASE}?${queryParams.toString()}`);
  return response.data.data;
};

export const runCodeChallenge = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.CHALLENGES.RUN, data);
  return response.data;
};

export const submitCodeChallenge = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.CHALLENGES.SUBMIT, data);
  return response.data;
};

export const deleteChallenge = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.CHALLENGES.ID(id));
  return response.data;
};

// Levels related calls

export const createLevel = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.LEVELS.BASE, data);
  return response.data;
};

export const updateLevel = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.LEVELS.ID(id), data);
  return response.data;
};

export const deleteLevel = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.LEVELS.ID(id));
  return response.data;
};

//  Market related calls


export const createMarketItem = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.MARKET.BASE, data);
  return response.data;
};

export const updateMarketItem = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.MARKET.ID(id), data);
  return response.data;
};

export const deleteMarketItem = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.MARKET.ID(id));
  return response.data;
};

export const purchaseMarketItem = async (id: string) => {
  const response = await axiosInstance.post(ROUTES.MARKET.PURCHASE(id), {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

// Notifications ralated calls

export const markAllAsRead = async () => {
  const response = await axiosInstance.post(ROUTES.NOTIFICATIONS.MARK_ALL, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

export const deleteNotification = async () => {
  const response = await axiosInstance.delete(
    ROUTES.NOTIFICATIONS.DELETE_ALL(localStorage.getItem("accessToken") || "")
  );
  return response.data;
};

export const toggleUserNotification = async () => {
  const response = await axiosInstance.patch(ROUTES.NOTIFICATIONS.TOGGLE_USER, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.data;
};

export const getCurrentNotifications = async () => {
  const response = await axiosInstance.get(
    `${ROUTES.NOTIFICATIONS.USER_ME}?accessToken=${localStorage.getItem("accessToken")}`
  );
  console.log("Notifications: ", response.data.data);
  return response.data.data.data;
};

// Inventory ralated calls

export const createItem = async (type: string, data: any) => {
  if (!data.imageFile) {
    throw new Error("Image file is required");
  }
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("image", data.imageFile);
  formData.append("isActive", data.isActive);
  formData.append("rarity", data.rarity);
  const response = await axiosInstance.post(ROUTES.INVENTORY.BASE(type), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateItem = async (type: string, id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.INVENTORY.ID(type, id), data);
  return response.data;
};

export const deleteItem = async (type: string, id: string) => {
  const response = await axiosInstance.delete(ROUTES.INVENTORY.ID(type, id));
  return response.data;
};

export const getItems = async (type: string, search: string, page: number, limit: number) => {
  const response = await axiosInstance.get(
    `${ROUTES.INVENTORY.BASE(type)}?search=${search}&page=${page}&limit=${limit}`
  );
  return response.data;
};

// Solutions / Comments / Likes related calls

export const getSolutionsByChallengeId = async (
  challengeId: string,
  search?: string,
  page?: number,
  limit?: number,
  sortBy?: string
) => {
  const response = await axiosInstance.get(
    `${ROUTES.SOLUTIONS.BY_CHALLENGE(challengeId)}?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}`
  );
  return response.data.data;
};

export const addSolution = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.SOLUTIONS.BASE, data);
  return response.data.data;
};

export const updateSolution = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.SOLUTIONS.ID(id), data);
  return response.data.data;
};

export const deleteSolution = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.SOLUTIONS.ID(id));
  return response.data.data;
};

export const addComment = async (solutionId: string, content: any) => {
  const response = await axiosInstance.post(ROUTES.SOLUTIONS.COMMENT(solutionId), {
    data: { solutionId, content },
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.data;
};

export const deleteComment = async (solutionId: string, commentId: string) => {
  const response = await axiosInstance.delete(ROUTES.SOLUTIONS.COMMENT_ID(solutionId, commentId));
  return response.data.data;
};

export const likeToggle = async (solutionId: string) => {
  const response = await axiosInstance.post(ROUTES.SOLUTIONS.LIKE(solutionId), {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.data;
};

//  Profile / User data related calls

export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get(ROUTES.USERS.ME);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

export const getUser = async (username: string) => {
  const response = await axiosInstance.get(`${ROUTES.USERS.SEARCH}/${username}`);
  return response.data.data;
};

export const getUsers = async (search: string, page: number, limit: number) => {
  const response = await axiosInstance.get(
    `${ROUTES.USERS.SEARCH}?search=${search}&page=${page}&limit=${limit}`
  );
  return response.data.data;
};

export const getUserProgress = async (username: string) => {
  const response = await axiosInstance.get(ROUTES.PROGRESS.USER(username));
  return response.data.data;
};

export const getCurrentUserProgress = async () => {
  const response = await axiosInstance.get(ROUTES.PROGRESS.USER_ME);
  return response.data;
};

export const cancelMembership = async () => {
  const response = await axiosInstance.post(`/users/membership/cancel`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.data;
};

export const claimDailyReward = async () => {
  const response = await axiosInstance.post(ROUTES.REWARD.DAILY_CLAIM, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.data;
};

//  Market fetching

export const getMarketItems = async (
  filter?: { category?: string; searchQuery?: string; sortOption?: string },
  page?: number,
  limit?: number
) => {
  const query = filter ? `${new URLSearchParams(filter as any)}` : "";
  const response = await axiosInstance.get(`${ROUTES.MARKET.BASE}?${query}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getAllMarketItems = async () => {
};

//  Conversations list / Analytics / Leaderboard related calls

export const getCurrentUserChats = async (search: any) => {
  const response = await axiosInstance.get(`${ROUTES.CONVERSATIONS.USER_ME_DATA}?${new URLSearchParams(search)}`);
  return response.data;
};

export const getUserAnalytics = async () => {
  const response = await axiosInstance.get(ROUTES.ANALYTICS.USERS);
  return response.data;
};

export const getLeaderboardAnalytics = async (
  based?: string,
  category?: string,
  period?: string,
  order?: string,
  page?: number,
  limit?: number
) => {
  const response = await axiosInstance.get(
    `${ROUTES.ANALYTICS.LEADERBOARD}?based=${based}&category=${category}&period=${period}&order=${order}&page=${page}&limit=${limit}`
  );
  return response.data;
};

//  Admin / Fetching lists realated calls

export const getAllChallenges = async (search?: string, page?: number, limit?: number) => {
  const response = await axiosInstance.get(
    `${ROUTES.CHALLENGES.ADMIN_ALL}?search=${search}&page=${page}&limit=${limit}`
  );
  return response.data.data;
};

export const getLevels = async (page?: number, limit?: number) => {
  const response = await axiosInstance.get(`${ROUTES.LEVELS.BASE}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getPlans = async (search?: string, page?: number, limit?: number) => {
  const response = await axiosInstance.get(`${ROUTES.MEMBERSHIP.BASE}?search=${search}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getTwoActivePlans = async () => {
  const response = await axiosInstance.get(ROUTES.MEMBERSHIP.ACTIVE);
  return response.data;
};

export const getAllHistory = async (page?: number, limit?: number) => {
  const response = await axiosInstance.get(`${ROUTES.PURCHASE.FULL_HISTORY}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getReports = async (filter?: any, page?: number, limit?: number) => {
  const q = filter ? `${new URLSearchParams(filter)}` : "";
  const response = await axiosInstance.get(`${ROUTES.REPORTS.BASE}?${q}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getDomain = async (domainId: string) => {
  const response = await axiosInstance.get(ROUTES.CHALLENGES.ID(domainId));
  return response.data.data;
};

export const getHeatMap = async (userId: string, year?: number) => {
  const response = await axiosInstance.get(ROUTES.PROGRESS.HEATMAP(userId) + `?year=${year}`);
  return response.data;
};



export const getCurrentNotificationsDeprecated = async () => {
  const response = await axiosInstance.get(
    `${ROUTES.NOTIFICATIONS.USER_ME}?accessToken=${localStorage.getItem("accessToken")}`
  );
  return response.data;
};
