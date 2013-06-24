/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package com.weizoo.SetCard;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.UUID;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.json.JSONException;
import org.json.JSONObject;

import com.weizoo.utils.CocosMessageDelegate;
import com.weizoo.utils.CocosMessageInterface;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.NetworkInfo.State;
import android.net.Uri;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout.LayoutParams;

public class SetCard extends Cocos2dxActivity implements CocosMessageInterface{
	
	private WebView mWebView;
	
	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		
		CocosMessageDelegate.register(this);
	}
	
	@SuppressLint("DefaultLocale")
	public JSONObject getConnectionInfo(JSONObject params){
		
        ConnectivityManager conMan = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        
        //mobile 3G Data Network
        State mobile = conMan.getNetworkInfo(ConnectivityManager.TYPE_MOBILE).getState();
        //wifi
        State wifi = conMan.getNetworkInfo(ConnectivityManager.TYPE_WIFI).getState();
        
        NetworkInfo info = conMan.getActiveNetworkInfo();
		
		JSONObject ret = new JSONObject();
		
		try {
			ret.put("mobile", mobile==State.CONNECTED||mobile==State.CONNECTING);
			ret.put("wifi", wifi==State.CONNECTED||wifi==State.CONNECTING);
			
			String typeName = info.getTypeName().toLowerCase(); // WIFI/MOBILE
            if (typeName.equalsIgnoreCase("wifi")) {
            	ret.put("type", typeName);
            } else {
            	// 3gnet/3gwap/uninet/uniwap/cmnet/cmwap/ctnet/ctwap
                typeName = info.getExtraInfo().toLowerCase();
                ret.put("type", typeName);
            }
            
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ret;
	}
	
	public JSONObject getDeviceInfo(JSONObject params){
		final TelephonyManager tm = (TelephonyManager) getBaseContext().getSystemService(Context.TELEPHONY_SERVICE);
		 
	    final String tmDevice, tmSerial, androidId;
	    tmDevice = "" + tm.getDeviceId();
	    tmSerial = "" + tm.getSimSerialNumber();
	    androidId = "" + android.provider.Settings.Secure.getString(getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
	 
	    UUID deviceUuid = new UUID(androidId.hashCode(), ((long)tmDevice.hashCode() << 32) | tmSerial.hashCode());
	    String uniqueId = deviceUuid.toString();	
	    
	    JSONObject ret = new JSONObject();
	    try {
			ret.put("deviceId", uniqueId);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    
	    return ret;
	}
	
	public JSONObject getBatteryInfo(JSONObject params){
		//得到电池电量
		Intent batteryInfoIntent = getApplicationContext()  
				.registerReceiver( null, new IntentFilter( Intent.ACTION_BATTERY_CHANGED ) ) ;
		
		int status = batteryInfoIntent.getIntExtra( "status" , 0 );  //BatteryManager.BATTERY_STATUS_CHARGING 为正在充电
		int health = batteryInfoIntent.getIntExtra( "health" , 1 );  
		boolean present = batteryInfoIntent.getBooleanExtra( "present" , false );  
		int level = batteryInfoIntent.getIntExtra( "level" , 0 );  //电池电量等级
		int scale = batteryInfoIntent.getIntExtra( "scale" , 0 );   //电池满时百分比 = level / scale
		int plugged = batteryInfoIntent.getIntExtra( "plugged" , 0 );  //电池状态 
		int voltage = batteryInfoIntent.getIntExtra( "voltage" , 0 );  
		int temperature = batteryInfoIntent.getIntExtra( "temperature" , 0 ); // 温度的单位是0.1℃  
		String technology = batteryInfoIntent.getStringExtra( "technology" );  	
		
		JSONObject result = new JSONObject();
		
		try {	
			result.put("status", status);
			result.put("health", health);
			result.put("present", present);
			result.put("level", level);
			result.put("scale", scale);
			result.put("plugged", plugged);
			result.put("voltage", voltage);
			result.put("temperature", temperature);
			result.put("technology", technology);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return result;
	}
	
	@Override
	public void init(){
		super.init();
		mWebView = new WebView(this);
		
		mWebView.setWebChromeClient(new WebChromeClient());
		initWebViewSettings(mWebView);
		mWebView.setHorizontalScrollBarEnabled(false);
		mWebView.setVerticalScrollBarEnabled(false);
        
		mWebView.setWebViewClient(new WebViewClient()
        {
        	public boolean shouldOverrideUrlLoading(final WebView view, final String url) {
        		if(url.equals("weizoo:rl?main")){
        			//TODO
        		}else if(url.startsWith("market:")){
        			Intent intent= new Intent();        
        			intent.setAction("android.intent.action.VIEW");  

        			try{  
	        			Uri content_url = Uri.parse(url);   
	        			intent.setData(content_url);  
	        			startActivity(intent);
        			}catch(Exception ex){
        				String newURL = url.replaceAll("^market://", "http://play.google.com/store/apps/");
	        			Uri content_url = Uri.parse(newURL);   
	        			intent.setData(content_url);  
	        			startActivity(intent);
        			}
        		}else{
        			view.loadUrl(url);
        		}
        		
        		return true; 
        	}
        });		
		LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
		mWebView.setVisibility(View.GONE);
		
		this.addContentView(mWebView, layoutParams);
	}	
	
	@SuppressLint("SetJavaScriptEnabled")
	private void initWebViewSettings(WebView webView){
		final WebSettings settings = webView.getSettings();
		settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
		settings.setUseWideViewPort(true);
		settings.setJavaScriptEnabled(true);
		settings.setJavaScriptCanOpenWindowsAutomatically(true);
		settings.setSupportMultipleWindows(true);
		//settings.setBuiltInZoomControls(true);
		settings.setDefaultTextEncodingName("utf-8");
		settings.setDomStorageEnabled(true);		
		settings.setAppCacheEnabled(true);  
		settings.setLoadWithOverviewMode(true);
		settings.setSupportZoom(true);
		settings.setUserAgentString("Android");		
	}	
		
    static {
    	//System.loadLibrary("websockets");
    	System.loadLibrary("game");
    }

	@Override
	public void onMessage(final String message, final String data) {
		// TODO Auto-generated method stub
		Log.d("Log", message);
		
		
		if(message.equals("message")){
			try {
				//先判断数据是否是json格式
				JSONObject jsonData = new JSONObject(data);
				if(jsonData.has("jsonrpc")){
					JSONObject result = new JSONObject();
					result.put("id", jsonData.getInt("id"));
					result.put("jsonrpc", "2.0");
					try {
						@SuppressWarnings("rawtypes")
						Class[] cargs = new Class[1];
						cargs[0] = JSONObject.class;
						Method method = this.getClass().getMethod(jsonData.getString("method"), cargs);
						result.put("result", method.invoke(this, jsonData.getJSONObject("params")));
						this.postMessage("message", result.toString());
					} catch (Exception e) {
						result.put("error", e.getMessage());
						e.printStackTrace();
					}		
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
		}
		
		if(message.equals("HTTP_OPEN")){
			this.runOnUiThread(new Runnable(){
				@Override
				public void run() {
					//CardActivity.this.mWebView.setVisibility(View.VISIBLE);
					//CardActivity.this.mWebView.loadUrl(data);
        			Intent intent= new Intent(SetCard.this, WebActivity.class);        
        			intent.putExtra("url", data);
        			startActivity(intent);
				}			
			});
		}
		
		if(message.equals("HTTP_CLOSE")){
			this.runOnUiThread(new Runnable(){
				@Override
				public void run() {
					//CardActivity.this.mWebView.setVisibility(View.GONE);
				}			
			});
		}
	}

	@Override
	public void postMessage(String message, String data) {
		CocosMessageDelegate.postMessage(message, data);
	}
}
