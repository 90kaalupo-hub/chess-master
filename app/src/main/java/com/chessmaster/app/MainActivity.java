package com.chessmaster.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private WebView webView;
    private WebViewAssetLoader assetLoader;
    private String pendingSharedContent;
    private boolean pageLoaded;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        // Serve the local service worker and its resources through the same
        // secure appassets origin used by the page.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
                @Override
                public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                    return assetLoader.shouldInterceptRequest(request.getUrl());
                }
            });
        }

        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return assetLoader.shouldInterceptRequest(Uri.parse(url));
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageLoaded = true;
                deliverPendingShare();
            }
        });
        webView.setWebChromeClient(new WebChromeClient());
        setContentView(webView);

        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
        handleShareIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleShareIntent(intent);
        deliverPendingShare();
    }

    private void handleShareIntent(Intent intent) {
        if (intent == null || !Intent.ACTION_SEND.equals(intent.getAction())) {
            return;
        }

        StringBuilder shared = new StringBuilder();
        String text = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (text != null && !text.trim().isEmpty()) {
            shared.append(text.trim());
        }

        Uri stream = null;
        if (Build.VERSION.SDK_INT >= 33) {
            stream = intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri.class);
        } else {
            //noinspection deprecation
            stream = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        }

        if (stream != null) {
            String fileText = readSharedUri(stream);
            if (fileText != null && !fileText.trim().isEmpty()) {
                if (shared.length() > 0) shared.append('\n');
                shared.append(fileText);
            }
        }

        if (shared.length() > 0) {
            pendingSharedContent = shared.toString();
            pageLoaded = false;
        }
    }

    private String readSharedUri(Uri uri) {
        try (InputStream input = getContentResolver().openInputStream(uri);
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            if (input == null) return null;
            byte[] buffer = new byte[8192];
            int count;
            while ((count = input.read(buffer)) != -1) {
                output.write(buffer, 0, count);
            }
            return new String(output.toByteArray(), StandardCharsets.UTF_8);
        } catch (Exception error) {
            return null;
        }
    }

    private void deliverPendingShare() {
        if (webView == null || !pageLoaded || pendingSharedContent == null) {
            return;
        }

        final String content = pendingSharedContent;
        pendingSharedContent = null;
        String quoted = JSONObject.quote(content);
        String script = "(function(value) {" +
                "if (typeof showHome !== 'function' || typeof showImport !== 'function') return;" +
                "showHome(); showImport();" +
                "var pgn = /\\[\\s*Event\\s+\"/i.test(value) || /^\\s*(?:\\[[^\\]]+\\]\\s*)*1\\.(?:\\.\\.)?\\s+/m.test(value);" +
                "if (pgn) {" +
                "var field = document.getElementById('pgnInput'); if (field) field.value = value;" +
                "if (typeof loadPGN === 'function') loadPGN();" +
                "} else {" +
                "var match = value.match(/https?:\\/\\/(?:www\\.)?chess\\.com\\/game\\/(?:live|daily)\\/\\d+(?:[^\\s]*)?/i);" +
                "if (match) {" +
                "var link = document.getElementById('chessComLinkInput'); if (link) link.value = match[0].replace(/[),.;]+$/, '');" +
                "if (typeof importChessComLink === 'function') importChessComLink();" +
                "} else {" +
                "var status = document.getElementById('importStatus'); if (status) status.textContent = 'Shared content received. Share a PGN export or paste PGN moves to import the game.';" +
                "}" +
                "}" +
                "})(" + quoted + ");";
        webView.evaluateJavascript(script, null);
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript(
                    "(function(){var game=document.getElementById('game');" +
                    "if(game && game.style.display === 'block'){showHome();return 'handled';}" +
                    "return 'exit';})()",
                    value -> {
                        if (!"\"handled\"".equals(value)) {
                            finish();
                        }
                    });
            return;
        }
        super.onBackPressed();
    }
}
