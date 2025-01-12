import { BundleIdentifier } from "@expo/config-plugins/build/ios";
import {
  withInfoPlist,
  withAndroidManifest,
  AndroidConfig,
  ConfigPlugin,
} from "expo/config-plugins";

const withMyApiKey: ConfigPlugin<{
  channelId: string;
  universalLink?: string;
}> = (config, { channelId, universalLink }) => {
  config = withInfoPlist(config, (config) => {
    config.modResults["LINE_CHANNEL_ID"] = channelId;

    // push scheme to CFBundleURLSchemes
    config.modResults["CFBundleURLTypes"]?.push({
      CFBundleURLSchemes: [
        `line3rdp.${BundleIdentifier.getBundleIdentifier(config)}`,
      ],
    });

    if (!config.modResults["LSApplicationQueriesSchemes"]) {
      console.log("Adding LSApplicationQueriesSchemes to Info.plist");
      config.modResults["LSApplicationQueriesSchemes"] = [];
    }
    config.modResults["LSApplicationQueriesSchemes"]?.push("lineauth2");

    if (universalLink) {
      config.modResults["LINE_UNIVERSAL_LINK_URL"] = universalLink;
    }

    return config;
  });

  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "line.sdk.channelId",
      channelId,
    );

    return config;
  });

  return config;
};

export default withMyApiKey;
