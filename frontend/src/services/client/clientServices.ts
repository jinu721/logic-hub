import { User } from "@/types/user.types";
import { axiosInstance } from "../apiServices";
import { ReportIF } from "@/types/report.types";
import { CheckUserIF, LoginIF, RegisterIF } from "@/types/auth.types";
import { ROUTES } from "@/constants/routes";
import { AdminUpdateIF, GroupDataIF, MemberUpdateIF, UpdateGroupIF } from "@/types/group.types copy";


// Auth & User related calls

export const register = async (userData: RegisterIF) => {
  console.log("Reg started")
  const response = await axiosInstance.post(ROUTES.AUTH.REGISTER, userData);
  console.log("Reg ended", response.data);
  const result = response.data.result;
  localStorage.setItem("userEmail", result.email);

  return result;
};

export const login = async (userData: LoginIF) => {
  const response = await axiosInstance.post(ROUTES.AUTH.LOGIN, userData);
  console.log(`Login Response: ${JSON.stringify(response.data)}`);
  const result = response.data.result;
  console.log("Data: ", result);
  if (!result.isVerified) {
    localStorage.setItem("userEmail", result.email);
  } else {
    localStorage.setItem("user", "true");
    const accessToken = result.accessToken;
    localStorage.setItem("accessToken", accessToken);
  }
  return result;
};

export const checkUser = async (userData: CheckUserIF) => {
  const response = await axiosInstance.post(ROUTES.USERS.CHECK, userData);
  console.log(`Check User Response: ${JSON.stringify(response.data)}`);
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axiosInstance.post(
    ROUTES.AUTH.VERIFY_OTP,
    { email, otp },
    { withCredentials: true }
  );
  const result = response.data.result;
  const accessToken = result.accessToken;
  localStorage.removeItem("userEmail");
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", "true");
  return result.user;
};

export const verifyLogin = async (token: string) => {
  const response = await axiosInstance.get(`${ROUTES.AUTH.VERIFY_LOGIN}?token=${token}`);
  const result = response.data.result;
  const accessToken = result.accessToken;
  localStorage.setItem("user", "true");
  localStorage.setItem("accessToken", accessToken);
  return result;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post(ROUTES.AUTH.FORGOT_PASSWORD, { email });
  return response.data.result;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await axiosInstance.post(
    `${ROUTES.AUTH.RESET_PASSWORD}?token=${token}`,
    { password }
  );
  return response.data.result;
};

export const banUser = async (userId: string) => {
  const response = await axiosInstance.patch(ROUTES.USERS.BAN(userId));
  return response.data.result;
};

export const updateUser = async (userData: User) => {
  const response = await axiosInstance.put(ROUTES.USERS.ME, { userData });
  return response.data.result;
};

export const giftItem = async (type: string, itemId: string, userId: string) => {
  const response = await axiosInstance.post(ROUTES.USERS.GIFT(userId, type), {
    itemId,
  });
  return response.data.result;
};

export const searchUser = async (query: string) => {
  const response = await axiosInstance.get(`${ROUTES.USERS.SEARCH}?search=${query}`);
  return response.data.result;
};

export const messageUser = async (userId: string) => {
  const response = await axiosInstance.post(ROUTES.CONVERSATIONS.BASE, { userId });
  return response.data.result;
};

export const getCrrentUserFriends = async () => {
  const response = await axiosInstance.get(ROUTES.CONVERSATIONS.USER_ME_DATA);
  return response.data.result;
};


export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await axiosInstance.post(ROUTES.USERS.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  });
  return response.data.result;
};

export const purchaseMarketItem = async (id: string) => {
  const response = await axiosInstance.post(ROUTES.USERS.PURCHASE_MARKET_ITEM(id), {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.result;
};

// Group related calls


export const createGroup = async (groupData: GroupDataIF) => {
  const response = await axiosInstance.post(ROUTES.GROUPS.BASE, groupData);
  return response.data.result;
};

export const getAllGroups = async (filter: any) => {
  const response = await axiosInstance.get(`${ROUTES.GROUPS.BASE}?${new URLSearchParams(filter)}`);
  console.log("Groups fetched: ", response.data.result);
  return response.data.result;
};

export const getGroupDetails = async (groupId: string) => {
  const response = await axiosInstance.get(ROUTES.GROUPS.ID(groupId));
  return response.data.result;
};

export const updateGroup = async (groupData: UpdateGroupIF) => {
  const response = await axiosInstance.put(ROUTES.GROUPS.ID(groupData.groupId), groupData);
  return response.data.result;
};

export const deleteGroup = async (groupId: string) => {
  const response = await axiosInstance.delete(`${ROUTES.GROUPS.ID(groupId)}/`);
  return response.data.result;
};

export const addMemberToGroup = async (groupId: string, members: string[]) => {
  const response = await axiosInstance.post(ROUTES.GROUPS.MEMBERS(groupId), { members });
  return response.data.result;
};

export const removeMemberFromGroup = async (data: MemberUpdateIF) => {
  const response = await axiosInstance.delete(
    ROUTES.GROUPS.MEMBER_REMOVE(data.groupId, data.userId)
  );
  return response.data.result;
};

export const makeAdmin = async (data: AdminUpdateIF) => {
  const response = await axiosInstance.post(ROUTES.GROUPS.ADMINS(data.groupId), {
    userId: data.userId,
  });
  return response.data.result;
};

export const removeAdmin = async (data: AdminUpdateIF) => {
  const response = await axiosInstance.delete(
    ROUTES.GROUPS.ADMIN_REMOVE(data.groupId, data.userId)
  );
  return response.data.result;
};


//   Membership / Purchase related calls

export const createPlan = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.MEMBERSHIP.BASE, data);
  return response.data.result;
};

