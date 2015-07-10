package cn.com.fan6.views;

import android.R;
import android.content.Context;
import android.util.AttributeSet;
import android.webkit.WebView;

public class MyWebView extends WebView{

	public MyWebView(Context context) {
		this(context, null, R.attr.webViewStyle);
	}

	public MyWebView(Context context, AttributeSet attrs) {
		this(context, attrs, R.attr.webViewStyle);
	}

	public MyWebView(Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
		//init();

	}
}
