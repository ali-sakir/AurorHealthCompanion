// const BASE_URL = "http://192.168.0.202:5000/api"; // Your machine's LAN IP

// export const register = async (fullName: string, email: string, password: string) => {
//   const res = await fetch(`${BASE_URL}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ fullName, email, password }),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Registration failed");
//   return data;
// };