export const updatePlan = async (planId: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.MEMBERSHIP.ID(planId), data);
  return response.data.result;
};

export const createOrder = async (amount: number) => {
  const response = await axiosInstance.post(ROUTES.PURCHASE.CREATE_ORDER, { amount });
  return response.data.result;
};

export const purchasePlan = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.PURCHASE.BASE, data);
  return response.data.result;
};

export const getPlanHistory = async (id: any) => {
  const response = await axiosInstance.get(ROUTES.PURCHASE.HISTORY(id));
  return response.data.result;
};


//   Conversations / Messages related calls

export const getConversation = async (groupId: string) => {
  const response = await axiosInstance.get(ROUTES.CONVERSATIONS.BY_GROUP(groupId));
  return response.data.result;
};

export const getConversationData = async (conversationId: string) => {
  const response = await axiosInstance.get(ROUTES.CONVERSATIONS.ID(conversationId));
  return response.data.result;
};

export const getInitialMessages = async (conversationId: string, limit: number) => {
  const response = await axiosInstance.get(ROUTES.MESSAGES.GET_INITIAL_MESSAGES(conversationId,limit));
  return response.data.result;
};


//   Reports related calls

export const report = async (data: Partial<ReportIF>) => {
  const response = await axiosInstance.post(ROUTES.REPORTS.BASE, data);
  return response.data.result;
};

export const updateReportStatus = async (id: string, status: string) => {
  const response = await axiosInstance.patch(ROUTES.REPORTS.ID_STATUS(id), { status });
  return response.data.result;
};

// Challenges related calls

export const createChallenge = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.CHALLENGES.BASE, data);
  return response.data.result;
};

export const updateChallenge = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.CHALLENGES.ID(id), data);
  return response.data.result;
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
  console.log("Challenges: ", response.data.result);
  return response.data.result;
};

export const runCodeChallenge = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.CHALLENGES.RUN, data);
  return response.data.result;
};

export const submitCodeChallenge = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.CHALLENGES.SUBMIT, data);
  return response.data.result;
};

export const deleteChallenge = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.CHALLENGES.ID(id));
  return response.data.result;
};

// Levels related calls

export const createLevel = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.LEVELS.BASE, data);
  return response.data.result;
};

export const updateLevel = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.LEVELS.ID(id), data);
  return response.data.result;
};

export const deleteLevel = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.LEVELS.ID(id));
  return response.data.result;
};

//  Market related calls


export const getMarketItems = async (
  filter?: { category?: string; searchQuery?: string; sortOption?: string },
  page?: number,
  limit?: number
) => {
  const query = filter ? `${new URLSearchParams(filter as any)}` : "";
  const response = await axiosInstance.get(`${ROUTES.MARKET.BASE}?${query}&page=${page}&limit=${limit}`);
  return response.data.result;
};

export const getAllMarketItems = async () => {
};

export const createMarketItem = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.MARKET.BASE, data);
  return response.data.result;
};

export const updateMarketItem = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.MARKET.ID(id), data);
  return response.data.result;
};

export const deleteMarketItem = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.MARKET.ID(id));
  return response.data.result;
};


// Notifications ralated calls

