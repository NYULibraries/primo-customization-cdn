proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Proto https;
proxy_set_header X-Forwarded-Ssl on;
proxy_set_header X-Forwarded-Port 443;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-NginX-Proxy true;
