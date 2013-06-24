package com.weizoo.utils;

import java.lang.ref.WeakReference;
import java.util.ArrayList;

public class CocosMessageDelegate {
	private static native void receiveMessage(byte[] message, byte[] data);
	private static ArrayList<WeakReference<CocosMessageInterface>> subscribers 
		= new ArrayList<WeakReference<CocosMessageInterface>>(); 
	
	public static void register(CocosMessageInterface target){
		subscribers.add(new WeakReference<CocosMessageInterface>(target));
	}
	
	public static void unregister(CocosMessageInterface target){
		for(int i = subscribers.size() - 1; i >= 0; i--){
			WeakReference<CocosMessageInterface> obj = subscribers.get(i);
			if(obj.get() ==  target){
				subscribers.remove(obj);
				break;
			}
		}
	}
	
	public static void onMessage(final String message, final String data){
		for(int i = subscribers.size() - 1; i >= 0; i--){
			WeakReference<CocosMessageInterface> target = subscribers.get(i);
			if(target.get() != null){
				target.get().onMessage(message, data);
			}else{
				subscribers.remove(i); //remove null subscribers
			}
		}
	}
	
	public static void postMessage(final String message, final String data){
		if(data == null){ 
			receiveMessage(message.getBytes(), "".getBytes());
		}else{
			receiveMessage(message.getBytes(), data.getBytes());
		}
	}
}
