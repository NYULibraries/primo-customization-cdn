proxy_set_header Accept-Encoding "";

sub_filter_once off;
sub_filter_types application/javascript text/javascript;
sub_filter "https://cdn-dev.library.nyu.edu/primo-customization" "https://e2e.nyu.primo.exlibrisgroup.com/primo-customization";
sub_filter "https://cdn.library.nyu.edu/primo-customization" "https://e2e.nyu.primo.exlibrisgroup.com/primo-customization";
sub_filter "https://cdn.library.nyu.edu/chatwidget-embed/index.min.js" "https://e2e.nyu.primo.exlibrisgroup.com/chatwidget-embed/index.min.js";
sub_filter "https://cdn.library.nyu.edu/statuspage-embed/index.min.js" "https://e2e.nyu.primo.exlibrisgroup.com/statuspage-embed/index.min.js";
