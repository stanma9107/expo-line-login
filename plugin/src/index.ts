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
    config.modResults["CFBundleURLTypes"] = [
      {
        CFBundleURLSchemes: [
          ...config.ios?.infoPlist?.CFBundleURLTypes?.[0]?.CFBundleURLSchemes,
          `line3rdp.${BundleIdentifier.getBundleIdentifier(config)}`,
        ],
      },
    ];
    config.modResults["LSApplicationQueriesSchemes"] = ["lineauth2"];

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
      "LINE_CHANNEL_ID",
      channelId,
    );

    if (universalLink) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "LINE_UNIVERSAL_LINK_URL",
        universalLink,
      );
    }

    return config;
  });

  return config;
};

export default withMyApiKey;
