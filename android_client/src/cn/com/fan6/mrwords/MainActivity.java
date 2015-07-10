package cn.com.fan6.mrwords;

import cn.com.fan6.views.MyWebView;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;


public class MainActivity extends Activity {
	private MyWebView web;
	private Context ctx;
	

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		ctx = getApplicationContext();
		setContentView(R.layout.activity_main);
		web=(MyWebView)findViewById(R.id.web);
		
		web.loadUrl(ctx.getString(R.string.launch_url));
	}
	@Override
	public void onBackPressed(){
		
	}
}
