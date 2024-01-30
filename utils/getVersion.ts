import Constants from "expo-constants";
import { PRODUCTION, RELEASE_CHANNEL } from "../config";

const getVersion = () => {
  let env = PRODUCTION ? "" : `${RELEASE_CHANNEL || "staging"}-`;
  env += `${Constants.expoConfig.version}`;
  if (Constants?.expoConfig?.extra?.version)
    env += `-v${Constants.expoConfig.extra.version}`;
  return env;
};

export default getVersion;
