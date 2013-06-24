package com.weizoo.utils;

public interface CocosMessageInterface {
	public void onMessage(final String message, final String data);
	public void postMessage(final String message, final String data);
}
