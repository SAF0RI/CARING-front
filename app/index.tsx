import { Redirect } from "expo-router";
import "../index.css";

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
