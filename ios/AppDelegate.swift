import ExpoModulesCore
import LineSDK

public class AppLifecycleDelegate: ExpoAppDelegateSubscriber {
    
    public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        let channelID = Bundle.main.object(forInfoDictionaryKey: "LINE_CHANNEL_ID") as! String
        let univeralLinkStr = Bundle.main.object(forInfoDictionaryKey: "LINE_UNIVERSAL_LINK") as? String
        debugPrint(channelID)
        debugPrint(univeralLinkStr as Any)
        
        if univeralLinkStr != nil {
            let universalLink = URL(string: univeralLinkStr ?? "")
            LoginManager.shared.setup(channelID: channelID, universalLinkURL: universalLink)
        } else {
            LoginManager.shared.setup(channelID: channelID, universalLinkURL: nil)
        }
        
        return true
    }
    
    public func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return LoginManager.shared.application(app, open: url, options: options)
    }
    
    public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return LoginManager.shared.application(application, open: userActivity.webpageURL)
    }
}
