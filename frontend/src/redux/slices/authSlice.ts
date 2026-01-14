import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { register, verifyOtp, login } from "@/services/client/clientServices";
import { LoginIF, RegisterIF } from "@/types/auth.types";

export const userRegister = createAsyncThunk<
  string,
  RegisterIF,
  { rejectValue: string }
>("auth/register", async (userData: RegisterIF, { rejectWithValue }) => {
  try {
    console.log("Registering user with data:", userData);
    await register(userData);
    console.log("User registered successfully");
    return "Registration successful! Please verify your email.";
  } catch (err: any) {
    return rejectWithValue(err.response.data.message);
  }
});


export const userverify = createAsyncThunk<
  any,
  { email: string, otp: string },
  { rejectValue: string }
>(
  "auth/verify",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const userData = await verifyOtp(email, otp);
      return userData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Verification failed");
    }
  }
);


export const userLogin = createAsyncThunk<
  any,
  LoginIF,
  { rejectValue: string }
>("auth/login", async (userData: LoginIF, { rejectWithValue }) => {
  try {
    const response = await login(userData);


    if (response.security) {
      return { security: true, message: response.message };
    }

    return response;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

interface AuthState {
  loading: boolean;
  user: any;
  error: string | undefined | null;
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      state.user = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userRegister.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userRegister.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(userRegister.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });

    builder.addCase(userverify.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userverify.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(userverify.fulfilled, (state) => {
      state.loading = false;
      state.user = true;
      state.error = null;
    });
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
  },
});


export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
