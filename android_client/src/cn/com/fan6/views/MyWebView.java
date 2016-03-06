package cn.com.fan6.views;

import java.util.HashMap;

import android.R;
import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Build;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.ViewConfiguration;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MyWebView extends WebView{
	private Context ctx;
	private HashMap<Integer, Long> touchTimes =new HashMap<Integer, Long>();

	public MyWebView(Context context) {
		this(context, null, R.attr.webViewStyle);
	}

	public MyWebView(Context context, AttributeSet attrs) {
		this(context, attrs, R.attr.webViewStyle);
	}

	public MyWebView(Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
		this.ctx=context;
		init();
		touchTimes.put(MotionEvent.ACTION_DOWN, System.currentTimeMillis());
		touchTimes.put(MotionEvent.ACTION_UP, System.currentTimeMillis());

	}
	@SuppressLint({ "NewApi", "SetJavaScriptEnabled" })
	private void init(){
		this.setInitialScale(0);
		this.setVerticalScrollBarEnabled(false);
		
		WebSettings settings=this.getSettings();
		settings.setJavaScriptEnabled(true);
		settings.setJavaScriptCanOpenWindowsAutomatically(true);
		settings.setAllowFileAccess(true);
		if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.JELLY_BEAN){
			settings.setAllowFileAccessFromFileURLs(true);
			settings.setAllowUniversalAccessFromFileURLs(true);		
		}
		settings.setAllowContentAccess(true);
		settings.setDatabaseEnabled(true);
		settings.setDomStorageEnabled(true);
		settings.setUseWideViewPort(true);
		settings.setLoadWithOverviewMode(true);
		settings.setBuiltInZoomControls(false);
		settings.setSupportZoom(false);//
	}
	@Override
	public boolean dispatchTouchEvent(MotionEvent ev) {
		long currentTouchTime = System.currentTimeMillis();
		long preTouchTime = 0;
		if(ev.getAction()==MotionEvent.ACTION_DOWN||ev.getAction()==MotionEvent.ACTION_UP){
			preTouchTime=touchTimes.get(ev.getAction());
			touchTimes.put(ev.getAction(),currentTouchTime);
			if (currentTouchTime - preTouchTime <= ViewConfiguration
					.getDoubleTapTimeout()
					|| currentTouchTime - preTouchTime <= 500) {
				return true;
			}
		}
		
		return super.dispatchTouchEvent(ev);
	}
}
