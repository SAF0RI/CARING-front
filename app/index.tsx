import { queries } from "@/entities";
import { Role } from "@/entities/user/api/schema";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import "../index.css";

export default function Index() {
  const { data: userInfo } = useQuery(queries.user.userInfo);
  if (userInfo?.role === Role.CARE) {
    return <Redirect href="/(tabs-care)/home" />;
  }
  return <Redirect href="/(tabs-user)/diary-list" />;
}
