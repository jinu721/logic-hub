import { cookies } from "next/headers";



export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieString = [
    accessToken ? `accessToken=${accessToken}` : "",
    refreshToken ? `refreshToken=${refreshToken}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  return {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    Cookie: cookieString,
  };
};