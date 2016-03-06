package cn.com.fan6.mrwords;


import cn.com.fan6.views.MyWebView;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;


public class MainActivity extends Activity {
	private MyWebView web;
	private Context ctx;
	private long backPressedTime=0;
	

	@TargetApi(Build.VERSION_CODES.KITKAT)
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		ctx = getApplicationContext();
		setContentView(R.layout.activity_main);
		web=(MyWebView)findViewById(R.id.web);
		if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.KITKAT){
			Log.e("MRWords","DebuggingEnabled");
			web.setWebContentsDebuggingEnabled(true);
		}
		web.setWebChromeClient(new WebChromeClient(){
			
		});
		web.setWebViewClient(new WebViewClient(){
			public void onReceivedError(WebView view, int errorCode,
					String description, String failingUrl) {
			}

			public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error){
				handler.proceed();//
			}

			@Override
			public boolean shouldOverrideUrlLoading(WebView view, String url) {
				view.loadUrl(url);
				return true;
			}

			@Override
		    public void onPageStarted(WebView view, String url, Bitmap favicon) {
		        // TODO Auto-generated method stub
		        super.onPageStarted(view, url, favicon);
		    }


		    @Override
		    public void onPageFinished(WebView view, String url) {
		        // TODO Auto-generated method stub
		        super.onPageFinished(view, url);
		        //ProgressBar.setVisibility(View.GONE);
		    }
		});
		web.loadUrl(ctx.getString(R.string.launch_url));
		//web.loadUrl("http://192.168.191.1:3000/");
	}
	@Override
	public void onBackPressed(){
		long time = System.currentTimeMillis();
		if(time-backPressedTime>1000){
			Toast.makeText(getApplicationContext(), "再按一次退出MRWords",
				     Toast.LENGTH_LONG).show();
			backPressedTime=time;
		}else{
			exit();
		}
		super.onStop();
	}
	public void exit(){
		android.os.Process
		.killProcess(android.os.Process
				.myPid());
		MainActivity.this.finish();		
		System.exit(0);
	}
}
