import ExpoModulesCore
import LineSDK

enum BotPromptType: String, Enumerable {
    case aggressive
    case normal
}

public class ExpoLineLoginModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        Name("ExpoLineLogin")
        
        AsyncFunction("login") { (scope: [String], botPrompt: BotPromptType?, promise: Promise) in
            let scopes = scope.map{ LoginPermission(rawValue: $0) }
            var parameters: LoginManager.Parameters = LoginManager.Parameters.init()
            if (botPrompt != nil) {
                parameters.botPromptStyle = LoginManager.BotPrompt(rawValue: botPrompt!.rawValue)
            }
            
            DispatchQueue.main.async {
                LoginManager.shared.login(
                    permissions: Set(scopes),
                    in: nil,
                    parameters: parameters
                ) { result in
                    switch result {
                    case .success(let value):
                        do {
                            let valueJson = try value.toJSON()
                            promise.resolve(valueJson)
                        } catch {
                            promise.reject(Exception(name: "JSON Parse Error", description: "Error in Parse to JSON"))
                        }
                    case .failure(let error):
                        promise.reject(error)
                    }
                }
            }
        }
        
        AsyncFunction("logout") { (promise: Promise) in
            LoginManager.shared.logout{ result in
                switch(result) {
                case .success: promise.resolve(nil)
                case .failure(let error): promise.reject(error)
                }
            }
        }
        
        AsyncFunction("getProfile") { (promise: Promise) in
            API.getProfile{ result in
                switch result {
                case .success(let profile):
                    do {
                        let profileJson = try profile.toJSON()
                        promise.resolve(profileJson)
                    } catch {
                        promise.reject(Exception(name: "JSON Parse Error", description: "Error in Parse to JSON"))
                    }
                case .failure(let error):
                    promise.reject(error)
                }
            }
        }
        
        AsyncFunction("getAccessToken") { (promise: Promise) in
            if let token = AccessTokenStore.shared.current {
                do {
                    promise.resolve(try token.toJSON())
                } catch {
                    promise.reject(Exception(name: "JSON Parse Error", description: "Error in Parse to JSON"))
                }
            } else {
                promise.reject(Exception(name: "Error", description: "Get AccessToken Error"))
            }
        }
        
        AsyncFunction("getBotFriendshipStatus") { (promise: Promise) in
            API.getBotFriendshipStatus{ result in
                switch result {
                case .success(let value):
                    promise.resolve(value.friendFlag)
                case .failure(let error):
                    promise.reject(error)
                }
            }
        }
    }
}

extension Encodable {
    func toJSON() throws -> Any {
        let data = try JSONEncoder().encode(self)
        return try JSONSerialization.jsonObject(with: data, options: [])
    }
}
