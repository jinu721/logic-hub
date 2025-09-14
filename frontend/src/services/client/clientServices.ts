import { User } from "@/types/user.types";
import { axiosInstance } from "../apiServices";
import { ReportIF } from "@/types/report.types";
import { CheckUserIF, LoginIF, RegisterIF } from "@/types/auth.types";


export const register = async (userData: RegisterIF) => {
  const response = await axiosInstance.post("/auth/register", userData);
  localStorage.setItem("userEmail", response.data.email);
  return response.data;
};
export const login = async (userData: LoginIF) => {
  const response = await axiosInstance.post("/auth/login", userData);
  console.log(`Login Response: ${JSON.stringify(response.data)}`);
  const data = response.data.data;
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
  const response = await axiosInstance.post("/users/check-user", userData);
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axiosInstance.post(
    "/auth/verify-otp",
    { email, otp },
    { withCredentials: true }
  );
  const accessToken = response.data.accessToken;
  const refreshToken = response.data.refreshToken;
  localStorage.removeItem("userEmail");
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", "true");
  document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
  return response.data.userData;
};

export const verifyLogin = async (token: string) => {
  const response = await axiosInstance.get(`/auth/verify-login?token=${token}`);
  const accessToken = response.data.accessToken;
  // const refreshToken = response.data.refreshToken;
  localStorage.setItem("user", "true");
  localStorage.setItem("accessToken", accessToken);
  // document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  // document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post(`/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await axiosInstance.post(`/auth/reset-password?token=${token}`, { password });
  return response.data;
};

export const banUser = async (userId: string) => {
  const response = await axiosInstance.patch(`/users/${userId}/ban`);
  return response.data;
};

export const updateUser = async (userData: User) => {
  console.log("UserData : ", userData);
  const response = await axiosInstance.put(`/users/me`, { userData });
  return response.data;
};

export const giftItem = async (
  type: string,
  itemId: string,
  userId: string
) => {
  const response = await axiosInstance.post(`/users/${userId}/gift/${type}`, {
    itemId,
  });
  return response.data;
};

export const searchUser = async (query: string) => {
  const response = await axiosInstance.get(`/users?search=${query}`);
  return response.data;
};

export const messageUser = async (userId: string) => {
  const response = await axiosInstance.post("/conversations", { userId });
  return response.data;
};


export const getCrrentUserFriends = async () => {
  const response = await axiosInstance.get(`/conversations/user/me/data`);
  return response.data;
};

interface GroupDataIF {
  name: string;
  description: string;
  isPrivate: boolean;
  members: string[];
  groupImage?: File;
}

export interface UpdateGroupIF {
  groupId: string;
  name?: string;
  description?: string;
  banner?: string;
}

export interface MemberUpdateIF {
  userId: string;
  groupId: string;
  members: string[];
}

export interface AdminUpdateIF {
  groupId: string;
  userId: string;
}

export const createGroup = async (groupData: GroupDataIF) => {
  const response = await axiosInstance.post("/groups", groupData);
  return response.data;
};

export const getAllGroups = async (filter: any) => {
  const response = await axiosInstance.get(
    `/groups?${new URLSearchParams(filter)}`
  );
  return response.data;
};

export const getGroupDetails = async (groupId: string) => {
  const response = await axiosInstance.get(`/groups/${groupId}`);
  return response.data;
};

export const updateGroup = async (groupData: UpdateGroupIF) => {
  const response = await axiosInstance.put(
    `/groups/${groupData.groupId}`,
    groupData
  );
  return response.data;
};

export const deleteGroup = async (groupId: string) => {
  const response = await axiosInstance.delete(`/groups/${groupId}/`);
  return response.data;
};

export const addMemberToGroup = async (groupId: string, members: string[]) => {
  const response = await axiosInstance.post(`/groups/${groupId}/members`, {
    members,
  });
  return response.data;
};

export const removeMemberFromGroup = async (data: MemberUpdateIF) => {
  const response = await axiosInstance.delete(
    `/groups/${data.groupId}/members/${data.userId}`
  );
  return response.data;
};

export const makeAdmin = async (data: AdminUpdateIF) => {
  const response = await axiosInstance.post(`/groups/${data.groupId}/admins`, {
    userId: data.userId,
  });
  return response.data;
};

export const removeAdmin = async (data: AdminUpdateIF) => {
  const response = await axiosInstance.delete(
    `/groups/${data.groupId}/admins/${data.userId}`
  );
  return response.data;
};

