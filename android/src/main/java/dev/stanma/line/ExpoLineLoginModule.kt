package dev.stanma.line

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.linecorp.linesdk.*
import com.linecorp.linesdk.api.LineApiClient
import com.linecorp.linesdk.api.LineApiClientBuilder
import com.linecorp.linesdk.auth.LineAuthenticationConfig
import com.linecorp.linesdk.auth.LineAuthenticationParams
import com.linecorp.linesdk.auth.LineLoginApi
import com.linecorp.linesdk.auth.LineLoginResult
import expo.modules.kotlin.exception.Exceptions

class ExpoLineLoginModule : Module() {
  private val LOGIN_REQUEST_CODE = 1;
  private var loginPromise: Promise? = null;

  private lateinit var context: Context;
  private var applicationInfo: ApplicationInfo? = null;
  private var channelId: String = "";
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoLineLogin')` in JavaScript.
    Name("ExpoLineLogin")

    OnCreate {
      context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      applicationInfo = when {
        android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU -> {
          context.packageManager?.getApplicationInfo(context.packageName.toString(), PackageManager.ApplicationInfoFlags.of(0))
        }
        else -> {
          context.packageManager?.getApplicationInfo(context.packageName.toString(), PackageManager.GET_META_DATA)
        }
      }
      channelId = applicationInfo?.metaData?.getInt("line.sdk.channelId").toString()
    }

    AsyncFunction("login") { scopes: List<String>, botPrompt: String, promise: Promise ->
      val loginConfig = LineAuthenticationConfig.Builder(channelId).build()

      val authenticationParams = LineAuthenticationParams.Builder()
        .scopes(Scope.convertToScopeList(scopes))
        .apply {
          botPrompt(LineAuthenticationParams.BotPrompt.valueOf(botPrompt))
        }
        .build()

      val currentActivity = appContext.currentActivity
      val context: Context = appContext.reactContext ?: throw Exceptions.ReactContextLost()

      val loginIntent = LineLoginApi.getLoginIntent(
        context,
        loginConfig,
        authenticationParams
      )

      currentActivity?.startActivityForResult(loginIntent, LOGIN_REQUEST_CODE)
      loginPromise = promise
    }

    OnActivityResult {_, (requestCode, resultCode, data) ->
      if (requestCode == LOGIN_REQUEST_CODE) {
        val result: LineLoginResult = LineLoginApi.getLoginResultFromIntent(data)

        when (result.responseCode) {
          LineApiResponseCode.SUCCESS -> {
            val resultDict = mapOf(
              "friendshipStatusChanged" to result.friendshipStatusChanged,
              "scope" to result.lineCredential?.scopes?.let {
                  Scope.join(it)
              },
              "IDTokenNonce" to result.lineIdToken?.nonce,
              "accessToken" to mapOf(
                "access_token" to result.lineCredential?.accessToken?.tokenString,
                "expires_in" to result.lineCredential?.accessToken?.expiresInMillis,
                "id_token" to result.lineIdToken?.rawString,
                "createdAt" to result.lineCredential?.accessToken?.issuedClientTimeMillis,
              ),
              "userProfile" to mapOf(
                "displayName" to result.lineProfile?.displayName,
                "userId" to result.lineProfile?.userId,
                "pictureUrl" to result.lineProfile?.pictureUrl,
              ),
            )

            loginPromise?.resolve(resultDict)
            loginPromise = null
          }
          LineApiResponseCode.CANCEL -> {
            loginPromise?.reject(result.responseCode.name, result.errorData.message, Exception(result.errorData.message))
            loginPromise = null
          }
          else -> {
            loginPromise?.reject(result.responseCode.name, result.errorData.message, Exception(result.errorData.message))
            loginPromise = null
          }
        }

        loginPromise = null
      }
    }

    AsyncFunction("logout") { promise: Promise ->
      val client: LineApiClient = LineApiClientBuilder(context, channelId).build()
      val logoutRes = client.logout()
      if (logoutRes.isSuccess) {
        promise.resolve(null)
      } else {
        promise.reject(logoutRes.responseCode.name, logoutRes.errorData.message, Exception(logoutRes.errorData.message))
      }
    }

    AsyncFunction("getProfile") { promise: Promise ->
      val client: LineApiClient = LineApiClientBuilder(context, channelId).build()
      val profileRes = client.profile
      if (profileRes.isSuccess) {
        val profile = profileRes.responseData
        val resultDict = mapOf(
          "displayName" to profile.displayName,
          "userId" to profile.userId,
          "pictureUrl" to profile.pictureUrl,
        )
        promise.resolve(resultDict)
      } else {
        promise.reject(profileRes.responseCode.name, profileRes.errorData.message, Exception(profileRes.errorData.message))
      }
    }

    AsyncFunction("getAccessToken") { promise: Promise ->
      val client: LineApiClient = LineApiClientBuilder(context, channelId).build()
      val accessTokenRes = client.currentAccessToken
      if (accessTokenRes.isSuccess) {
        val accessToken = accessTokenRes.responseData
        val resultDict = mapOf(
          "access_token" to accessToken.tokenString,
          "expires_in" to accessToken.expiresInMillis,
          "createdAt" to accessToken.issuedClientTimeMillis,
        )
        promise.resolve(resultDict)
      } else {
        promise.reject(accessTokenRes.responseCode.name, accessTokenRes.errorData.message, Exception(accessTokenRes.errorData.message))
      }
    }

    AsyncFunction("getBotFriendshipStatus") {promise: Promise ->
      val client: LineApiClient = LineApiClientBuilder(context, channelId).build()
      val botFriendshipStatusRes = client.friendshipStatus
      if (botFriendshipStatusRes.isSuccess) {
        val botFriendshipStatus = botFriendshipStatusRes.responseData
        promise.resolve(botFriendshipStatus.isFriend)
      } else {
        promise.reject(botFriendshipStatusRes.responseCode.name, botFriendshipStatusRes.errorData.message, Exception(botFriendshipStatusRes.errorData.message))
      }
    }
  }
}