export const markAllAsRead = async () => {
  const response = await axiosInstance.post(ROUTES.NOTIFICATIONS.MARK_ALL, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.result;
};

export const deleteNotification = async () => {
  const response = await axiosInstance.delete(
    ROUTES.NOTIFICATIONS.DELETE_ALL(localStorage.getItem("accessToken") || "")
  );
  return response.data.result;
};

export const toggleUserNotification = async () => {
  const response = await axiosInstance.patch(ROUTES.NOTIFICATIONS.TOGGLE_USER, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.result;
};

export const getCurrentNotifications = async () => {
  const response = await axiosInstance.get(
    `${ROUTES.NOTIFICATIONS.USER_ME}?accessToken=${localStorage.getItem("accessToken")}`
  );
  return response.data.result;
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
  return response.data.result;
};

export const updateItem = async (type: string, id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.INVENTORY.ID(type, id), data);
  return response.data.result;
};

export const deleteItem = async (type: string, id: string) => {
  const response = await axiosInstance.delete(ROUTES.INVENTORY.ID(type, id));
  return response.data.result;
};

export const getItems = async (type: string, search: string, page: number, limit: number) => {
  const response = await axiosInstance.get(
    `${ROUTES.INVENTORY.BASE(type)}?search=${search}&page=${page}&limit=${limit}`
  );
  return response.data.result;
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
  return response.data.result;
};

export const addSolution = async (data: any) => {
  const response = await axiosInstance.post(ROUTES.SOLUTIONS.BASE, data);
  return response.data.result;
};

export const updateSolution = async (id: string, data: any) => {
  const response = await axiosInstance.put(ROUTES.SOLUTIONS.ID(id), data);
  return response.data.result;
};

export const deleteSolution = async (id: string) => {
  const response = await axiosInstance.delete(ROUTES.SOLUTIONS.ID(id));
  return response.data.result;
};

export const addComment = async (solutionId: string, content: any) => {
  const response = await axiosInstance.post(ROUTES.SOLUTIONS.COMMENT(solutionId), {
    data: { solutionId, content },
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.result;
};

export const deleteComment = async (solutionId: string, commentId: string) => {
  const response = await axiosInstance.delete(ROUTES.SOLUTIONS.COMMENT_ID(solutionId, commentId));
  return response.data.result;
};

export const likeToggle = async (solutionId: string) => {
  const response = await axiosInstance.post(ROUTES.SOLUTIONS.LIKE(solutionId), {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.result;
};

//  Profile / User data related calls

export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get(ROUTES.USERS.ME);
    return response.data.result;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

export const getUser = async (username: string) => {
  const response = await axiosInstance.get(`${ROUTES.USERS.SEARCH}/${username}`);
  return response.data.result;
};

export const getUsers = async (search: string, page: number, limit: number) => {
  const response = await axiosInstance.get(
    `${ROUTES.USERS.SEARCH}?search=${search}&page=${page}&limit=${limit}`
  );
  return response.data.result;
};

export const getUserProgress = async (username: string) => {
  const response = await axiosInstance.get(ROUTES.SUBMISSION.USER(username));
  return response.data.result;
};

export const getCurrentUserProgress = async () => {
  const response = await axiosInstance.get(ROUTES.SUBMISSION.USER_ME);
  return response.data.result;
};

export const cancelMembership = async () => {
  const response = await axiosInstance.post(`/users/membership/cancel`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.result;
};

export const claimDailyReward = async () => {
  const response = await axiosInstance.post(ROUTES.REWARD.DAILY_CLAIM, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data.result;
};


//  Conversations list / Analytics / Leaderboard related calls

export const getCurrentUserChats = async (search: any) => {
  const response = await axiosInstance.get(`${ROUTES.CONVERSATIONS.USER_ME_DATA}?${new URLSearchParams(search)}`);
  return response.data.result;
};

export const getUserAnalytics = async () => {
  const response = await axiosInstance.get(ROUTES.ANALYTICS.USERS);
  return response.data.result;
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
  return response.data.result;
};

//  Admin / Fetching lists realated calls

export const getAllChallenges = async (search?: string, page?: number, limit?: number) => {
  const response = await axiosInstance.get(
    `${ROUTES.CHALLENGES.ADMIN_ALL}?search=${search}&page=${page}&limit=${limit}`
  );
  return response.data.result;
};

export const getLevels = async (page?: number, limit?: number) => {
  const response = await axiosInstance.get(`${ROUTES.LEVELS.BASE}?page=${page}&limit=${limit}`);
  return response.data.result;
};

export const getPlans = async (search?: string, page?: number, limit?: number) => {
  const response = await axiosInstance.get(`${ROUTES.MEMBERSHIP.BASE}?search=${search}&page=${page}&limit=${limit}`);
  return response.data.result;
};

export const getTwoActivePlans = async () => {
  const response = await axiosInstance.get(ROUTES.MEMBERSHIP.ACTIVE);
  return response.data.result;
};

export const getAllHistory = async (page?: number, limit?: number) => {
  const response = await axiosInstance.get(`${ROUTES.PURCHASE.FULL_HISTORY}?page=${page}&limit=${limit}`);
  return response.data.result;
};

export const getReports = async (filter?: any, page?: number, limit?: number) => {
  const q = filter ? `${new URLSearchParams(filter)}` : "";
  const response = await axiosInstance.get(`${ROUTES.REPORTS.BASE}?${q}&page=${page}&limit=${limit}`);
  return response.data.result;
};

export const getDomain = async (domainId: string) => {
  const response = await axiosInstance.get(ROUTES.CHALLENGES.ID(domainId));
  return response.data.result;
};

export const getHeatMap = async (userId: string, year?: number) => {
  const response = await axiosInstance.get(ROUTES.SUBMISSION.HEATMAP(userId, year));
  return response.data.result;
};



export const getCurrentNotificationsDeprecated = async () => {
  const response = await axiosInstance.get(
    `${ROUTES.NOTIFICATIONS.USER_ME}?accessToken=${localStorage.getItem("accessToken")}`
  );
  return response.data.result;
};