export const createPlan = async (data: any) => {
  const response = await axiosInstance.post("/membership", data);
  return response.data;
};
export const updatePlan = async (planId: string, data: any) => {
  const response = await axiosInstance.put(`/membership/${planId}`, data);
  return response.data;
};

export const createOrder = async (amount: number) => {
  const response = await axiosInstance.post("/purchase/create-order", {
    amount,
  });
  return response.data;
};

export const purchasePlan = async (data: any) => {
  const response = await axiosInstance.post("/purchase", data);
  return response.data;
};

export const getPlanHistory = async (id: any) => {
  const response = await axiosInstance.get(`/purchase/history/${id}`);
  return response.data;
};
export const getConversation = async (groupId: string) => {
  const response = await axiosInstance.get(
    `/conversations/by-group/${groupId}`
  );
  return response.data;
};

export const report = async (data: Partial<ReportIF>) => {
  const response = await axiosInstance.post("/reports", data);
  return response.data;
};

export const updateReportStatus = async (id: string, status: string) => {
  const response = await axiosInstance.patch(`/reports/${id}/status`, {
    status,
  });
  return response.data;
};

export const createChallenge = async (data: any) => {
  const response = await axiosInstance.post(`/challanges`, data);
  return response.data;
};

export const updateChallenge = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/challanges/${id}`, data);
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

  const response = await axiosInstance.get(
    `/challanges?${queryParams.toString()}`
  );
  return response.data;
};

export const runCodeChallenge = async (data: any) => {
  const response = await axiosInstance.post(`/challanges/run`, data);
  return response.data;
};
export const submitCodeChallenge = async (data: any) => {
  const response = await axiosInstance.post(`/challanges/submit`, data);
  return response.data;
};

export const deleteChallenge = async (id: string) => {
  const response = await axiosInstance.delete(`/challanges/${id}`);
  return response.data;
};

export const createLevel = async (data: any) => {
  const response = await axiosInstance.post(`/levels`, data);
  return response.data;
};

export const updateLevel = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/levels/${id}`, data);
  return response.data;
};
export const deleteLevel = async (id: string) => {
  const response = await axiosInstance.delete(`/levels/${id}`);
  return response.data;
};

export const createMarketItem = async (data: any) => {
  const response = await axiosInstance.post(`/market`, data);
  return response.data;
};
export const updateMarketItem = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/market/${id}`, data);
  return response.data;
};
export const deleteMarketItem = async (id: string) => {
  const response = await axiosInstance.delete(`/market/${id}`);
  return response.data;
};

export const purchaseMarketItem = async (id: string) => {
  const response = await axiosInstance.post(`/market/${id}/purchase`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.post(`/notifications/mark/all`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

export const deleteNotification = async () => {
  const response = await axiosInstance.delete(
    `/notifications/delete/all/${localStorage.getItem("accessToken")}`
  );
  return response.data;
};

export const changePassword = async (
  newPassword: string,
  oldPassword: string
) => {
  const response = await axiosInstance.post(`/auth/change-password`, {
    accessToken: localStorage.getItem("accessToken"),
    newPassword,
    oldPassword,
  });
  return response.data;
};

export const toggleUserNotification = async () => {
  const response = await axiosInstance.patch(`/notifications/toggle/user`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

export const getSolutionsByChallengeId = async (challengeId: string, search?: string, page?: number, limit?: number, sortBy?: string) => {
  const response = await axiosInstance.get(
    `/solutions/challenge/${challengeId}?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}`
  );
  return response.data;
};

export const addSolution = async (data: any) => {
  const response = await axiosInstance.post(`/solutions`, data);
  return response.data;
};

export const updateSolution = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/solutions/${id}`, data);
  return response.data;
};
export const deleteSolution = async (id: string) => {
  const response = await axiosInstance.delete(`/solutions/${id}`);
  return response.data;
};

export const addComment = async (solutionId: string, content: any) => {
  const response = await axiosInstance.post(
    `/solutions/${solutionId}/comment`,
    {
      data: { solutionId, content },
      accessToken: localStorage.getItem("accessToken"),
    }
  );
  return response.data;
};

export const deleteComment = async (solutionId: string, commentId: string) => {
  const response = await axiosInstance.delete(
    `/solutions/${solutionId}/comment/${commentId}`
  );
  return response.data;
};

