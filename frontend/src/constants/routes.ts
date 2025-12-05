type Id = string | number;

export const ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    VERIFY_LOGIN: "/auth/verify-login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  USERS: {
    CHECK: "/users/check-user",
    BAN: (id: Id) => `/users/${id}/ban`,
    ME: "/users/me",
    SEARCH: "/users",
    GIFT: (userId: Id, type: string) => `/users/${userId}/gift/${type}`,
    CHANGE_PASSWORD: "/users/change-password",
    PURCHASE_MARKET_ITEM: (id: Id) => `/users/purchase/market/${id}`,
  },

  GROUPS: {
    BASE: "/groups",
    ID: (id: Id) => `/groups/${id}`,
    MEMBERS: (id: Id) => `/groups/${id}/members`,
    MEMBER_REMOVE: (gid: Id, uid: Id) => `/groups/${gid}/members/${uid}`,
    ADMINS: (id: Id) => `/groups/${id}/admins`,
    ADMIN_REMOVE: (gid: Id, uid: Id) => `/groups/${gid}/admins/${uid}`,
  },

  CONVERSATIONS: {
    BASE: "/conversations",
    USER_ME_DATA: "/conversations/user/me/data",
    BY_GROUP: (gid: Id) => `/conversations/by-group/${gid}`,
    ID: (id: Id) => `/conversations/${id}`,
  },
  MESSAGES: {
    BASE: "/messages",
    GET_INITIAL_MESSAGES: (conversationId: Id, limit: number) =>
      `/messages?conversationId=${conversationId}&limit=${limit}`,
  },

  MEMBERSHIP: {
    BASE: "/memberships",
    ID: (id: Id) => `/memberships/${id}`,
    ACTIVE: "/memberships/active",
    CANCEL: "/memberships/cancel",
  },

  PURCHASE: {
    CREATE_ORDER: "/purchases/create-order",
    BASE: "/purchases",
    HISTORY: (id: Id) => `/purchases/history/${id}`,
    FULL_HISTORY: "/purchases/history",
  },

  REPORTS: {
    BASE: "/reports",
    ID_STATUS: (id: Id) => `/reports/${id}/status`,
  },

  CHALLENGES: {
    BASE: "/challenges",
    ID: (id: Id) => `/challenges/${id}`,
    RUN: "/challenges/run",
    SUBMIT: "/challenges/submit",
    ADMIN_ALL: "/challenges/all",
  },

  LEVELS: {
    BASE: "/levels",
    ID: (id: Id) => `/levels/${id}`,
  },

  MARKET: {
    BASE: "/market",
    ID: (id: Id) => `/market/${id}`,
  },

  NOTIFICATIONS: {
    MARK_ALL: "/notifications/mark/all",
    DELETE_ALL: (token: string) => `/notifications/delete/all/${token}`,
    USER_ME: "/notifications/user/me",
    TOGGLE_USER: "/notifications/toggle/user",
  },

  INVENTORY: {
    BASE: (type: string) => `/inventory/${type}`,
    ID: (type: string, id: Id) => `/inventory/${type}/${id}`,
  },

  SOLUTIONS: {
    BASE: "/solutions",
    ID: (id: Id) => `/solutions/${id}`,
    COMMENT: (sid: Id) => `/solutions/${sid}/comment`,
    COMMENT_ID: (sid: Id, cid: Id) => `/solutions/${sid}/comment/${cid}`,
    LIKE: (sid: Id) => `/solutions/${sid}/like`,
    BY_CHALLENGE: (cid: Id) => `/solutions/challenge/${cid}`,
  },

  ANALYTICS: {
    USERS: "/analytics/users",
    LEADERBOARD: "/analytics/leaderboard",
  },

  SUBMISSION: {
    USER_ME: "/submissions/recent/user/me",
    USER: (username: string) => `/submissions/recent/user/${username}`,
    HEATMAP: (uid: Id, year?: number) => `/submissions/user/heatmap/${uid}${year ? `?year=${year}` : ''}`,
  },
  
  REWARD: {
    DAILY_CLAIM: "/users/daily-reward/claim",
  },
} as const;
