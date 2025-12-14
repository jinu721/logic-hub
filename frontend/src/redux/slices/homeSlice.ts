import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { ChallengeDomainIF } from "@/types/domain.types";
import { UserIF } from "@/types/user.types";
import { RootState } from "../store";

export interface HomeState {
    challenges: ChallengeDomainIF[];
    user: UserIF | null;
    filters: {
        type: string[];
        level: string[];
        status: string[];
        tags: string[];
        searchQuery: string;
    };
    isLoading: boolean;
    error: string | null;
    lastFetch: number;
}

const initialState: HomeState = {
    challenges: [],
    user: null,
    filters: {
        type: [],
        level: [],
        status: [],
        tags: [],
        searchQuery: "",
    },
    isLoading: false,
    error: null,
    lastFetch: 0,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setChallenges(state, action: PayloadAction<ChallengeDomainIF[]>) {
            state.challenges = action.payload;
            state.lastFetch = Date.now();
            state.isLoading = false;
            state.error = null;
        },
        setUser(state, action: PayloadAction<UserIF | null>) {
            state.user = action.payload;
        },
        setFilters(state, action: PayloadAction<HomeState["filters"]>) {
            state.filters = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.filters.searchQuery = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },
        updateChallengeStatus(state, action: PayloadAction<{ id: string; status: any }>) {
            const { id, status } = action.payload;
            const challenge = state.challenges.find((c) => c._id === id);
            if (challenge) {
                challenge.userStatus = status;
            }
        },
    },
});

export const {
    setChallenges,
    setUser,
    setFilters,
    setSearchQuery,
    setLoading,
    setError,
    updateChallengeStatus,
} = homeSlice.actions;

const selectHome = (state: RootState) => state.home;

export const selectAllChallenges = createSelector(
    selectHome,
    (home) => home.challenges
);

export const selectIsLoading = createSelector(selectHome, (home) => home.isLoading);
export const selectError = createSelector(selectHome, (home) => home.error);
export const selectUser = createSelector(selectHome, (home) => home.user);
export const selectFilters = createSelector(selectHome, (home) => home.filters);
export const selectLastFetch = createSelector(selectHome, (home) => home.lastFetch);

export const selectFilteredChallenges = createSelector(
    [selectAllChallenges, selectFilters],
    (challenges, filters) => {
        return challenges.filter((challenge) => {
            if (filters.type.length > 0 && !filters.type.includes(challenge.type)) {
                return false;
            }

            if (filters.level.length > 0 && !filters.level.includes(challenge.level)) {
                return false;
            }

            if (filters.status.length > 0) {
                const status = challenge.userStatus || "pending";
                if (!filters.status.includes(status)) {
                    return false;
                }
            }

            if (filters.tags.length > 0) {
                const hasTag = filters.tags.some((tag) => challenge.tags?.includes(tag));
                if (!hasTag) return false;
            }
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const titleMatch = challenge.title.toLowerCase().includes(query);
                const descMatch = challenge.description?.toLowerCase().includes(query);
                if (!titleMatch && !descMatch) return false;
            }

            return true;
        });
    }
);

export default homeSlice.reducer;