export const likeToggle = async (solutionId: string) => {
  const response = await axiosInstance.post(`/solutions/${solutionId}/like`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get("/users/me");


    return response.data.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

export const cancelMembership = async () => {
  const response = await axiosInstance.post(`/users/membership/cancel`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

export const claimDailyReward = async () => {
  const response = await axiosInstance.post(`/users/daily-reward/claim`, {
    accessToken: localStorage.getItem("accessToken"),
  });
  return response.data;
};

export const getCurrentNotifications = async () => {
  const response = await axiosInstance.get(
    `/notifications/user/me?accessToken=${localStorage.getItem("accessToken")}`
  );
  return response.data;
};

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
  const response = await axiosInstance.post(
    `/inventory/${type}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateItem = async (type: string, id: string, data: any) => {
  const response = await axiosInstance.put(
    `/inventory/${type}/${id}`,
    data
  );
  return response.data;
};

export const deleteItem = async (type: string, id: string) => {
  const response = await axiosInstance.delete(`/inventory/${type}/${id}`);
  return response.data;
};

export const getItems = async (type: string,search:string,page:number,limit:number) => {
  const response = await axiosInstance.get(`/inventory/${type}?search=${search}&page=${page}&limit=${limit}`);
  return response.data;
};


export const getUser = async (username: string) => {
  const response = await axiosInstance.get(`/users/${username}`);
  return response.data.data;
};

export const getUsers = async (search: string,page: number,limit: number) => {
  const response = await axiosInstance.get(`/users?search=${search}&page=${page}&limit=${limit}`);
  return response.data.data;
}

export const getUserProgress = async (username: string) => {
  const response = await axiosInstance.get(`/progresses/recent/user/${username}`);
  return response.data;
};

export const getCurrentUserProgress = async () => {
  const response = await axiosInstance.get(`/progresses/recent/user/me`);
  return response.data;
};

export const getMarketItems = async (filter?:{category?: string; searchQuery?: string; sortOption?: string},page?: number,limit?: number) => {
  const response = await axiosInstance.get(`/market?${new URLSearchParams(filter)}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getAllMarketItems = async () => {
  
}

export const getCurrentUserChats = async (search:any) => {
  const response = await axiosInstance.get(`/conversations/user/me/data?${new URLSearchParams(search)}`);
  return response.data;
};

export const getConversationData = async (conversationId: string) => {
  const response = await axiosInstance.get(`/conversations/${conversationId}`);
  return response.data;
};

export const getInitialMessages = async (conversationId: string, limit: number) => {
  const response = await axiosInstance.get(`/messages?conversationId=${conversationId}&limit=${limit}`);
  return response.data;
}

export const getUserAnalytics = async () => {
  const response = await axiosInstance.get(`/analytics/users`);
  return response.data;
};

export const getLeaderboardAnalytics = async (based?:string,category?:string,period?:string,order?:string,page?:number,limit?:number) => {
  const response = await axiosInstance.get(`/analytics/leaderboard?based=${based}&category=${category}&period=${period}&order=${order}&page=${page}&limit=${limit}`);
  return response.data;
}

export const getAllChallenges = async (search?:string,page?:number,limit?:number) => {
  const response = await axiosInstance.get(`/challanges/admin/all?search=${search}&page=${page}&limit=${limit}`);
  return response.data;
};


export const getLevels = async (page?:number,limit?:number) => {
  const response = await axiosInstance.get(`/levels?page=${page}&limit=${limit}`);
  return response.data;
}

export const getPlans = async (search?:string,page?:number,limit?:number) => {
  const response = await axiosInstance.get(`/membership?search=${search}&page=${page}&limit=${limit}`);
  return response.data;
}

export const getTwoActivePlans = async () => {
  const response = await axiosInstance.get(`/membership/active`);
  return response.data;
}

export const getAllHistory = async (page?:number,limit?:number) => {
  const response = await axiosInstance.get(`/purchase/history?page=${page}&limit=${limit}`);
  return response.data;
}

export const getReports = async (filter?:any,page?:number,limit?:number) => {
  const response = await axiosInstance.get(`/reports?${new URLSearchParams(filter)}&page=${page}&limit=${limit}`);
  return response.data;
}

export const getDomain = async (domainId:string) => {
  const response = await axiosInstance.get(`/challanges/${domainId}`);
  return response.data;
}

export const getHeatMap = async (userId:string,year?:number) => {
  const response = await axiosInstance.get(`/progresses/user/heatmap/${userId}?year=${year}`);
  return response.data;
}